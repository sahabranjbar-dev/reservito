"use server";

import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

// تایپ‌ها
export enum BusinessStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface BusinessActionResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * تایید کردن کسب و کار (می‌تواند وضعیت را از REJECTED یا PENDING به APPROVED تغییر دهد)
 */
export async function approveBusiness(
  businessId: string
): Promise<BusinessActionResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.roles.includes("SUPER_ADMIN")) {
      return {
        success: false,
        message: "دسترسی ندارید",
        error: "ادمین میتواند کسب‌‌وکار را تایید کند",
      };
    }
    // 1. آپدیت در دیتابیس
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        registrationStatus: BusinessStatus.APPROVED,
        rejectionReason: null, // پاک کردن علت رد در صورت تایید مجدد
      },
      include: { owner: true },
    });

    // 2. ارسال پیامک (شبیه‌سازی)
    console.log(
      `[SMS] Sending approval SMS to ${updatedBusiness.owner.phone}: "Your business is approved!"`
    );

    // 3. بروزرسانی کش
    revalidatePath("/admin/dashboard/businesses");

    return { success: true, message: "کسب‌وکار تایید شد و پیامک ارسال گردید." };
  } catch (error) {
    console.error("Error approving business:", error);
    return {
      success: false,
      message: "خطا در تایید کسب و کار",
      error: String(error),
    };
  }
}

/**
 * رد کردن کسب و کار (می‌تواند وضعیت را از APPROVED یا PENDING به REJECTED تغییر دهد)
 */
export async function rejectBusiness(
  businessId: string,
  reason: string
): Promise<BusinessActionResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.roles.includes("SUPER_ADMIN")) {
      return {
        success: false,
        message: "دسترسی ندارید",
        error: "ادمین میتواند کسب‌‌وکار را رد کند",
      };
    }
    if (!reason.trim()) {
      return { success: false, message: "دلیل رد کردن الزامی است." };
    }

    // 1. آپدیت در دیتابیس
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        registrationStatus: BusinessStatus.REJECTED,
        rejectionReason: reason,
      },
      include: { owner: true },
    });

    // 2. ارسال پیامک (شبیه‌سازی)
    console.log(
      `[SMS] Sending rejection SMS to ${updatedBusiness.owner.phone}: Reason: ${reason}`
    );

    // 3. بروزرسانی کش
    revalidatePath("/admin/dashboard/businesses");

    return { success: true, message: "درخواست رد شد و کاربر مطلع گردید." };
  } catch (error) {
    console.error("Error rejecting business:", error);
    return {
      success: false,
      message: "خطا در رد کردن کسب و کار",
      error: String(error),
    };
  }
}

export async function updateBusinessCommission(
  businessId: string,
  commission: number
): Promise<BusinessActionResponse> {
  try {
    const session = await getServerSession(authOptions);

    // دسترسی
    if (!session?.user.roles.includes("SUPER_ADMIN")) {
      return {
        success: false,
        message: "دسترسی ندارید",
        error: "فقط ادمین می‌تواند کمیسیون را تغییر دهد",
      };
    }

    // ولیدیشن
    if (
      typeof commission !== "number" ||
      isNaN(commission) ||
      commission < 0 ||
      commission > 100
    ) {
      return {
        success: false,
        message: "مقدار کمیسیون نامعتبر است",
        error: "Commission must be between 0 and 100",
      };
    }

    // آپدیت دیتابیس
    await prisma.business.update({
      where: { id: businessId },
      data: {
        commissionRate: commission,
      },
    });

    // ری‌ولیدیت کش
    revalidatePath("/dashboard/admin/businesses");

    return {
      success: true,
      message: "کمیسیون با موفقیت بروزرسانی شد",
    };
  } catch (error) {
    console.error("Error updating business commission:", error);
    return {
      success: false,
      message: "خطا در بروزرسانی کمیسیون",
      error: String(error),
    };
  }
}
