"use server";

import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- 1. دریافت لیست پرسنل ---
export async function getStaffListAction(businessId: string) {
  try {
    const staff = await prisma.staffMember.findMany({
      where: {
        businessId: businessId,
        deletedAt: null, // فقط پرسنل فعال
      },
      orderBy: { createdAt: "desc" },
      include: {
        // اگر یوزر لینک شده باشد، اطلاعات یوزر را می‌گیریم
        user: {
          select: {
            id: true,
            avatar: true,
            email: true,
          },
        },
      },
    });
    return { success: true, data: staff };
  } catch (error) {
    console.error("Fetch Staff Error:", error);
    return { success: false, error: "خطا در دریافت لیست پرسنل" };
  }
}

// --- 2. ایجاد پرسنل جدید ---
export async function createStaffAction(
  formData: FormData,
  businessId: string
) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string | null;
    const avatarUrl = formData.get("avatarUrl") as string | null;

    if (!name || !phone) {
      return { success: false, error: "نام و شماره موبایل الزامی است" };
    }

    await prisma.staffMember.create({
      data: {
        businessId,
        name,
        phone,
        // اگر نیاز بود یوزر ایجاد شود، اینجا می‌توان چک کرد اما فعلاً ساده نگه می‌داریم
        // userId: ...
      },
    });

    revalidatePath("/dashboard/business/staff");
    return { success: true, message: "پرسنل با موفقیت اضافه شد" };
  } catch (error) {
    console.error("Create Staff Error:", error);
    return { success: false, error: "خطا در ایجاد پرسنل" };
  }
}

// --- 3. ویرایش پرسنل ---
export async function updateStaffAction(formData: FormData, staffId: string) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    if (!name || !phone) {
      return { success: false, error: "اطلاعات ناقص است" };
    }

    await prisma.staffMember.update({
      where: { id: staffId },
      data: { name, phone },
    });

    revalidatePath("/dashboard/business/staff");
    return { success: true, message: "اطلاعات ویرایش شد" };
  } catch (error) {
    console.error("Update Staff Error:", error);
    return { success: false, error: "خطا در ویرایش" };
  }
}

// --- 4. حذف پرسنل (Soft Delete) ---
export async function deleteStaffAction(staffId: string) {
  try {
    await prisma.staffMember.update({
      where: { id: staffId },
      data: { deletedAt: new Date() },
    });

    revalidatePath("/dashboard/business/staff");
    return { success: true, message: "پرسنل حذف شد" };
  } catch (error) {
    console.error("Delete Staff Error:", error);
    return { success: false, error: "خطا در حذف پرسنل" };
  }
}
