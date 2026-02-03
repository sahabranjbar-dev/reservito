import { convertToFarsiDigits } from "@/utils/common";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock,
  Clock as ClockIcon,
  List,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { getStaffDashboardData } from "./_meta/actions";
import { Button } from "@/components/ui/button";
import { DisabledSection } from "@/components";

// کامپوننت کارت آمار
const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{title}</p>

        {value ? (
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {convertToFarsiDigits(String(value))}
          </p>
        ) : (
          <span className="text-xs">وجود ندارد</span>
        )}
      </div>
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </div>
);

// کامپوننت نوبت‌ها
const BookingCard = ({
  booking,
  isNext,
}: {
  booking: any;
  isNext?: boolean;
}) => (
  <div
    className={`p-4 rounded-xl border ${isNext ? "bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"} hover:shadow-sm transition-shadow duration-150`}
  >
    <div className="flex justify-between items-start">
      <div className="flex items-start space-x-3 space-x-reverse">
        <div
          className={`p-2 rounded-lg ${isNext ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-700"}`}
        >
          <User
            className={`h-5 w-5 ${isNext ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
          />
        </div>
        <div>
          <div className="flex items-center space-x-2 space-x-reverse mb-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {booking.customer.fullName}
            </p>
            {booking.isNew && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300">
                جدید
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {booking.service.name}
          </p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
            <ClockIcon className="h-4 w-4 ml-1" />
            <span>{format(booking.startTime, "HH:mm", { locale: faIR })}</span>
            {booking.duration && (
              <>
                <span className="mx-2">•</span>
                <span>{booking.duration} دقیقه</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            booking.status === "confirmed"
              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300"
              : booking.status === "pending"
                ? "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300"
                : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
          }`}
        >
          {booking.status === "confirmed"
            ? "تایید شده"
            : booking.status === "pending"
              ? "در انتظار"
              : "لغو شده"}
        </span>
        {isNext && (
          <button className="mt-3 text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-150">
            شروع سرویس
          </button>
        )}
      </div>
    </div>
  </div>
);

// کامپوننت هدر
const DashboardHeader = ({ staff }: { staff: any }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
    <div>
      <div className="flex items-center gap-2">
        <div className="p-3 rounded-2xl bg-linear-to-br from-blue-200 to-indigo-200">
          <User />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {staff.name}
          </h1>
        </div>
      </div>
    </div>
  </div>
);

const StaffDashboardPage = async () => {
  const { staff, todayBookings, stats, nextBooking } =
    await getStaffDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* هدر */}
        <DashboardHeader staff={staff} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ستون سمت چپ - آمار */}
          <div className="lg:col-span-2 space-y-6">
            {/* آمار */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="نوبت‌های امروز"
                value={stats.total}
                icon={Calendar}
                color="text-blue-600"
              />
              <StatCard
                title="تایید شده"
                value={stats.confirmed}
                icon={CheckCircle}
                color="text-green-600"
              />
              <StatCard
                title="در انتظار"
                value={stats.total - stats.confirmed}
                icon={Clock}
                color="text-amber-600"
              />
            </div>

            {/* نوبت بعدی */}
            {nextBooking && (
              <div className="bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      نوبت بعدی شما
                    </h3>
                    <p className="text-blue-100">به زودی شروع می‌شود</p>
                  </div>
                  <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4 ml-1" />
                    <span>
                      {format(nextBooking.startTime, "HH:mm", { locale: faIR })}
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center ml-4">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">
                          نام مشتری: {nextBooking.customer.fullName}
                        </p>
                        <p className="text-blue-100">
                          نام خدمت: {nextBooking.service.name}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={"/dashboard/staff/bookings"}
                      className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors duration-150"
                    >
                      مشاهده نوبت‌ها
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* نوبت‌های امروز */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    نوبت‌های امروز
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {todayBookings.length} نوبت در تقویم امروز
                  </p>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                    <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                    <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {todayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <BookingCard booking={booking} />
                  </div>
                ))}

                {todayBookings.length === 0 && (
                  <div className="p-12 text-center">
                    <div className="inline-flex p-4 rounded-2xl bg-gray-100 dark:bg-gray-700 mb-4">
                      <Calendar className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      هیچ نوبتی برای امروز ندارید
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      می‌توانید زمان‌های خالی خود را برای رزرو مشتریان باز
                      بگذارید
                    </p>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-150">
                      مدیریت زمان‌ها
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ستون سمت راست - اطلاعات جانبی */}
          <div className="space-y-6">
            {/* پروفایل کارمند */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <DisabledSection />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                اطلاعات من
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    تخصص‌ها
                  </span>
                  <div className="flex flex-wrap justify-end gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded">
                      تعریف نشده
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    امتیاز
                  </span>
                  <div className="flex items-center">
                    <div className="flex mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className="h-4 w-4 text-amber-400 fill-current"
                        >
                          ★
                        </div>
                      ))}
                    </div>
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    ساعات کاری
                  </span>
                  <span className="font-medium">۸:۰۰ - ۱۷:۰۰</span>
                </div>
              </div>

              <button className="w-full mt-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-xl font-medium transition-colors duration-150">
                مشاهده پروفایل کامل
              </button>
            </div>

            {/* اقدامات سریع */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                اقدامات سریع
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href={"/dashboard/staff/schedule"}
                  className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center transition-colors duration-150"
                >
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    تقویم کاری
                  </span>
                </Link>
                <Link
                  href={"/dashboard/staff/bookings"}
                  className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-100 dark:border-green-800 flex flex-col items-center justify-center transition-colors duration-150"
                >
                  <User className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    نوبت‌ها
                  </span>
                </Link>
                <Link
                  href="/dashboard/staff/services"
                  className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-100 dark:border-amber-800 flex flex-col items-center justify-center transition-colors duration-150"
                >
                  <List className="h-6 w-6 text-amber-600 dark:text-amber-400 mb-2" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    لیست خدمات
                  </span>
                </Link>
                <Link
                  href={"/dashboard/staff/settings"}
                  className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-100 dark:border-purple-800 flex flex-col items-center justify-center transition-colors duration-150"
                >
                  <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    تنظیمات
                  </span>
                </Link>
              </div>
            </div>

            {/* اطلاعیه‌ها */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <DisabledSection />
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  اطلاعیه‌ها
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  مشاهده همه
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      بروزرسانی سیستم
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      نسخه جدید نرم‌افزار منتشر شد
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
