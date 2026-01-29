"use server";
import { applyDiscount, validateAndCalculateDiscount } from "@/utils/actions";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";

type PaymentMethod = "ONLINE" | "OFFLINE";

export async function processPaymentAction(params: {
  bookingId: string;
  method: PaymentMethod;
  gateway?: string; // اگر آنلاین باشد
  discountCode?: string;
}) {
  const { bookingId, method, gateway, discountCode } = params;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return {
      success: false,
      error: "برای انجام پرداخت باید وارد حساب کاربری شوید",
    };
  }
  const userId = session?.user.id;

  try {
    // 1. دریافت اطلاعات رزرو
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { business: true },
    });

    if (!booking) return { success: false, error: "رزرو یافت نشد" };

    const payment = await prisma.$transaction(async (tx) => {
      const discountResult = await validateAndCalculateDiscount({
        tx,
        businessId: booking.businessId,
        code: discountCode,
        orderAmount: booking.totalPrice,
      });

      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          businessId: booking.businessId,
          amount: discountResult.finalAmount,
          status: "PENDING",
          method,
          gatewayName: method === "ONLINE" ? gateway || "ZARINPAL" : "OFFLINE",
          verifiedById: userId,
        },
      });

      if (discountResult.discountId) {
        await tx.discount.update({
          where: { id: discountResult.discountId },
          data: {
            usedCount: { increment: 1 },
          },
        });

        await tx.discountUsage.create({
          data: {
            discountId: discountResult.discountId,
            userId,
            bookingId,
            discountAmount: discountResult.discountAmount,
          },
        });
      }

      return payment;
    });

    // لینک پرداخت (mock)
    // const paymentUrl = await getGatewayUrl(
    //   payment.amount,
    //   payment.id,
    //   gateway,
    // );

    return {
      success: true,
      paymentUrl: `http://localhost:3000/payment/pending?bookingId=${booking.id}&paymentId=${payment.id}`,
      bookingId: booking.id,
      payment,
    };
  } catch (error) {
    console.error("Payment Process Error:", error);
    return { success: false, error: "خطا در پردازش پرداخت" };
  }
}

// تابع کمکی mock برای درگاه
async function getGatewayUrl(
  amount: number,
  paymentId: string,
  gatewayName?: string,
) {
  return `https://gateway-sandbox.com/pay?amount=${amount}&ref=${paymentId}`;
}

export async function getBookingDetails(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        business: true,
      },
    });

    if (!booking) {
      return { success: false, message: "رزروی یافت نشد" };
    }

    return {
      success: true,
      booking,
      message: "اطلاعات رزرو با موفقیت دریافت شد",
    };
  } catch (error) {
    console.error("get booking Error:", error);
    return { success: false, message: "خطا در دریافت اطلاعات رزرو" };
  }
}
