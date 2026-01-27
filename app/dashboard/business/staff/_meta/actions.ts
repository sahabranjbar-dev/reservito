"use server";

import { BusinessRole, Role } from "@/constants/enums";
import { convertToEnglishDigits } from "@/utils/common";
import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";

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
    const resolvedPhone = convertToEnglishDigits(phone);

    if (!name || !resolvedPhone) {
      return { success: false, error: "نام و شماره موبایل الزامی است" };
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. بررسی یا ایجاد کاربر (Upsert)
      const user = await tx.user.upsert({
        where: { phone: resolvedPhone },
        update: {},
        create: {
          phone: resolvedPhone,
          roles: {
            create: {
              role: Role.CUSTOMER,
            },
          },
        },
      });

      // 2. بررسی اینکه این کاربر قبلاً پرسنل این بیزنس نشده باشد
      const existingStaff = await tx.staffMember.findFirst({
        where: {
          businessId: businessId,
          userId: user.id,
        },
      });

      if (existingStaff) {
        throw new Error("این پرسنل قبلاً در این کسب‌وکار ثبت شده است.");
      }

      // 3. ساخت پروفایل پرسنل (StaffMember)
      // این جدول مشخص می‌کند که این فرد در بیزنس شما چه ویژگی‌هایی دارد (نام، عکس، سرویس‌ها و...)
      const staffMember = await tx.staffMember.create({
        data: {
          businessId: businessId,
          userId: user.id,
          name: name,
          phone: resolvedPhone, // ذخیره مجدد تلفن برای نمایش
        },
      });

      // 4. اضافه کردن به اعضای بیزنس (BusinessMember)
      // این جدول مشخص می‌کند که به این فرد اجازه ورود به داشبورد بیزنس با نقش STAFF داده شود
      await tx.businessMember.create({
        data: {
          userId: user.id,
          businessId: businessId,
          role: BusinessRole.STAFF,
        },
      });

      return staffMember;
    });

    revalidatePath("/dashboard/business/staff");
    return { success: true, message: "پرسنل با موفقیت اضافه شد" };
  } catch (error) {
    console.error("Create Staff Error:", error);

    // اگر خطای Unique Constraint بود، پیام فارسی و واضح برگردانیم
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "خطا در ایجاد پرسنل" };
  }
}
// --- 3. ویرایش پرسنل ---
export async function updateStaffAction(formData: FormData, staffId: string) {
  try {
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const resolvedPhone = convertToEnglishDigits(phone);
    if (!name || !resolvedPhone) {
      return { success: false, error: "اطلاعات ناقص است" };
    }

    await prisma.staffMember.update({
      where: { id: staffId },
      data: { name, phone: resolvedPhone },
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
