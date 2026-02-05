"use client";

import { useState, useMemo, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { toJalaali, toGregorian } from "jalaali-js";

interface PersianCalendarProps {
  selectedDate: string | null; // فرمت YYYY-MM-DD
  onDateSelect: (date: string) => void; // کالبک برای تغییر تاریخ
  moreInfo?: ReactNode;
}

const MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const WEEK_DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const PersianCalendar = ({
  selectedDate,
  onDateSelect,
  moreInfo,
}: PersianCalendarProps) => {
  // استیت‌های نمایانگر ماه جاری در تقویم (نه لزوماً تاریخ انتخاب شده)
  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);

  // هندل کردن تاریخ انتخاب شده
  const handleDateClick = (dateString: string) => {
    onDateSelect(dateString);
  };

  // تغییر ماه تقویم
  const changeMonth = (direction: 1 | -1) => {
    let newMonth = viewMonth + direction;
    let newYear = viewYear;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setViewMonth(newMonth);
    setViewYear(newYear);
  };

  // تولید روزهای ماه برای رندر
  const calendarDays = useMemo(() => {
    // 1. پیدا کردن تعداد روزهای ماه شمسی
    // 6 ماه اول 31 روزه، 5 ماه بعدی 30 روزه، اسفند 29 یا 30 روزه
    const daysInMonth =
      viewMonth <= 6
        ? 31
        : viewMonth <= 11
          ? 30
          : (viewYear % 4 === 3 &&
                (viewYear % 33) % 4 === 1 &&
                (viewYear % 33) % 132 !== 1) ||
              ((viewYear % 33) % 4 === 1 && (viewYear % 33) % 132 !== 1) // سال کبیسه
            ? 30
            : 29;

    // 2. پیدا کردن اینکه روز اول ماه شمسی، چه روزی از هفته در تقویم میلادی است
    const gDate = toGregorian(viewYear, viewMonth, 1);
    const dateObj = new Date(gDate.gy, gDate.gm - 1, gDate.gd);

    // .getDay(): Sun=0, Mon=1, ..., Sat=6
    // ما میخواهیم شنبه (6) اول هفته باشد.
    // محاسبه offset (تعداد خالی قبل از روز اول)
    const startDayOfWeek = dateObj.getDay();
    let startOffset = startDayOfWeek + 1; // تبدیل Sun=0 به Sat=0 منطق
    if (startOffset === 7) startOffset = 0; // شنبه (6) شد 0؟ نه، شنبه 6 است.
    // منطق ساده‌تر:
    // Sun(0)->Mon(1) => Offset 1
    // ...
    // Sat(6)->Sun(0) => Offset 0
    const firstDayOffset = (startDayOfWeek + 1) % 7;

    const days = [];

    // پر کردن فضاهای خالی قبل از اول ماه
    for (let i = 0; i < firstDayOffset; i++) {
      days.push({ type: "padding", value: "" });
    }

    // پر کردن روزهای ماه
    for (let i = 1; i <= daysInMonth; i++) {
      const gDateItem = toGregorian(viewYear, viewMonth, i);
      const isoDate = `${gDateItem.gy}-${String(gDateItem.gm).padStart(
        2,
        "0",
      )}-${String(gDateItem.gd).padStart(2, "0")}`;

      // بررسی اینکه آیا این روز "امروز" است؟ (برای هایلایت کردن اختیاری)
      const today = new Date();
      const isToday =
        today.getFullYear() === gDateItem.gy &&
        today.getMonth() === gDateItem.gm - 1 &&
        today.getDate() === gDateItem.gd;

      // بررسی اینکه آیا انتخاب شده است؟
      const isSelected = isoDate === selectedDate;

      // بررسی آیا روز گذشته است؟ (غیرفعال کردن)
      // فرض می‌کنیم فقط روزهای آینده/امروز قابل انتخاب هستند
      const isPast =
        new Date(isoDate).setHours(0, 0, 0, 0) <
        new Date().setHours(0, 0, 0, 0);

      days.push({
        type: "day",
        value: i,
        isoDate,
        isToday,
        isSelected,
        isPast,
      });
    }

    return days;
  }, [viewYear, viewMonth, selectedDate]);

  // هنگام شروع، به ماه جاری برو
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedDate) {
        const jDate = toJalaali(new Date(selectedDate));
        setViewYear(jDate.jy);
        setViewMonth(jDate.jm);
      } else {
        const jToday = toJalaali(new Date());
        setViewYear(jToday.jy);
        setViewMonth(jToday.jm);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [selectedDate]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
      {/* هدر تقویم: ماه و سال */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => changeMonth(-1)}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <span className="font-bold text-lg text-slate-800 flex items-center gap-2">
          {MONTHS[viewMonth - 1]} {viewYear}
        </span>
        <button
          onClick={() => changeMonth(1)}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* گرید روزها */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
        {/* هدرهای روزهای هفته */}
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-xs font-bold text-slate-400 py-2">
            {day}
          </div>
        ))}

        {/* روزهای ماه */}
        {calendarDays.map((day, index) => {
          if (day.type === "padding") {
            return <div key={index} className="py-2" />;
          }

          return (
            <button
              key={day.isoDate}
              disabled={day.isPast} // روزهای گذشته غیرفعال
              onClick={() => !day.isPast && handleDateClick(day.isoDate as any)}
              className={cn(
                "py-4 rounded-lg text-sm font-medium transition-all relative",
                day.isSelected
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : day.isPast
                    ? "text-slate-200 cursor-not-allowed"
                    : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600",
                day.isToday &&
                  !day.isSelected &&
                  "border border-indigo-300 text-indigo-600",
              )}
            >
              {new Intl.NumberFormat("fa-IR").format(day.value as any)}
              {moreInfo ? moreInfo : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PersianCalendar;
