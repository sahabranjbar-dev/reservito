"use server";
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

    let finalAmount = booking.totalPrice;

    // 2. محاسبه تخفیف (Mock)
    if (discountCode && discountCode.toLowerCase() === "off10") {
      finalAmount = Math.floor(finalAmount * 0.9); // 10% تخفیف
    }

    // ===========================
    // 3. پرداخت آفلاین
    // ===========================
    if (method === "OFFLINE") {
      const result = await prisma.$transaction(async (tx) => {
        // آپدیت وضعیت رزرو
        const updatedBooking = await tx.booking.update({
          where: { id: bookingId },
          data: { status: "PENDING_CONFIRMATION" },
        });

        // ثبت پرداخت آفلاین
        const payment = await tx.payment.create({
          data: {
            bookingId: booking.id,
            businessId: booking.businessId,
            amount: finalAmount,
            status: "PENDING",
            method: "OFFLINE",
            gatewayName: "OFFLINE",
          },
        });

        return { payment, updatedBooking };
      });

      return { success: true, isOffline: true, bookingId: booking.id, result };
    }

    // ===========================
    // 4. پرداخت آنلاین
    // ===========================
    if (method === "ONLINE") {
      const payment = await prisma.$transaction(async (tx) => {
        await tx.booking.update({
          where: { id: bookingId },
          data: { status: "PENDING_CONFIRMATION" },
        });

        const payment = await tx.payment.create({
          data: {
            bookingId: booking.id,
            businessId: booking.businessId,
            amount: finalAmount,
            status: "PENDING",
            method: "ONLINE",
            gatewayName: gateway || "ZARINPAL",
          },
        });

        return payment;
      });

      // لینک پرداخت (mock)
      const paymentUrl = await getGatewayUrl(
        payment.amount,
        payment.id,
        gateway
      );

      return {
        success: true,
        isOffline: false,
        paymentUrl,
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
  gatewayName?: string
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
