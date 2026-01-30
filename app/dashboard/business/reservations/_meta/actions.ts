"use server";

import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { revalidatePath } from "next/cache";

export async function updateBookingStatusAction(params: {
  bookingId: string;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
}) {
  const { bookingId, status } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "احراز هویت نشد" };
  }

  try {
    // بررسی اینکه این رزرو متعلق به بیزنس این کاربر است
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        business: {
          ownerId: session.user.id,
        },
      },
    });

    if (!booking) {
      return { success: false, error: "رزرو یافت نشد" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    revalidatePath("/dashboard/business/reservations");

    return { success: true, message: "وضعیت رزرو تغییر کرد" };
  } catch (error) {
    console.error("Update Booking Error:", error);
    return { success: false, error: "خطا در تغییر وضعیت" };
  }
}
