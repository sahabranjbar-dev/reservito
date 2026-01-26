"use server";

import prisma from "@/utils/prisma";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// دریافت لیست پرسنل برای دراپ‌داون
export async function getStaffAction(businessId: string) {
  try {
    const staff = await prisma.staffMember.findMany({
      where: { businessId, isActive: true, deletedAt: null },
      select: { id: true, name: true, avatar: true },
      orderBy: { name: "asc" },
    });
    return { success: true, data: staff };
  } catch (error) {
    return { success: false, error: "خطا در دریافت لیست پرسنل" };
  }
}

// دریافت شیفت‌های یک پرسنل خاص
export async function getStaffScheduleAction(staffId: string) {
  try {
    const schedules = await prisma.staffAvailability.findMany({
      where: { staffId },
      orderBy: { dayOfWeek: "asc" },
    });
    return { success: true, data: schedules };
  } catch (error) {
    return { success: false, error: "خطا در دریافت شیفت‌ها" };
  }
}

// ایجاد یا ویرایش شیفت‌ها (Upsert)
// ما آرایه‌ای از شیفت‌ها را می‌گیریم و در یک تراکنش ذخیره می‌کنیم
export async function upsertScheduleAction(staffId: string, schedules: any[]) {
  try {
    // اعتبارسنجی ساده: پایان زمان باید بعد از شروع باشد
    for (const sch of schedules) {
      if (!sch.isClosed && sch.startTime >= sch.endTime) {
        return {
          success: false,
          error: `زمان پایان در ${sch.label} باید بعد از زمان شروع باشد.`,
        };
      }
    }

    // استفاده از تراکنش برای اطمینان از یکپارچگی داده‌ها
    await prisma.$transaction(
      schedules.map((schedule) =>
        prisma.staffAvailability.upsert({
          where: {
            staffId_dayOfWeek: {
              staffId,
              dayOfWeek: schedule.dayOfWeek,
            },
          },
          update: {
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            isClosed: schedule.isClosed,
          },
          create: {
            staffId,
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            isClosed: schedule.isClosed,
          },
        })
      )
    );

    // بروزرسانی کش برای نمایش تغییرات فوری
    revalidatePath("/dashboard/business/settings/shifts");

    return { success: true, message: "شیفت‌ها با موفقیت ذخیره شدند" };
  } catch (error) {
    console.error("Upsert Schedule Error:", error);
    return { success: false, error: "خطا در ذخیره سازی" };
  }
}
