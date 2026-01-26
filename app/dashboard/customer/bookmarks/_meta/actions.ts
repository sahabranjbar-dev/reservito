"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { revalidatePath } from "next/cache";
import prisma from "@/utils/prisma";

// 1. گرفتن لیست علاقه‌مندی‌های کاربر
export async function getFavoritesAction() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "لطفا وارد شوید" };
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        business: {
          select: {
            id: true,
            slug: true,
            businessName: true,
            banner: true,
            address: true,
            businessType: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // جدیدترین علاقه‌مندی اول
      },
    });

    return { success: true, data: favorites };
  } catch (error) {
    console.error("Get Favorites Error:", error);
    return { success: false, error: "خطا در دریافت لیست" };
  }
}

export async function toggleFavoriteAction(businessId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.roles.includes("CUSTOMER")) {
      return { success: false, error: "لطفاً ابتدا وارد حساب کاربری شوید" };
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_businessId: {
          userId: session.user.id,
          businessId,
        },
      },
    });

    const isFavorite = !existing;

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          businessId,
        },
      });
    }

    revalidatePath("/dashboard/customer/favorites");

    return { success: true, isFavorite };
  } catch (error) {
    console.error("Toggle Favorite Error:", error);
    return { success: false, error: "خطا در تغییر وضعیت علاقه‌مندی" };
  }
}
