import React from "react";
import { HistoryListWrapper } from "./_components/HistoryListWrapper";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { redirect } from "next/navigation";
import { History } from "lucide-react";
import { BookingStatus } from "@/constants/enums";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تاریخچه‌ی رزرو‌ها | رزرویتو",
};

export default async function BookingHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const customerId = session.user.id;

  // دریافت نوبت‌های گذشته (فقط وضعیت‌های غیرفعال)
  const bookings = await prisma.booking.findMany({
    where: {
      customerId,
    },
    include: {
      business: {
        select: {
          id: true,
          businessName: true,
          businessType: true,
          logo: true,
          slug: true, // مهم برای لینک رزرو مجدد
        },
      },
      service: {
        select: {
          name: true,
          duration: true,
          id: true,
        },
      },
      staff: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      startTime: "desc", // جدیدترین‌ها اول
    },
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* هدر صفحه */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <History size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              تاریخچه نوبت‌ها
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              بررسی رزروهای گذشته و رزرو مجدد
            </p>
          </div>
        </div>
      </header>

      {/* محتوای اصلی */}
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <History size={40} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">
              هنوز هیچ نوبتی نداشته‌اید
            </h3>
            <p className="text-slate-500 mt-2 mb-6 text-sm">
              به محض ثبت یا انجام اولین نوبت، اینجا نمایش داده می‌شود.
            </p>
          </div>
        ) : (
          <HistoryListWrapper bookings={bookings as any} />
        )}
      </main>
    </div>
  );
}
