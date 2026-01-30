import React from "react";
import { redirect } from "next/navigation";
import { ManageBookingClient } from "./_components/ManageBookingClient";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { BookingStatus } from "@/constants/enums";
import { XCircle } from "lucide-react";

export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const { id: bookingId } = await params;

  // دریافت نوبت با جزئیات کامل
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      business: { select: { id: true, businessName: true, slug: true } },
      service: { select: { name: true, duration: true } },
      staff: { select: { name: true } },
    },
  });

  // بررسی‌های امنیتی و منطقی
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-rose-500">نوبت مورد نظر یافت نشد.</div>
      </div>
    );
  }

  // اگر نوبت متعلق به کاربر نیست
  if (booking.customerId !== session.user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center text-rose-500">دسترسی غیرمجاز.</div>
      </div>
    );
  }

  // اگر نوبت تمام شده یا قبلاً لغو شده باشد
  if (
    booking.status === BookingStatus.COMPLETED ||
    booking.status === BookingStatus.CANCELED ||
    booking.status === BookingStatus.REJECTED
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center max-w-md">
          <XCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800">
            این نوبت دیگر قابل تغییر نیست
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            وضعیت نوبت شما{" "}
            <span className="font-bold">
              {booking.status === BookingStatus.COMPLETED
                ? "انجام شده"
                : "لغو شده"}
            </span>{" "}
            است.
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-lg text-sm"
          >
            بازگشت
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4">
      <ManageBookingClient booking={booking as any} />
    </div>
  );
}
