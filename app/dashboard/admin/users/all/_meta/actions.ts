"use server";

import { Role } from "@/constants/enums";
import prisma from "@/utils/prisma";

// تعریف تایپ خروجی استاندارد برای اکشن‌ها
type ActionResponse = {
  success: boolean;
  message?: string;
  user?: any; // می‌توانید تایپ دقیق User را از پرایسما ایمپورت کنید
};

export async function getUserDetails(id: string): Promise<ActionResponse> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          select: {
            id: true,
            role: true,
          },
        },
        businessMembers: {
          include: {
            business: {
              select: {
                id: true,
                businessName: true,
                businessType: true,
                slug: true,
              },
            },
          },
        },
        ownedBusinesses: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            slug: true,
          },
        },
        bookings: {
          orderBy: {
            startTime: "desc",
          },
          take: 20, // محدود کردن تعداد نوبت‌ها برای بهینه‌سازی
          select: {
            id: true,
            startTime: true,
            status: true,
            service: {
              select: {
                id: true,
                name: true,
              },
            },
            business: {
              select: {
                id: true,
                businessName: true,
              },
            },
          },
        },
        favorites: {
          select: {
            id: true,
            business: {
              select: {
                id: true,
                businessName: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return { success: false, message: "کاربر با این شناسه یافت نشد." };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return { success: false, message: "خطا در دریافت اطلاعات کاربر از سرور." };
  }
}

export async function toggleUserStatus(id: string): Promise<ActionResponse> {
  try {
    // ابتدا چک می‌کنیم کاربر وجود دارد
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return { success: false, message: "کاربر یافت نشد." };
    }

    // اگر کاربر حذف شده باشد، نباید بتوان استاتوسش را تغییر داد
    if (user.deletedAt) {
      return {
        success: false,
        message: "وضعیت کاربر حذف شده قابل تغییر نیست.",
      };
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    return {
      success: true,
      message: user.isActive
        ? "کاربر با موفقیت غیرفعال شد."
        : "کاربر با موفقیت فعال شد.",
    };
  } catch (error) {
    console.error("Error toggling user status:", error);
    return { success: false, message: "خطا در تغییر وضعیت کاربر." };
  }
}

export async function deleteUser(id: string): Promise<ActionResponse> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return { success: false, message: "کاربر یافت نشد." };
    }

    if (user.deletedAt) {
      return { success: false, message: "این کاربر قبلاً حذف شده است." };
    }

    // Soft Delete: تنظیم تاریخ حذف
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { success: true, message: "کاربر با موفقیت حذف شد." };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "خطا در حذف کاربر." };
  }
}

export async function restoreUser(id: string): Promise<ActionResponse> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return { success: false, message: "کاربر یافت نشد." };
    }

    if (!user.deletedAt) {
      return {
        success: false,
        message: "این کاربر در حال حاضر فعال است و نیاز به بازیابی ندارد.",
      };
    }

    await prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });

    return { success: true, message: "کاربر با موفقیت بازیابی شد." };
  } catch (error) {
    console.error("Error restoring user:", error);
    return { success: false, message: "خطا در بازیابی کاربر." };
  }
}

export async function addUserRole(
  userId: string,
  role: Role,
): Promise<ActionResponse> {
  try {
    // چک می‌کنیم آیا کاربر وجود دارد
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) return { success: false, message: "کاربر یافت نشد." };

    // چک می‌کنیم آیا این نقش قبلاً داده شده است (در سطح دیتابیس یونیک هست ولی اینجا برای پیام بهتر هندل می‌کنیم)
    const existingRole = await prisma.userRole.findUnique({
      where: {
        userId_role: {
          userId,
          role,
        },
      },
    });

    if (existingRole) {
      return {
        success: false,
        message: "این نقش قبلاً برای کاربر ثبت شده است.",
      };
    }

    await prisma.userRole.create({
      data: {
        userId,
        role,
      },
    });

    return { success: true, message: "نقش با موفقیت اضافه شد." };
  } catch (error) {
    console.error("Error adding user role:", error);
    return { success: false, message: "خطا در افزودن نقش." };
  }
}

export async function removeUserRole(
  userId: string,
  roleId: string,
): Promise<ActionResponse> {
  try {
    // حذف بر اساس شناسه خود جدول UserRole (نه User ID)
    await prisma.userRole.delete({
      where: {
        id: roleId,
      },
    });

    return { success: true, message: "نقش با موفقیت حذف شد." };
  } catch (error) {
    console.error("Error removing user role:", error);
    return { success: false, message: "خطا در حذف نقش." };
  }
}
