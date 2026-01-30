import React from "react";
import { Calendar, Search } from "lucide-react";
import { ActiveBookingCard } from "./_components/ActiveBookingCard";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { BookingStatus } from "@/constants/enums";
// ایمپورت کردن Enumها از پرایسما

export default async function ActiveBookingsPage() {
  const session = await getServerSession(authOptions);

  // اگر کاربر لاگین نیست، ریدایرکت کن
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const customerId = session.user.id;

  // دریافت نوبت‌های فعال با فیلتر و مرتب‌سازی دقیق
  const bookings = await prisma.booking.findMany({
    where: {
      customerId,
      // فقط نوبت‌هایی که یا نیاز به پرداخت دارند، یا منتظر تایید هستند، یا تایید شده‌اند
      status: {
        in: [
          BookingStatus.AWAITING_PAYMENT,
          BookingStatus.AWAITING_CONFIRMATION,
          BookingStatus.CONFIRMED,
        ],
      },
    },
    include: {
      business: {
        select: {
          id: true,
          businessName: true,
          businessType: true,
          logo: true,
          address: true,
        },
      },
      service: {
        select: {
          name: true,
          duration: true,
        },
      },
      staff: {
        select: {
          name: true,
          avatar: true,
        },
      },
      // شامل کردن تخفیف‌ها برای نمایش در کارت
      discountUsages: {
        select: {
          discountAmount: true,
        },
      },
    },
    orderBy: {
      startTime: "asc", // نوبت‌های زودتر اول نمایش داده شوند
    },
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* هدر ثابت */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-auto text-center md:text-right">
            <h1 className="text-2xl font-extrabold text-slate-800">
              نوبت‌های فعال من
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              مدیریت و پیگیری رزروهای آینده
            </p>
          </div>

          {/* جستجو (در حالت سرور کامپوننت، این بصورت ویژوال است یا باید فرم ارسال شود) */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="جستجو در نام سالن یا خدمت..."
              className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>
        </div>
      </header>

      {/* لیست نوبت‌ها */}
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">
              هیچ نوبت فعالی ندارید
            </h3>
            <p className="text-slate-500 mt-2 mb-8 max-w-xs mx-auto">
              در حال حاضر هیچ رزرو تایید شده‌ای برای نمایش وجود ندارد.
            </p>
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1">
              رزرو نوبت جدید
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <ActiveBookingCard key={booking.id} {...booking} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
