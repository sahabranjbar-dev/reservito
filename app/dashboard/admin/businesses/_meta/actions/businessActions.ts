"use server";

import { BusinessRegistrationStatus, BusinessType } from "@/constants/enums";
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
  businessId: string,
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
        rejectionReason: null,
        activatedAt: new Date(),
      },
      include: { owner: true },
    });

    // 2. ارسال پیامک (شبیه‌سازی)
    console.log(
      `[SMS] Sending approval SMS to ${updatedBusiness.owner.phone}: "Your business is approved!"`,
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
export async function rejectBusiness(businessId: string, reason: string) {
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
        activatedAt: null,
        isActive: false,
        rejectedAt: new Date(),
      },
      include: { owner: true },
    });

    // 2. ارسال پیامک (شبیه‌سازی)
    console.log(
      `[SMS] Sending rejection SMS to ${updatedBusiness.owner.phone}: Reason: ${reason}`,
    );

    // 3. بروزرسانی کش
    revalidatePath("/admin/dashboard/businesses");

    return {
      success: true,
      updatedBusiness,
      message: "درخواست رد شد و کاربر مطلع گردید.",
    };
  } catch (error) {
    console.error("Error rejecting business:", error);
    return {
      success: false,
      message: "خطا در رد کردن کسب و کار",
      error: String(error),
    };
  }
}

export async function toggleBusinessStatus(id: string, isActive: boolean) {
  try {
    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: { isActive: !isActive },
    });
    revalidatePath("/dashboard/admin/businesses");
    return {
      success: true,
      message: `کسب‌وکار ${updatedBusiness.isActive ? "فعال" : "غیرفعال"} شد`,
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: "خطا در تغییر وضعیت" };
  }
}

export async function getBusinessDetail(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.roles.includes("SUPER_ADMIN")) {
      return {
        success: false,
        message: "دسترسی ندارید",
      };
    }

    if (!id) {
      return { success: false, message: "آیدی الزامی است" };
    }

    const businessDetail = await prisma.business.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!businessDetail) {
      return { success: false, message: "اطلاعات کسب‌وکار یافت نشد" };
    }

    return { success: true, businessDetail };
  } catch (error) {
    console.error("Error getting business data:", error);
    return {
      success: false,
      message: "خطا در دریافت اطلاعات کسب‌وکار",
    };
  }
}

interface IData {
  id: string;
  businessName: string;
  ownerName: string;
  identifier: string;
  businessType: BusinessType;
  registrationStatus: BusinessRegistrationStatus;
  description: string;
  address: string;
  rejectionReason: string;
}

export async function updateBusiness({
  id,
  businessName,
  ownerName,
  identifier,
  businessType,
  address,
  description,
  registrationStatus,
  rejectionReason,
}: IData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user.roles.includes("SUPER_ADMIN")) {
      return {
        success: false,
        message: "دسترسی ندارید",
      };
    }

    if (!id) {
      return { success: false, message: "آیدی الزامی است" };
    }

    const existIdentifier = await prisma.business.findFirst({
      where: {
        identifier: {
          equals: identifier,
          mode: "insensitive",
        },
        id: { not: id },
      },
    });

    if (existIdentifier) {
      return {
        success: false,
        message: "این شناسه توسط یک کسب‌وکار دیگر انتخاب شده",
      };
    }

    const updateBusiness = await prisma.business.update({
      where: { id },
      data: {
        address,
        businessType,
        businessName,
        description,
        identifier: identifier.trim(),
        ownerName,
        registrationStatus,
        rejectionReason,
        activatedAt:
          registrationStatus === BusinessRegistrationStatus.APPROVED
            ? new Date()
            : null,
        rejectedAt:
          registrationStatus === BusinessRegistrationStatus.REJECTED
            ? new Date()
            : null,
      },
    });

    revalidatePath(`/dashboard/admin/businesses/${id}`);
    revalidatePath(`/dashboard/admin/businesses`);
    return { success: true, updateBusiness };
  } catch (error) {
    console.error("Error update business:", error);
    return {
      success: false,
      message: "خطا در ویرایش اطلاعات کسب‌وکار",
    };
  }
}
