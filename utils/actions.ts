"use server";

import prisma from "@/utils/prisma";

interface ApplyDiscountInput {
  code: string;
  businessId: string;
  orderAmount: number;
}

export async function applyDiscount({
  code,
  businessId,
  orderAmount,
}: ApplyDiscountInput) {
  try {
    // 1. ولیدیشن اولیه
    if (!code?.trim()) {
      return {
        success: false,
        finalAmount: orderAmount,
        error: "کد تخفیف وارد نشده است.",
      };
    }

    if (orderAmount <= 0) {
      return {
        success: false,
        finalAmount: orderAmount,
        error: "مبلغ سفارش نامعتبر است.",
      };
    }

    const now = new Date();

    // 2. دریافت کد تخفیف
    const discount = await prisma.discount.findFirst({
      where: {
        code,
        status: "ACTIVE",
        startsAt: { lte: now },
        expiresAt: { gte: now },
        OR: [{ scope: "BUSINESS", businessId }, { scope: "PLATFORM" }],
      },
    });

    if (!discount) {
      return {
        success: false,
        finalAmount: orderAmount,
        error: "کد تخفیف معتبر نیست یا منقضی شده است.",
      };
    }

    // 3. محدودیت تعداد مصرف کل
    if (
      discount.usageLimit !== null &&
      discount.usedCount >= discount.usageLimit
    ) {
      return {
        success: false,
        finalAmount: orderAmount,
        error: "سقف استفاده از این کد تخفیف به پایان رسیده است.",
      };
    }

    // 4. حداقل مبلغ سفارش
    if (discount.minOrderAmount && orderAmount < discount.minOrderAmount) {
      return {
        success: false,
        finalAmount: orderAmount,
        error: `حداقل مبلغ سفارش برای این کد تخفیف ${discount.minOrderAmount.toLocaleString(
          "fa-IR",
        )} تومان است.`,
      };
    }

    // 5. محاسبه مبلغ تخفیف
    let discountAmount = 0;

    if (discount.type === "PERCENTAGE") {
      discountAmount = Math.floor((orderAmount * discount.value) / 100);
    }

    if (discount.type === "FIXED_AMOUNT") {
      discountAmount = discount.value;
    }

    // 6. اعمال سقف تخفیف
    if (discount.maxDiscount !== null) {
      discountAmount = Math.min(discountAmount, discount.maxDiscount);
    }

    // 7. جلوگیری از تخفیف بیشتر از مبلغ
    discountAmount = Math.min(discountAmount, orderAmount);

    const finalAmount = orderAmount - discountAmount;

    return {
      success: true,
      message: "کد تخفیف با موفقیت اعمال شد.",
      discount: {
        id: discount.id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
      },
      discountAmount,
      finalAmount,
    };
  } catch (error) {
    console.error("applyDiscount error:", error);

    return {
      success: false,
      finalAmount: orderAmount,
      error: "خطای غیرمنتظره‌ای در اعمال کد تخفیف رخ داد.",
    };
  }
}

export async function validateAndCalculateDiscount({
  tx,
  businessId,
  code,
  orderAmount,
}: {
  tx: any;
  businessId: string;
  code?: string;
  orderAmount: number;
}) {
  if (!code) {
    return {
      discountId: null,
      discountAmount: 0,
      finalAmount: orderAmount,
      businessId,
      code,
      orderAmount,
    };
  }

  const now = new Date();

  const discount = await tx.discount.findFirst({
    where: {
      code,
      status: "ACTIVE",
      startsAt: { lte: now },
      expiresAt: { gte: now },
      OR: [{ scope: "PLATFORM" }, { scope: "BUSINESS", businessId }],
    },
  });

  if (!discount) {
    throw new Error("کد تخفیف نامعتبر یا منقضی شده است");
  }

  if (
    discount.usageLimit !== null &&
    discount.usedCount >= discount.usageLimit
  ) {
    throw new Error("سقف استفاده از این کد تخفیف پر شده است");
  }

  if (discount.minOrderAmount && orderAmount < discount.minOrderAmount) {
    throw new Error(
      `حداقل مبلغ سفارش ${discount.minOrderAmount.toLocaleString(
        "fa-IR",
      )} تومان است`,
    );
  }

  let discountAmount = 0;

  if (discount.type === "PERCENTAGE") {
    discountAmount = Math.floor((orderAmount * discount.value) / 100);
  } else {
    discountAmount = discount.value;
  }

  if (discount.maxDiscount !== null) {
    discountAmount = Math.min(discountAmount, discount.maxDiscount);
  }

  discountAmount = Math.min(discountAmount, orderAmount);

  return {
    discountId: discount.id,
    discountAmount,
    finalAmount: orderAmount - discountAmount,
  };
}
