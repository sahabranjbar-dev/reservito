"use server";
import prisma from "@/utils/prisma";

interface response {
  success: boolean;
  message: string;
  error?: string;
  user?: any;
}

export async function setCustomerRole(userId: string): Promise<response> {
  try {
    if (!userId) {
      return { message: "آیدی کاربر الزامی است", success: false };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          select: { role: true },
        },
      },
    });

    if (!user) {
      return { message: "کاربر پیدا نشد", success: false };
    }

    // اگر قبلاً نقش CUSTOMER دارد، اجازه نده دوباره اضافه شود
    const hasCustomerRole = user.roles.some((r) => r.role === "CUSTOMER");
    if (hasCustomerRole) {
      return { message: "کاربر قبلاً نقش CUSTOMER را دارد", success: false };
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          connectOrCreate: {
            where: {
              userId_role: {
                userId,
                role: "CUSTOMER",
              },
            },
            create: {
              role: "CUSTOMER",
            },
          },
        },
      },
      include: {
        roles: true,
      },
    });

    return {
      success: true,
      user: updatedUser,
      message: "نقش CUSTOMER با موفقیت اضافه شد",
    };
  } catch (error) {
    console.error("Error setting customer role:", error);
    return {
      success: false,
      message: "خطا در ایجاد نقش",
      error: String(error),
    };
  }
}

export async function getBusinessMemberHandler(
  userId: string,
  businessId: string,
) {
  try {
    if (!userId) {
      return { message: "آیدی کاربر الزامی است", success: false };
    }

    const businessMember = await prisma.businessMember.findUnique({
      where: {
        userId_businessId: {
          userId,
          businessId,
        },
      },
      include: {
        business: true,
      },
    });

    return { businessMember };
  } catch (error) {
    console.error("Error getting staffMember data:", error);
    return {
      success: false,
      message: "خطا در دریافت نقش",
      error: String(error),
    };
  }
}
