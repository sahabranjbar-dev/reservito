"use server";

import prisma from "@/utils/prisma";
import { Role } from "@/constants/enums";
import { revalidatePath } from "next/cache";

// تایپ خروجی
interface ActionResult {
  success: boolean;
  message: string;
  error?: string;
}

/* --- ویرایش کاربر (پروفایل و وضعیت) --- */
export async function updateUserAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const userId = formData.get("userId") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string | null;
    const isActive = formData.get("isActive") === "true";
    const makeSuperAdmin = formData.get("isSuperAdmin") === "true";

    if (!userId) return { success: false, message: "آیدی کاربر یافت نشد" };

    await prisma.$transaction(async (tx) => {
      // 1. آپدیت اطلاعات پایه
      await tx.user.update({
        where: { id: userId },
        data: {
          fullName,
          email: email || null,
          isActive,
        },
      });

      // 2. مدیریت نقش سوپر ادمین
      // چون جدول جداگانه است، باید دستی چک کنیم و اضافه/حذف کنیم

      // پیدا کردن نقش‌های فعلی
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { roles: { where: { role: Role.SUPER_ADMIN } } },
      });

      if (!user) throw new Error("کاربر پیدا نشد");

      const hasSuperAdmin = user.roles.length > 0;

      // اگر می‌خواهیم سوپر ادمین کنیم و نیست
      if (makeSuperAdmin && !hasSuperAdmin) {
        await tx.user.update({
          where: { id: userId },
          data: {
            roles: {
              create: { role: Role.SUPER_ADMIN },
            },
          },
        });
      }
      // اگر می‌خواهیم سوپر ادمین را برداریم و هست
      else if (!makeSuperAdmin && hasSuperAdmin) {
        // پیدا کردن آیدی رابطه برای حذف (چون یونیک است)
        const roleLink = await tx.userRole.findUnique({
          where: {
            userId_role: {
              userId,
              role: Role.SUPER_ADMIN,
            },
          },
        });

        if (roleLink) {
          await tx.userRole.delete({
            where: { id: roleLink.id },
          });
        }
      }
    });

    revalidatePath("/admin/dashboard/users");
    return { success: true, message: "اطلاعات کاربر با موفقیت ویرایش شد" };
  } catch (error) {
    console.error("Update User Error:", error);
    return {
      success: false,
      message: "خطا در ویرایش کاربر",
      error: String(error),
    };
  }
}

/* --- حذف کاربر (Soft Delete) --- */
export async function deleteUserAction(userId: string): Promise<ActionResult> {
  try {
    // بررسی اینکه آیا کاربر دارای بیزنس است یا خیر
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { ownedBusinesses: true },
    });

    if (!user) return { success: false, message: "کاربر یافت نشد" };

    // سیاست امنیتی: اگر کاربر بیزنس دارد، حذف کردن او خطرناک است
    if (user.ownedBusinesses.length > 0) {
      // در حالت واقعی، باید بیزنس را به کسی واگذار کند یا با بیزنس حذف شود
      // اینجا فقط یک هشدار می‌دهیم، اما عملیات را انجام می‌دهیم
      return {
        success: false,
        message:
          "این کاربر صاحب کسب‌وکار است. لطفا ابتدا بیزنس را حذف یا واگذار کنید.",
      };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        isActive: false, // غیرفعال کردن همزمان
        email: `deleted_${Date.now()}_${user.email}`, // آزاد کردن ایمیل برای امنیت
      },
    });

    revalidatePath("/admin/dashboard/users");
    return { success: true, message: "کاربر با موفقیت حذف شد" };
  } catch (error) {
    console.error("Delete User Error:", error);
    return { success: false, message: "خطا در حذف کاربر" };
  }
}
