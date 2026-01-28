"use server";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";

export async function getPaymentDetail(id: string) {
  try {
    if (!id) {
      return { success: false, error: "آیدی الزامی است" };
    }
    const session = await getServerSession(authOptions);

    if (!session) {
      return { success: false, error: "شما دسترسی ندارید" };
    }

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            business: true,
            staff: {
              select: {
                name: true,
              },
            },
            service: true,
          },
        },
        business: true,
        commission: true,
        verifiedBy: true,
      },
    });

    if (!payment) {
      return { success: false, error: "اطلاعات پرداخت یافت نشد" };
    }

    return { success: true, payment };
  } catch (error) {
    console.error(error);
    return { success: false, error: "خطای سرور" };
  }
}
