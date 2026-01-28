"use server";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";

type PaymentMethod = "ONLINE" | "OFFLINE";

export async function processPaymentAction(params: {
  bookingId: string;
  method: PaymentMethod;
  gateway?: string; // اگر آنلاین باشد
}) {
  const { bookingId, method, gateway } = params;
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!session?.user?.id) {
    return { success: false, error: "نشست شما منقضی شده است" };
  }

  try {
    // 1. دریافت اطلاعات رزرو
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { business: true },
    });

    if (!booking) return { success: false, error: "رزرو یافت نشد" };

    // ===========================
    // 3. پرداخت آفلاین
    // ===========================
    if (method === "OFFLINE") {
      const result = await prisma.$transaction(async (tx) => {
        // ثبت پرداخت آفلاین
        const payment = await tx.payment.create({
          data: {
            bookingId: booking.id,
            businessId: booking.businessId,
            amount: booking?.totalPrice,
            status: "PENDING",
            method: "OFFLINE",
            gatewayName: "OFFLINE",
            verifiedById: userId,
          },
        });

        return { payment };
      });

      return { success: true, isOffline: true, bookingId: booking.id, result };
    }

    // ===========================
    // 4. پرداخت آنلاین
    // ===========================
    if (method === "ONLINE") {
      const payment = await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.create({
          data: {
            bookingId: booking.id,
            businessId: booking.businessId,
            amount: booking.totalPrice,
            status: "PENDING",
            method: "ONLINE",
            gatewayName: gateway || "ZARINPAL",
            verifiedById: userId,
            verifiedAt: new Date(),
          },
        });

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
        isOffline: false,
        paymentUrl: `http://localhost:3000/payment/pending?bookingId=${booking.id}&paymentId=${payment.id}`,
        bookingId: booking.id,
        payment,
      };
    }

    return { success: false, error: "روش پرداخت نامعتبر است" };
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
