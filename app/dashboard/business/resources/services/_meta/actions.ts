"use server";

import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface IupsertService {
  name: string;
  price?: number | null;
  duration: number;
  businessId: string;
  id?: string;
  staffIds: string[];
}
export async function upsertService(data: IupsertService) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const businessId = session.user?.business?.id ?? "";

  try {
    const { name, price, duration, id, staffIds } = data;

    // ------------------------------
    // 1. ایجاد یا آپدیت سرویس
    // ------------------------------
    const service = await prisma.service.upsert({
      where: { id: id ?? "" },
      update: { name, price, duration },
      create: { name, price, duration, businessId },
    });

    // ------------------------------
    // 2. آپدیت رزروهای آینده این سرویس
    // ------------------------------
    if (id) {
      // فقط اگر سرویس آپدیت می‌شود
      const futureBookings = await prisma.booking.findMany({
        where: {
          serviceId: service.id,
          startTime: { gte: new Date() }, // فقط رزروهای آینده
          deletedAt: null,
        },
        select: { id: true, startTime: true },
      });

      if (futureBookings.length > 0) {
        await prisma.$transaction(
          futureBookings.map((booking) =>
            prisma.booking.update({
              where: { id: booking.id },
              data: {
                endTime: new Date(
                  booking.startTime.getTime() + duration * 60 * 1000,
                ),
              },
            }),
          ),
        );
      }
    }

    // ------------------------------
    // 3. مدیریت پرسنل سرویس
    // ------------------------------
    await prisma.serviceStaff.deleteMany({
      where: { serviceId: service.id },
    });

    if (staffIds.length > 0) {
      const validStaffs = await prisma.staffMember.findMany({
        where: {
          id: { in: staffIds },
          businessId,
          isActive: true,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (validStaffs.length !== staffIds.length) {
        return {
          success: false,
          error: "پرسنل نامعتبر یا خارج از این کسب‌وکار انتخاب شده است",
        };
      }

      await prisma.serviceStaff.createMany({
        data: validStaffs.map((staff) => ({
          serviceId: service.id,
          staffId: staff.id,
        })),
      });
    }

    // ------------------------------
    // 4. ری‌والید مسیر
    // ------------------------------
    revalidatePath("/dashboard/business/resources/services");

    return { success: true, message: "عملیات با موفقیت انجام شد" };
  } catch (error) {
    console.error("upsertService Error:", error);
    return { success: false, error: "خطای سرور" };
  }
}

export async function deleteService(serviceId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.service.update({
      where: { id: serviceId },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/business/resources/services");
    return { success: true, message: "خدمت حذف شد." };
  } catch (error) {
    console.error(error);
    return { success: false, error: "خطای سرور" };
  }
}
