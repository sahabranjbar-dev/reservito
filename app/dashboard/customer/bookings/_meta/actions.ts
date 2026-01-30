"use server";

import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { revalidatePath } from "next/cache";

export async function cancelBookingAction(bookingId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "احراز هویت نشد" };
  }

  try {
    // بررسی اینکه رزرو متعلق به همین کاربر باشد
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        customerId: session.user.id,
      },
    });

    if (!booking) {
      return { success: false, error: "رزرو یافت نشد" };
    }

    // بررسی اینکه رزرو قابل کنسل باشد
    if (booking.status === "CANCELED" || booking.status === "COMPLETED") {
      return { success: false, error: "این رزرو قابل لغو نیست" };
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELED" },
    });

    revalidatePath("/dashboard/customer/reservations");

    return { success: true, message: "رزرو شما با موفقیت کنسل شد" };
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return { success: false, error: "خطا در لغو رزرو" };
  }
}
