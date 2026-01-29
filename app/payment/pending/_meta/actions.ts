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
      include: {
        booking: {
          select: {
            discountUsages: {
              select: {
                id: true,
                discountId: true,
                paymentId: true,
              },
            },
          },
        },
      },
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

    // // 6️⃣ اگر پرداخت ناموفق بود
    // if (paymentStatusFromGateway === "failed") {
    //   await prisma.$transaction(async (tx) => {
    //     // 1️⃣ fail payment
    //     await tx.payment.update({
    //       where: { id: paymentId },
    //       data: { status: "FAILED" },
    //     });

    //     // 2️⃣ پیدا کردن discountUsage از روی booking
    //     const discountUsage = await tx.discountUsage.findFirst({
    //       where: {
    //         bookingId,
    //         paymentId,
    //         disCountUsageStatus: "RESERVED", // خیلی مهم
    //       },
    //     });

    //     if (!discountUsage) return;

    //     // 3️⃣ cancel usage
    //     await tx.discountUsage.update({
    //       where: { id: discountUsage.id },
    //       data: {
    //         disCountUsageStatus: "CANCELED",
    //       },
    //     });

    //     // 4️⃣ rollback usedCount
    //     await tx.discount.update({
    //       where: { id: discountUsage.discountId },
    //       data: {
    //         usedCount: { decrement: 1 },
    //       },
    //     });
    //   });

    //   return {
    //     paymentStatus: "FAILED",
    //     redirectUrl: "/payment/failure",
    //     message: "پرداخت ناموفق بود.",
    //     paymentId,
    //   };
    // }

    // 7️⃣ پرداخت موفق → تراکنش اتمیک
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        business: {
          select: {
            id: true,
            commissionRate: true,
          },
        },
        commission: true,
        discountUsages: true,
      },
    });

    if (!booking) {
      return { success: false, message: "رزرو یافت نشد" };
    }

    if (booking.commission) {
      return {
        paymentStatus: "PAID",
        redirectUrl: "/booking/waiting-confirmation",
        message: "کمیسیون این رزرو قبلاً ثبت شده است.",
      };
    }

    const grossAmount = payment.amount;
    const commissionRate = booking.business.commissionRate;

    const platformFee = Math.round((grossAmount * commissionRate) / 100);
    const businessShare = grossAmount - platformFee;

    const { updatedBooking, updatedCommission, updatedPayment } =
      await prisma.$transaction(async (tx) => {
        // 1️⃣ update payment
        const updatedPayment = await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: "PAID",
            verifiedAt: new Date(),
            verifiedById: userId,
          },
        });

        // 2️⃣ update booking
        const updatedBooking = await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: "AWAITING_CONFIRMATION",
            finalPrice: updatedPayment.amount,
            financialStatus: "PAID",
          },
        });

        // 3️⃣ create commission
        const updatedCommission = await tx.commission.create({
          data: {
            bookingId: booking.id,
            businessId: booking.businessId,
            grossAmount,
            platformFee,
            businessShare,
          },
        });

        // 4️⃣ confirm discount usage (soft lock → final)
        const discountUsage = booking.discountUsages.find(
          (item) => item.paymentId === paymentId,
        );

        if (discountUsage) {
          await tx.discountUsage.update({
            where: { id: discountUsage.id },
            data: {
              disCountUsageStatus: "CONFIRMED",
            },
          });
        }

        return {
          updatedPayment,
          updatedBooking,
          updatedCommission,
        };
      });

    return {
      paymentStatus: "PAID",
      redirectUrl: `/payment/success?bookingId=${updatedBooking.id}&paymentId=${updatedPayment.id}`,
      message:
        "پرداخت با موفقیت انجام شد و رزرو شما در انتظار تأیید کسب‌وکار است.",
      updatedPayment,
      updatedBooking,
      updatedCommission,
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
