"use client";

import { StatusBadge } from "@/components";
import { cn } from "@/lib/utils";
import { getCurrentDate } from "@/utils/common";
import { useMutation } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  Loader2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getBookingByDate, getBookingsByRange } from "../_meta/actions";
import BusinessBookingCalender from "./_components/BusinessBookingCalender";

const BookingCard = ({ item }: { item: any }) => {
  const startDate = new Date(item.startTime);
  const timeString = new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(startDate);

  const dateString = new Intl.DateTimeFormat("fa-IR", {
    month: "long",
    day: "numeric",
  }).format(startDate);

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-1.5",
          item.status === "CONFIRMED"
            ? "bg-emerald-500"
            : item.status === "PENDING"
              ? "bg-amber-500"
              : "bg-slate-300",
        )}
      />

      <div className="flex items-start justify-between gap-4 mr-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <span>{item.service.name}</span>
            <StatusBadge status={item?.status} />
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-mono tracking-wide">{timeString}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{dateString}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end text-sm min-w-35">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="font-medium">
              {item.customer.fullName || "نامشخص"}
            </span>
            <User className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-slate-500 text-xs">{item.customer.phone}</div>
          <div className="text-xs text-slate-400 mt-1">
            توسط {item.staff.name}
          </div>
        </div>
      </div>

      {(item.customerNotes || item.cancelReason) && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          {item.status === "CANCELED" && item.cancelReason ? (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 p-2 rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>دلیل لغو: {item.cancelReason}</span>
            </div>
          ) : item.customerNotes ? (
            <div className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg text-xs">
              <FileText className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <span className="leading-relaxed">{item.customerNotes}</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

const BookingCalender = () => {
  const [date, setDate] = useState<string | null>(null);

  const {
    data: bookingData,
    mutateAsync: getMonthData,
    isPending: monthLoading,
  } = useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) => {
      const result = await getBookingsByRange({ type: "range", from, to });

      if (!result.success) {
        toast.error(result.error);
        return result;
      }
      return result;
    },
  });

  const {
    data: dayBookings,
    mutateAsync: getDayData,
    isPending: dayDataLoading,
  } = useMutation({
    mutationFn: async (date: string) => {
      const result = await getBookingByDate(date);

      return result;
    },
  });

  const renderMoreInfo = (v: any) => {
    const hasBooking = bookingData?.data?.some((item: any) => {
      const startTime = new Date(item.startTime);
      const bookingDay = `${startTime.getFullYear()}-${String(
        startTime.getMonth() + 1,
      ).padStart(2, "0")}-${String(startTime.getDate()).padStart(2, "0")}`;
      return bookingDay === v.isoDate;
    });

    if (!hasBooking) return null;

    return (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
        <span className="block w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 transition-all relative min-h-87.5">
        {monthLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-2xl backdrop-blur-sm">
            <Loader2 className="animate-spin text-indigo-600 w-6 h-6" />
          </div>
        )}
        <BusinessBookingCalender
          selectedDate={date}
          onDateSelect={async (date) => {
            setDate(date);
            await getDayData(date);
          }}
          onMonthChange={async (month) => {
            await getMonthData({
              from: month.from,
              to: month.to,
            });
          }}
          moreInfo={renderMoreInfo}
        />
      </div>

      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {dayDataLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="animate-spin w-8 h-8 mb-2 text-indigo-500" />
            <span className="text-sm">در حال بارگذاری نوبت‌ها...</span>
          </div>
        ) : !!date ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-lg text-slate-800">لیست نوبت‌ها</h3>
              <span className="text-sm text-slate-500">
                {dayBookings?.data?.length} رزرو
              </span>
            </div>

            {dayBookings?.data?.length && dayBookings?.data?.length > 0 ? (
              dayBookings?.data?.map((item: any) => (
                <BookingCard key={item.id} item={item} />
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                نوبتی برای این تاریخ ثبت نشده است.
              </div>
            )}
          </div>
        ) : (
          !date && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
              <Calendar className="w-12 h-12 mb-3 opacity-20" />
              <p>لطفاً یک تاریخ را از تقویم انتخاب کنید</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BookingCalender;
