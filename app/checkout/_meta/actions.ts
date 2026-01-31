"use server";

import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { revalidatePath } from "next/cache";

export async function createBookingAction(params: {
  businessId: string;
  staffId: string; // الان این فیلد الزامی شد
  serviceId: string;
  date: string;
  time: string;
  customerNotes?: string;
}) {
  const { businessId, staffId, serviceId, date, time, customerNotes } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      error: "لطفاً ابتدا وارد شوید",
    };
  }

  try {
    // 1. اطلاعات سرویس
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { duration: true, price: true, name: true },
    });

    if (!service) return { success: false, error: "سرویس یافت نشد" };

    // 2. ساخت زمان‌ها
    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + service.duration * 60000);

    // 3. بررسی نهایی دسترسی پرسنل (Safety Check)
    // حتی اگر کلاینت هک کند، چک می‌کنیم که این پرسنل برای این سرویس آزاد است
    const staff = await prisma.staffMember.findFirst({
      where: {
        id: staffId,
        businessId: businessId,
        isActive: true,
        deletedAt: null,
        services: { some: { serviceId: serviceId } },
      },
      include: {
        bookings: {
          where: {
            status: { in: ["PENDING", "CONFIRMED"] },
            startTime: { lt: endTime },
            endTime: { gt: startTime },
          },
          select: { id: true },
        },
      },
    });

    if (!staff) {
      return { success: false, error: "پرسنل نامعتبر است." };
    }

    if (staff.bookings.length > 0) {
      return {
        success: false,
        error:
          "متاسفانه این پرسنل در این زمان رزرو شد. لطفاً پرسنل دیگری انتخاب کنید.",
      };
    }

    // 4. ثبت رزرو
    const booking = await prisma.booking.create({
      data: {
        businessId,
        customerId: session.user.id,
        serviceId,
        staffId, // استفاده از پرسنل ارسالی
        startTime,
        endTime,
        customerNotes,
        status: "PENDING",
      },
    });

    revalidatePath(`/business/${businessId}`);
    revalidatePath("/checkout");

    return {
      success: true,
      message: "رزرو شما با موفقیت ثبت شد",
      bookingId: booking.id,
    };
  } catch (error) {
    console.error("Booking Error:", error);
    return { success: false, error: "خطا در ثبت رزرو" };
  }
}

export async function getServiceDetail(serviceId: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return { success: false, error: "سرویس یافت نشد" };
    }

    return { success: true, service };
  } catch (error) {
    console.error("get service Error:", error);
    return { success: false, error: "خطا در دریافت سرویس" };
  }
}

type AvailableStaff = {
  id: string;
  name: string;
  avatar: string | null;
};

export async function getAvailableStaffAction(params: {
  businessId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}) {
  const { businessId, serviceId, date, time } = params;

  try {
    // 1. دریافت اطلاعات سرویس
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { duration: true },
    });

    if (!service) throw new Error("Service not found");
    const serviceDuration = service.duration;

    // ساخت بازه زمانی
    const potentialStart = new Date(`${date}T${time}:00`);
    const potentialEnd = new Date(
      potentialStart.getTime() + serviceDuration * 60000,
    );

    // 2. دریافت تمام پرسنل مرتبط
    const staffList = await prisma.staffMember.findMany({
      where: {
        businessId: businessId,
        isActive: true,
        deletedAt: null,
        services: { some: { serviceId: serviceId } },
      },
      include: {
        schedules: true,
        exceptions: true,
        bookings: {
          where: {
            // رزروهای تداخل دار
            status: { in: ["PENDING", "CONFIRMED"] },
            startTime: { lt: potentialEnd },
            endTime: { gt: potentialStart },
          },
          select: { id: true },
        },
      },
    });

    // 3. فیلتر کردن پرسنل‌ها
    const availableStaff: AvailableStaff[] = [];

    for (const staff of staffList) {
      // الف) چک کردن استثنای روزانه
      const isOffToday = staff.exceptions.some(
        (exc) =>
          exc.isClosed &&
          new Date(exc.date).toDateString() === potentialStart.toDateString(),
      );
      if (isOffToday) continue;

      // ب) چک کردن شیفت روزانه
      const dayOfWeek = potentialStart.getDay();
      const dbDayOfWeek = (dayOfWeek + 1) % 7; // تبدیل به دیتابیس
      const schedule = staff.schedules.find((s) => s.dayOfWeek === dbDayOfWeek);

      if (!schedule || schedule.isClosed) continue;

      // ج) چک کردن تداخل رزرو
      const isBooked = staff.bookings.length > 0;
      if (isBooked) continue;

      // اگر همه چیز اوکی بود اضافه کن
      availableStaff.push({
        id: staff.id,
        name: staff.name,
        avatar: staff.avatar,
      });
    }

    return { success: true, data: availableStaff };
  } catch (error) {
    console.error("Get Staff Error:", error);
    return { success: false, error: "خطا در دریافت لیست پرسنل" };
  }
}
