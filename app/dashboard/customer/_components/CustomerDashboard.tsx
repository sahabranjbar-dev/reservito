"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns-jalali";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  nextBooking?: any;
  pastBookings: any[];
  totalSpent: number;
  totalBookings: number;
}

const CustomerDashboard = ({
  nextBooking,
  pastBookings,
  totalSpent,
  totalBookings,
}: Props) => {
  const session = useSession();

  const getNextBookingDisplay = () => {
    if (!nextBooking) return null;

    const bookingDate = new Date(nextBooking.startTime);
    const isTomorrow = isSameDay(
      bookingDate,
      new Date(new Date().setDate(new Date().getDate() + 1))
    );

    return (
      <div className="relative group">
        {/* پس‌زمینه تصویر بیزنس */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={nextBooking.business.banner || "/images/placeholder.png"}
            alt={nextBooking.business.businessName}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative p-6 md:p-8 min-h-60 flex flex-col justify-end">
          <Badge className="bg-white/20 backdrop-blur border-white/20 text-white w-fit mb-3">
            {isTomorrow ? "فردا" : "بعدی"}
          </Badge>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-1 drop-shadow-md">
            {nextBooking.business.businessName}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6 text-sm md:text-base">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {format(bookingDate, "EEEE d MMMM")}
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              <Clock className="w-4 h-4 text-amber-400" />
              {format(bookingDate, "HH:mm")}
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">
              <MapPin className="w-4 h-4 text-blue-400" />
              {nextBooking.business.address?.substring(0, 20)}...
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-white/70 text-xs mb-1">خدمت انتخابی</p>
              <p className="text-white font-semibold text-lg line-clamp-1">
                {nextBooking.service.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/30 pb-12">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* ==========================================
            1. هدر و خوش‌آمدگویی
        ========================================== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              سلام، {session.data?.user.name || "کاربر مهمان"}
            </h1>
          </div>
        </div>

        {getNextBookingDisplay()}

        {/* اگر رزرو بعدی نداشت */}
        {!nextBooking && (
          <Card className="border-slate-200 border-dashed bg-linear-to-br from-indigo-50 to-white">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                برنامه‌ای ندارید؟
              </h3>
              <p className="text-slate-500 max-w-sm mb-6">
                لیستی از بهترین بیزنس‌های شهر روبروی آماده‌است. همین الان وقت
                بگیر.
              </p>
              <Link href="/businesses">
                <Button className="h-12 px-8 text-base">
                  جستجوی بیزنس‌های نزدیک
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* ==========================================
            3. آمار و دسترسی سریع
        ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* آمار 1 */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                کل خریدها
              </CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {new Intl.NumberFormat("fa-IR").format(totalSpent)}
                <span className="text-xs font-normal text-slate-400 mr-1">
                  تومان
                </span>
              </div>
            </CardContent>
          </Card>

          {/* آمار 2 */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                رزروها
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Ticket className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {totalBookings}
                <span className="text-xs font-normal text-slate-400 mr-1">
                  عدد
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        {pastBookings.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                فعالیت‌های اخیر
              </h2>
              <Link
                href="/dashboard/customer/reservations"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                مشاهده همه
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastBookings.slice(0, 4).map((booking) => (
                <Card
                  key={booking.id}
                  className="border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden">
                      {/* استفاده از بنر به عنوان کوچک آواتار */}
                      <Image
                        src={
                          booking.business.banner || "/images/placeholder.jpg"
                        }
                        alt="thumb"
                        width={50}
                        height={50}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {booking.business.businessName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(booking.startTime), "d MMMM - HH:mm")}
                        <span>•</span>
                        <span className="line-clamp-1">
                          {booking.service.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0 h-5"
                        >
                          {booking.status === "COMPLETED"
                            ? "تکمیل شد"
                            : "لغو شد"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// تابع کمکی مقایسه تاریخ
function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export default CustomerDashboard;
