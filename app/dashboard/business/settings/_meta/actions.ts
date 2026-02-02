"use server";

import { getServerSession } from "next-auth";
import prisma from "@/utils/prisma";
import { authOptions } from "@/utils/authOptions";
import { BusinessRole } from "@/constants/enums";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateBusinessSchema = z.object({
  ownerName: z.string().min(2, "نام مالک الزامی است"),
  businessName: z.string().min(2, "نام کسب‌وکار الزامی است"),
  slug: z
    .string()
    .min(2, "slug حداقل ۲ کاراکتر است")
    .max(50, "slug حداکثر ۵۰ کاراکتر است")
    .regex(
      /^[a-zA-Z0-9\u0600-\u06FF]+(?:-[a-zA-Z0-9\u0600-\u06FF]+)*$/,
      "slug فقط شامل حروف فارسی یا انگلیسی، عدد و خط تیره (-) است و نباید با خط تیره شروع یا پایان یابد",
    ),
  businessType: z.string(),
  address: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;

export async function updateBusinessSettings(input: UpdateBusinessInput) {
  const session = await getServerSession(authOptions);

  const businessId = session?.user?.business?.id;
  const userId = session?.user?.id;

  if (!businessId || !userId) {
    return { success: false, error: "دسترسی ندارید" };
  }

  if (session.user.business?.businessRole !== BusinessRole.OWNER) {
    return { success: false, error: "فقط مالک کسب‌وکار اجازه ویرایش دارد" };
  }

  const parsed = updateBusinessSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.message ?? "اطلاعات نامعتبر است",
    };
  }

  const data = parsed.data;

  try {
    const existingSlug = await prisma.business.findFirst({
      where: {
        slug: data.slug,
        NOT: {
          id: businessId, // خود بیزنس فعلی مستثنا شود
        },
      },
      select: { id: true },
    });

    if (existingSlug) {
      return {
        success: false,
        error: "این آدرس (slug) قبلاً استفاده شده است",
      };
    }

    const updateBusiness = await prisma.business.update({
      where: {
        id: businessId,
        ownerId: userId,
      },
      data: {
        businessName: data.businessName,
        ownerName: data.ownerName,
        slug: data.slug,
        businessType: data.businessType as any,
        address: data.address,
        description: data.description,
      },
    });

    revalidatePath("/dashboard/business/settings");
    return { success: true, updateBusiness };
  } catch (error) {
    console.error("updateBusinessSettings error:", error);
    return { success: false, error: "خطای سرور" };
  }
}
