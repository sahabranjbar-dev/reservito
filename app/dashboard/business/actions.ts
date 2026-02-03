"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import prisma from "@/utils/prisma";
import { authOptions } from "@/utils/authOptions";
import { convertToEnglishDigits } from "@/utils/common";
import { BusinessRole } from "@/constants/enums";

interface Params {
  staffPhone: string;
  serviceName: string;
  price: number;
  duration: number;
  staffName: string;
}

export async function setupBusinessAction({
  duration,
  price,
  serviceName,
  staffName,
  staffPhone,
}: Params) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "دسترسی غیرمجاز" };
  }

  const businessId = session.user.business?.id;

  if (!businessId) {
    return { success: false, error: "کسب‌وکار یافت نشد" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. بررسی وجود بیزنس
      const business = await tx.business.findUnique({
        where: { id: businessId },
      });

      if (!business) {
        throw new Error("BUSINESS_NOT_FOUND");
      }

      // 2. ایجاد یا دریافت یوزر با نقش CUSTOMER
      const user = await tx.user.upsert({
        where: { phone: convertToEnglishDigits(staffPhone) },
        update: {},
        create: {
          phone: convertToEnglishDigits(staffPhone),
          roles: {
            create: { role: "CUSTOMER" },
          },
          fullName: staffName,
        },
        include: { roles: true },
      });

      const hasCustomerRole = user.roles.some((r) => r.role === "CUSTOMER");

      if (!hasCustomerRole) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            role: "CUSTOMER",
          },
        });
      }

      // 3. ایجاد پرسنل و اتصال به یوزر
      const staff = await tx.staffMember.create({
        data: {
          name: staffName,
          phone: convertToEnglishDigits(staffPhone),
          businessId: business.id,
          userId: user.id,
        },
      });

      await tx.businessMember.create({
        data: {
          userId: user.id,
          businessId: businessId,
          role: BusinessRole.STAFF,
        },
      });

      // 4. ایجاد سرویس
      const service = await tx.service.create({
        data: {
          name: serviceName,
          price,
          duration,
          businessId: business.id,
        },
      });

      // 5. اتصال سرویس به پرسنل
      await tx.serviceStaff.create({
        data: {
          serviceId: service.id,
          staffId: staff.id,
        },
      });

      // 6. ایجاد برنامه کاری پیش‌فرض (۷ روز، ۹ تا ۱۷)
      const availabilities = Array.from({ length: 7 }).map((_, dayOfWeek) => ({
        staffId: staff.id,
        dayOfWeek,
        startTime: "09:00",
        endTime: "17:00",
        isClosed: false,
      }));

      await tx.staffAvailability.createMany({
        data: availabilities,
      });
    });

    revalidatePath("/dashboard/business");
    return { success: true };
  } catch (error: any) {
    console.error("SETUP_BUSINESS_ERROR:", error);

    if (error.message === "BUSINESS_NOT_FOUND") {
      return {
        success: false,
        error: "کسب‌وکار معتبر نیست",
      };
    }

    return {
      success: false,
      error: "خطا در راه‌اندازی اولیه کسب‌وکار",
    };
  }
}
