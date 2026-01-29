"use server";

import { DiscountStatus, DiscountType } from "@/constants/enums";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface IParams {
  id: string;
  businessId?: string | null;
  code: string;
  type: DiscountType;
  value: number;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  usageLimit?: number | null;
  startsAt: string;
  expiresAt: string;
  status: DiscountStatus;
}
// ایجاد یا ویرایش تخفیف
export async function upsertDiscount(inputs: IParams) {
  const {
    businessId,
    code,
    expiresAt,
    id,
    maxDiscount,
    minOrderAmount,
    startsAt,
    status,
    type,
    usageLimit,
    value,
  } = inputs;

  if (!code || !value || !businessId || !startsAt || !expiresAt || !type) {
    return { error: "لطفاً تمام فیلدهای ضروری را پر کنید." };
  }

  try {
    if (id) {
      // ویرایش
      await prisma.discount.update({
        where: { id },
        data: {
          code,
          type,
          value,
          maxDiscount,
          minOrderAmount,
          usageLimit,
          startsAt,
          expiresAt,
          status,
        },
      });
    } else {
      // ایجاد جدید
      await prisma.discount.create({
        data: {
          businessId,
          code: code.toUpperCase(),
          type,
          value,
          maxDiscount,
          minOrderAmount,
          usageLimit,
          startsAt,
          expiresAt,
          status,
          scope: "BUSINESS", // چون در داشبورد بیزنس هستیم
        },
      });
    }

    revalidatePath("/dashboard/business/discount");
    return { success: true };
  } catch (error) {
    console.error("Discount Error:", error);
    return { error: "خطایی در ذخیره تخفیف رخ داد." };
  }
}

// تغییر وضعیت (فعال/غیرفعال)
export async function toggleDiscountStatus(id: string, currentStatus: string) {
  const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  try {
    await prisma.discount.update({
      where: { id },
      data: { status: newStatus as "ACTIVE" | "INACTIVE" },
    });
    revalidatePath("/dashboard/business/discounts");
    return { success: true };
  } catch (error) {
    return { error: "خطا در تغییر وضعیت" };
  }
}

// حذف تخفیف
export async function deleteDiscount(id: string) {
  try {
    await prisma.discount.delete({
      where: { id },
    });
    revalidatePath("/dashboard/business/discounts");
    return { success: true };
  } catch (error) {
    return { error: "خطا در حذف تخفیف" };
  }
}

export async function getDiscountDetail(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { success: false, error: "دسترسی ندارید" };
    }

    if (!id) {
      return { success: false, error: "آیدی الزامی است" };
    }

    const discount = await prisma.discount.findUnique({
      where: { id },
    });

    return { success: true, discount };
  } catch (error) {
    console.error("get discount Error:", error);
    return { error: "خطایی در دریافت تخفیف رخ داد." };
  }
}
