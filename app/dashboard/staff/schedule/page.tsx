"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import StaffCalender from "../_components/StaffCalender";
import { useMutation } from "@tanstack/react-query";
import StaffBookingCard from "./_components/StaffBookingCard";
import { Calendar, Loader2 } from "lucide-react";
import {
  getStaffBookingsByDate,
  getStaffBookingsByRange,
} from "./_meta/actions";
import { toast } from "sonner";

const StaffDashboardSchedule = () => {
  const [date, setDate] = useState<string | null>(null);

  const {
    data: bookingData,
    mutateAsync: getMonthData,
    isPending: monthLoading,
  } = useMutation({
    mutationFn: async ({
      endDate,
      startDate,
    }: {
      endDate: string;
      startDate: string;
    }) => {
      const result = await getStaffBookingsByRange({ endDate, startDate });

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
    mutationFn: async (date: { date: string }) => {
      const result = await getStaffBookingsByDate(date);

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
    <Card>
      <CardTitle>تقویم کاری</CardTitle>

      <CardContent>
        <div className=" grid grid-cols-1 gap-4 p-4 max-w-4xl mx-auto">
          <StaffCalender
            selectedDate={date}
            onDateSelect={async (date) => {
              setDate(date);
              await getDayData({ date });
            }}
            onMonthChange={async (month) => {
              await getMonthData({
                startDate: month.from,
                endDate: month.to,
              });
            }}
            moreInfo={renderMoreInfo}
          />

          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {dayDataLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <Loader2 className="animate-spin w-8 h-8 mb-2 text-indigo-500" />
                <span className="text-sm">در حال بارگذاری نوبت‌ها...</span>
              </div>
            ) : !!date ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-lg text-slate-800">
                    لیست نوبت‌ها
                  </h3>
                  <span className="text-sm text-slate-500">
                    {dayBookings?.data?.length} رزرو
                  </span>
                </div>

                {dayBookings?.data?.length && dayBookings?.data?.length > 0 ? (
                  dayBookings?.data?.map((item) => (
                    <StaffBookingCard key={item.id} item={item} />
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
      </CardContent>
    </Card>
  );
};

export default StaffDashboardSchedule;
