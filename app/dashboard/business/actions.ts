"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import prisma from "@/utils/prisma";
import { authOptions } from "@/utils/authOptions";

export async function setupBusinessAction(formData: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const businessId = session.user.business?.id;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    return { success: false, error: "Business not found" };
  }

  try {
    // 1. ایجاد سرویس اول
    const service = await prisma.service.create({
      data: {
        name: formData.serviceName,
        price: formData.price,
        duration: formData.duration,
        businessId: business.id,
      },
    });

    // 2. ایجاد پرسنل اول (که همان کاربر است یا جدید)
    const staff = await prisma.staffMember.create({
      data: {
        name: formData.staffName,
        businessId: business.id,
      },
    });

    // 3. ارتباط سرویس با پرسنل
    await prisma.serviceStaff.create({
      data: {
        serviceId: service.id,
        staffId: staff.id,
      },
    });

    // 4. ایجاد برنامه زمان‌بندی ساده (مثلاً شنبه تا جمعه ۹ تا ۱۷)
    // در فرم شما چک‌باکس بود، اینجا ساده شده برای مثال
    for (let i = 0; i < 6; i++) {
      await prisma.staffAvailability.create({
        data: {
          staffId: staff.id,
          dayOfWeek: i, // 0: Sunday, ...
          startTime: "09:00",
          endTime: "17:00",
          isClosed: false,
        },
      });
    }

    revalidatePath("/dashboard/business");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to save setup" };
  }
}

interface IupsertService {
  name: string;
  price: number;
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

    const service = await prisma.service.upsert({
      where: { id: id ?? "" },
      update: { name, price, duration },
      create: { name, price, duration, businessId },
    });

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

    revalidatePath("/dashboard/business/services");
    return { success: true, message: "عملیات با موفقیت انجام شد" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "خطای سرور" };
  }
}
