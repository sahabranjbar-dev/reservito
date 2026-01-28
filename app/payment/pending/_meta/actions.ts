"use server";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";

export async function paymentChecking(paymentId: string, bookingId: string) {
  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user.id;
    if (!userId) {
      return { success: false, message: "شما دسترسی به این صفحه ندارید" };
    }
    // 1️⃣ دریافت Payment
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return { success: false, message: "پرداخت مورد نظر یافت نشد" };
    }

    // 2️⃣ تطبیق Payment با Booking
    if (payment.bookingId !== bookingId) {
      return { success: false, message: "پرداخت با این رزرو مطابقت ندارد" };
    }

    // 3️⃣ اگر قبلاً پرداخت نهایی شده → idempotent
    if (payment.status === "PAID") {
      return {
        paymentStatus: "PAID",
        redirectUrl: "/booking/waiting-confirmation",
        message: "پرداخت قبلاً با موفقیت ثبت شده است.",
      };
    }

    if (payment.status === "FAILED") {
      return {
        paymentStatus: "FAILED",
        redirectUrl: "/payment/failure",
        message: "این پرداخت قبلاً ناموفق ثبت شده است.",
      };
    }

    // 4️⃣ بررسی وضعیت واقعی از درگاه (فعلاً mock)
    // TODO: جایگزین با verify واقعی درگاه (authority / refId)
    const paymentStatusFromGateway: "paid" | "failed" | "pending" = "paid";

    // 5️⃣ اگر درگاه هنوز pending است
    // if (paymentStatusFromGateway === "pending") {
    //   return {
    //     paymentStatus: "PENDING",
    //     redirectUrl: "/payment/pending",
    //     message: "پرداخت هنوز توسط بانک نهایی نشده است.",
    //   };
    // }

    // 6️⃣ اگر پرداخت ناموفق بود
    // if (paymentStatusFromGateway === "failed") {
    //   await prisma.payment.update({
    //     where: { id: paymentId },
    //     data: { status: "FAILED" },
    //   });

    //   return {
    //     paymentStatus: "FAILED",
    //     redirectUrl: "/payment/failure",
    //     message: "پرداخت ناموفق بود. مبلغی از حساب شما کسر نشد.",
    //   };
    // }

    // 7️⃣ پرداخت موفق → تراکنش اتمیک
    const [updatedPayment, updatedBooking] = await prisma.$transaction([
      prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: "PAID",
          verifiedAt: new Date(),
          verifiedById: userId,
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "AWAITING_CONFIRMATION",
        },
      }),
    ]);

    return {
      paymentStatus: "PAID",
      redirectUrl: `/payment/success?bookingId=${updatedBooking.id}&paymentId=${updatedPayment.id}`,
      message:
        "پرداخت با موفقیت انجام شد و رزرو شما در انتظار تأیید کسب‌وکار است.",
      updatedPayment,
      updatedBooking,
    };
  } catch (error: any) {
    console.error("Payment Checking Error:", error);

    return {
      paymentStatus: "ERROR",
      redirectUrl: "/payment/failure",
      message:
        error?.message ||
        "خطای سیستمی در بررسی پرداخت رخ داده است. لطفاً با پشتیبانی تماس بگیرید.",
    };
  }
}
