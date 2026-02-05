"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Check,
  RotateCcw,
  Trash2,
  ArrowRight,
  XCircle,
} from "lucide-react";
import { format } from "date-fns-jalali";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { convertToEnglishDigits, convertToFarsiDigits } from "@/utils/common";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";
import { useRouter } from "next/navigation";
import {
  cancelBookingAction,
  getAvailableSlotsAction,
  updateBookingAction,
} from "../../../_meta/actions";
import { BookingStatus } from "@/constants/enums";
import PersianCalendar from "@/app/business/detail/[businessId]/[slug]/_components/PersianCalendar";

interface ManageBookingClientProps {
  booking: {
    id: string;
    startTime: Date;
    status: BookingStatus;
    service: { name: string; duration: number; id: string };
    staff: { name: string };
    finalPrice: number;
    business: { name: string; slug: string; id: string };
  };
}

type Mode = "reschedule" | "cancel";

export const ManageBookingClient: React.FC<ManageBookingClientProps> = ({
  booking,
}) => {
  const bookingId = booking.id;

  const confirm = useConfirm();

  const { back } = useRouter();

  const initialSelectedDate = useMemo(
    () => new Date(booking.startTime).toISOString().split("T")[0],
    [booking.startTime],
  );

  const initialSelectedSlot = useMemo(
    () =>
      convertToEnglishDigits(
        Intl.DateTimeFormat("fa", { timeStyle: "short" }).format(
          new Date(booking.startTime),
        ),
      ),
    [booking.startTime],
  );

  const [mode, setMode] = useState<Mode>("reschedule");
  const [selectedDate, setSelectedDate] = useState<string>(initialSelectedDate);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(
    initialSelectedSlot,
  );
  const [cancelReason, setCancelReason] = useState<string>("");

  // --- Query برای دریافت اسلات‌های خالی ---
  const { data: availableSlots, isLoading: isLoadingSlots } = useQuery({
    queryKey: [
      "availableSlots",
      booking.business.id,
      selectedDate,
      booking.service.id,
    ],
    queryFn: async () => {
      if (!selectedDate || !booking.service.id) return [];
      const response = await getAvailableSlotsAction({
        businessId: booking.business.id,
        date: selectedDate,
        serviceId: booking.service.id,
      });
      return response.success ? response.slots : [];
    },
    enabled: !!selectedDate && !!booking.service.id,
  });

  // --- Mutation برای تغییر نوبت ---
  const { isPending: updateLoading, mutateAsync: updateBooking } = useMutation({
    mutationFn: async (data: {
      bookingId: string;
      date: string;
      time: string;
    }) => {
      const response = await updateBookingAction(data);
      if (!response.success) toast.error(response.error);
      else toast.success(response.message);
      return response.bookingId;
    },
  });

  // --- Mutation برای لغو نوبت ---
  const { isPending: deleteLoading, mutateAsync: deleteBooking } = useMutation({
    mutationFn: async (data: { bookingId: string; reason: string }) => {
      const response = await cancelBookingAction(data);
      if (!response.success) toast.error(response.error);
      else toast.success(response.message);
      return response;
    },
  });

  const isSameTime =
    selectedDate === initialSelectedDate &&
    selectedSlot === initialSelectedSlot;

  const handleReschedule = () => {
    if (!selectedDate || !selectedSlot)
      return toast.error("تاریخ و زمان اجباری هستند");
    updateBooking({ bookingId, date: selectedDate, time: selectedSlot });
  };

  const handleCancel = () => {
    if (!cancelReason) return toast.error("لطفاً دلیل لغو را انتخاب کنید");
    confirm({
      description: "آیا میخواهید نوبت را لغو کنید",
    }).then((value) => {
      if (!value) return;

      deleteBooking({ bookingId, reason: cancelReason });
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        type="button"
        variant="ghost"
        rightIcon={<ArrowRight />}
        className="font-semibold my-2"
        onClick={() => {
          back();
        }}
      >
        بازگشت
      </Button>
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* هدر */}
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-1">{booking.service.name}</h2>
              <p className="text-slate-300 text-sm">{booking.business.name}</p>
            </div>
            <span className="bg-indigo-500/30 text-indigo-200 text-xs px-3 py-1 rounded-full border border-indigo-500/30">
              شناسه: {booking.id.slice(0, 6)}
            </span>
          </div>

          <div className="relative z-10 mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-indigo-300" />
              {format(booking.startTime, "dd MMMM")}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-indigo-300" />
              {format(booking.startTime, "HH:mm")}
            </div>
          </div>
        </div>

        {/* تب‌ها */}
        <div className="flex border-b border-slate-200">
          {[
            {
              key: "reschedule",
              label: "تغییر زمان نوبت",
              icon: <RotateCcw size={18} />,
              color: "indigo",
            },
            {
              key: "cancel",
              label: "لغو نوبت",
              icon: <Trash2 size={18} />,
              color: "rose",
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMode(tab.key as Mode)}
              className={cn(
                "flex-1 py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2",
                mode === tab.key
                  ? `text-${tab.color}-600 border-b-2 border-${tab.color}-600 bg-${tab.color}-50/50`
                  : "text-slate-500 hover:bg-slate-50",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          {/* تغییر زمان */}
          {mode === "reschedule" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  ۱. انتخاب تاریخ جدید
                </label>
                <PersianCalendar
                  selectedDate={selectedDate}
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedSlot(null);
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  ۲. ساعت خالی برای {booking.staff.name}
                </label>
                <div className="w-full">
                  {isLoadingSlots ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
                    </div>
                  ) : availableSlots?.length ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map(({ status, staffCount, time }) => (
                        <button
                          key={time}
                          disabled={status !== "available" || staffCount < 1}
                          onClick={() =>
                            status === "available" && setSelectedSlot(time)
                          }
                          className={cn(
                            "h-10 rounded-lg text-sm font-medium transition-all border relative overflow-hidden group",
                            status === "available"
                              ? "bg-white border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                              : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed line-through select-none",
                          )}
                        >
                          <span
                            className={cn("relative z-10", {
                              "text-white":
                                status === "available" && selectedSlot === time,
                            })}
                          >
                            {convertToFarsiDigits(time)}
                          </span>
                          {status !== "available" && (
                            <XCircle className="absolute inset-0 m-auto w-4 h-4 text-slate-200 opacity-0 group-hover:opacity-100" />
                          )}
                          {status === "available" && selectedSlot === time && (
                            <div className="absolute inset-0 bg-indigo-600 text-white flex items-center justify-center">
                              {convertToFarsiDigits(time)}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-sm text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
                      زمان خالی در این تاریخ یافت نشد.
                    </div>
                  )}
                </div>

                {!isSameTime && selectedSlot && (
                  <div className="text-emerald-600 mt-3">
                    <p className="flex items-center gap-2">
                      <Check size={14} />
                      زمان جدید:
                    </p>
                    <p>
                      تاریخ:{" "}
                      {new Intl.DateTimeFormat("fa").format(
                        new Date(selectedDate),
                      )}
                    </p>
                    <p>ساعت: {convertToFarsiDigits(selectedSlot)}</p>
                  </div>
                )}
              </div>

              <Button
                onClick={handleReschedule}
                disabled={!selectedSlot || isSameTime || updateLoading}
                className={cn(
                  "w-full py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2",
                  !selectedSlot || isSameTime || updateLoading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200",
                )}
              >
                {updateLoading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                ) : (
                  <>
                    <RotateCcw size={20} /> تایید و تغییر نوبت
                  </>
                )}
              </Button>
            </div>
          )}

          {/* لغو نوبت */}
          {mode === "cancel" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  دلیل لغو نوبت
                </label>
                <div className="space-y-2">
                  {[
                    "تغییر برنامه کاری من",
                    "فراموشی یا اشتباه در زمان",
                    "بیماری یا اورژانس",
                    "نیاز به خدمت دیگر",
                    "سایر موارد",
                  ].map((reason) => (
                    <label
                      key={reason}
                      className="flex items-center p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="reason"
                        value={reason}
                        disabled={deleteLoading}
                        checked={cancelReason.startsWith(reason)}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-slate-300"
                      />
                      <span className="mr-3 text-sm text-slate-700">
                        {reason}
                      </span>
                    </label>
                  ))}
                </div>
                {cancelReason.startsWith("سایر موارد") && (
                  <textarea
                    className="mt-3 w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="لطفا دلیل را بنویسید..."
                    rows={2}
                    onChange={(e) =>
                      setCancelReason(`سایر موارد: ${e.target.value}`)
                    }
                  />
                )}
              </div>

              <Button
                onClick={handleCancel}
                disabled={!cancelReason || deleteLoading}
                className={cn(
                  "w-full py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2",
                  !cancelReason || deleteLoading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-rose-600 hover:bg-rose-700 text-white hover:shadow-rose-200",
                )}
              >
                {deleteLoading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                ) : (
                  <>
                    تایید نهایی لغو نوبت <Trash2 size={20} />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
