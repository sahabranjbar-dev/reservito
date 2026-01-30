"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  AlertTriangle,
  XCircle,
  Check,
  ChevronLeft,
  Info,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { format, addDays } from "date-fns-jalali";
import { BookingStatus } from "@prisma/client";

// داده‌های ساختگی برای اسلات‌های خالی (در پروژه واقعی از API دریافت می‌شود)
const MOCK_SLOTS = [
  "10:00",
  "10:30",
  "11:00",
  "14:00",
  "14:30",
  "15:00",
  "16:30",
];

interface ManageBookingClientProps {
  booking: {
    id: string;
    startTime: Date;
    status: BookingStatus;
    service: { name: string; duration: number };
    staff: { name: string };
    finalPrice: number;
    business: { name: string; slug: string };
  };
}

type Mode = "reschedule" | "cancel";

export const ManageBookingClient: React.FC<ManageBookingClientProps> = ({
  booking,
}) => {
  const [mode, setMode] = useState<Mode>("reschedule");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // شبیه‌سازی محاسبه جریمه (مثلاً اگر کمتر از 24 ساعت مانده باشد)
  const hoursLeft =
    (booking.startTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
  const hasPenalty = hoursLeft < 24;
  const penaltyAmount = hasPenalty ? Math.floor(booking.finalPrice * 0.3) : 0; // 30% جریمه

  // تولید 5 روز آینده برای انتخاب تاریخ
  const dates = Array.from({ length: 5 }).map((_, i) => addDays(new Date(), i));

  const handleReschedule = () => {
    if (!selectedTime) return;
    setIsProcessing(true);
    // اینجا اکشن سرور برای تغییر زمان صدا زده می‌شود
    console.log("Rescheduling to:", { date: selectedDate, time: selectedTime });
    setTimeout(() => setIsProcessing(false), 2000);
  };

  const handleCancel = () => {
    if (!cancelReason) return;
    setIsProcessing(true);
    // اینجا اکشن سرور برای لغو صدا زده می‌شود
    console.log("Cancelling reason:", cancelReason);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* 1. هدر: خلاصه نوبت فعلی */}
      <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
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

      {/* 2. تب‌های انتخاب عملیات */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setMode("reschedule")}
          className={`flex-1 py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2
            ${
              mode === "reschedule"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50"
                : "text-slate-500 hover:bg-slate-50"
            }`}
        >
          <RotateCcw size={18} />
          تغییر زمان نوبت
        </button>
        <button
          onClick={() => setMode("cancel")}
          className={`flex-1 py-4 text-sm font-bold transition-colors flex items-center justify-center gap-2
            ${
              mode === "cancel"
                ? "text-rose-600 border-b-2 border-rose-600 bg-rose-50/50"
                : "text-slate-500 hover:bg-slate-50"
            }`}
        >
          <Trash2 size={18} />
          لغو نوبت
        </button>
      </div>

      <div className="p-6 md:p-8">
        {/* بخش تغییر زمان */}
        {mode === "reschedule" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                ۱. انتخاب تاریخ جدید
              </label>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {dates.map((date) => {
                  const isSelected =
                    selectedDate.toDateString() === date.toDateString();
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border
                        ${
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 scale-105 shadow-lg"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                        }
                      `}
                    >
                      <span
                        className={`text-[10px] ${isSelected ? "text-slate-400" : "text-slate-400"}`}
                      >
                        {isToday ? "امروز" : format(date, "EEEE").slice(0, 3)}
                      </span>
                      <span className="text-lg font-bold">
                        {format(date, "dd")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                ۲. ساعت خالی برای {booking.staff.name}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {MOCK_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 rounded-xl text-sm font-bold transition-all border
                      ${
                        selectedTime === time
                          ? "bg-emerald-100 text-emerald-700 border-emerald-300 shadow-sm ring-2 ring-emerald-500/20"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {selectedTime && (
                <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1">
                  <Check size={14} />
                  زمان جدید: {format(selectedDate, "dd MMMM")} ساعت{" "}
                  {selectedTime}
                </p>
              )}
            </div>

            <button
              onClick={handleReschedule}
              disabled={!selectedTime || isProcessing}
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2
                ${!selectedTime || isProcessing ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200"}
              `}
            >
              {isProcessing ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <>
                  <RotateCcw size={20} />
                  تایید و تغییر نوبت
                </>
              )}
            </button>
          </div>
        )}

        {/* بخش لغو نوبت */}
        {mode === "cancel" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* هشدار جریمه */}
            {hasPenalty ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <div className="bg-amber-100 p-2 rounded-full shrink-0">
                  <AlertTriangle size={20} className="text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-800 text-sm">
                    هشدار کسر جریمه
                  </h4>
                  <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                    تا زمان شروع نوبت کمتر از ۲۴ ساعت باقی مانده است. طبق قوانین
                    مجموعه، مبلغ{" "}
                    <span className="font-bold">
                      {penaltyAmount.toLocaleString()} تومان
                    </span>{" "}
                    به عنوان جریمه کسر شده و باقی مبلغ به کیف پول شما باز
                    می‌گردد.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3">
                <div className="bg-emerald-100 p-2 rounded-full shrink-0">
                  <Check size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-800 text-sm">
                    بازگشت کامل وجه
                  </h4>
                  <p className="text-emerald-700 text-xs mt-1">
                    با لغو نوبت، کل مبلغ {booking.finalPrice.toLocaleString()}{" "}
                    تومان به کیف پول شما بازگردانده می‌شود.
                  </p>
                </div>
              </div>
            )}

            {/* انتخاب دلیل */}
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
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-slate-300"
                    />
                    <span className="mr-3 text-sm text-slate-700">
                      {reason}
                    </span>
                  </label>
                ))}
              </div>

              {/* ورودی متن برای سایر موارد */}
              {cancelReason === "سایر موارد" && (
                <textarea
                  className="mt-3 w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder="لطفا دلیل را بنویسید..."
                  rows={2}
                ></textarea>
              )}
            </div>

            <button
              onClick={handleCancel}
              disabled={!cancelReason || isProcessing}
              className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2
                ${!cancelReason || isProcessing ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700 text-white hover:shadow-rose-200"}
              `}
            >
              {isProcessing ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <>
                  <Trash2 size={20} />
                  تایید نهایی لغو نوبت
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
