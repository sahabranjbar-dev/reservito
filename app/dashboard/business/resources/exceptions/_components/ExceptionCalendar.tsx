/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { cn } from "@/lib/utils";
import { toGregorian, toJalaali } from "jalaali-js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CalendarMode = "single" | "multiple" | "range";

export type RangeValue = {
  start?: string | null;
  end?: string | null;
};

interface ExceptionCalendarProps {
  mode: CalendarMode;
  value: string | string[] | RangeValue;
  onChange: (value: string | string[] | RangeValue) => void;

  exceptions?: {
    date: string;
    isClosed: boolean;
  }[];
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

const ExceptionCalendar = ({
  mode,
  value,
  onChange,
  exceptions,
}: ExceptionCalendarProps) => {
  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);

  /* -------------------- init -------------------- */
  useEffect(() => {
    const jToday = toJalaali(new Date());
    setViewYear(jToday.jy);
    setViewMonth(jToday.jm);
  }, []);

  /* -------------------- helpers -------------------- */
  const changeMonth = (dir: 1 | -1) => {
    let m = viewMonth + dir;
    let y = viewYear;

    if (m > 12) {
      m = 1;
      y++;
    } else if (m < 1) {
      m = 12;
      y--;
    }

    setViewMonth(m);
    setViewYear(y);
  };

  const isSelected = (iso: string) => {
    if (mode === "single") return value === iso;

    if (mode === "multiple") return Array.isArray(value) && value.includes(iso);

    if (mode === "range") {
      const r = value as RangeValue;
      if (!r.start) return false;
      if (!r.end) return iso === r.start;
      return iso >= r.start && iso <= r.end;
    }

    return false;
  };

  const handleSelect = (iso: string) => {
    if (mode === "single") {
      onChange(iso);
      return;
    }

    if (mode === "multiple") {
      const current = Array.isArray(value) ? value : [];
      onChange(
        current.includes(iso)
          ? current.filter((d) => d !== iso)
          : [...current, iso],
      );
      return;
    }

    if (mode === "range") {
      const r = value as RangeValue;
      if (!r.start || r.end) {
        onChange({ start: iso, end: null });
      } else {
        onChange(
          iso < r.start
            ? { start: iso, end: r.start }
            : { start: r.start, end: iso },
        );
      }
    }
  };

  /* -------------------- calendar days -------------------- */
  const days = useMemo(() => {
    const daysInMonth =
      viewMonth <= 6
        ? 31
        : viewMonth <= 11
          ? 30
          : (viewYear % 33) % 4 === 1
            ? 30
            : 29;

    const g = toGregorian(viewYear, viewMonth, 1);
    const firstDay = new Date(g.gy, g.gm - 1, g.gd).getDay();
    const offset = (firstDay + 1) % 7;

    const items: any[] = [];

    for (let i = 0; i < offset; i++) {
      items.push({ type: "empty" });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const gDay = toGregorian(viewYear, viewMonth, d);
      const iso = `${gDay.gy}-${String(gDay.gm).padStart(2, "0")}-${String(
        gDay.gd,
      ).padStart(2, "0")}`;

      const today = new Date();
      const isToday =
        today.getFullYear() === gDay.gy &&
        today.getMonth() === gDay.gm - 1 &&
        today.getDate() === gDay.gd;

      const isPast =
        new Date(iso).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

      items.push({ type: "day", d, iso, isToday, isPast });
    }

    return items;
  }, [viewYear, viewMonth, value]);

  const exceptionDates = useMemo(() => {
    return new Set(exceptions?.map((e) => e.date));
  }, [exceptions]);

  const isExceptionDay = (isoDate: string) => {
    return exceptionDates.has(isoDate);
  };

  /* -------------------- render -------------------- */
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => changeMonth(-1)}
          className="p-1 hover:bg-slate-100 rounded-full"
        >
          <ChevronRight size={20} />
        </button>

        <span className="font-bold text-slate-800">
          {MONTHS[viewMonth - 1]} {viewYear}
        </span>

        <button
          onClick={() => changeMonth(1)}
          className="p-1 hover:bg-slate-100 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 text-center text-xs text-slate-400">
        {WEEK_DAYS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, i) => {
          return day.type === "empty" ? (
            <div key={i} />
          ) : (
            <button
              key={day.iso}
              onClick={() => handleSelect(day.iso)}
              className={cn(
                "py-3 rounded-lg text-sm relative",

                isSelected(day.iso) &&
                  "bg-indigo-600 text-white hover:text-black",

                !isSelected(day.iso) &&
                  isExceptionDay(day.iso) &&
                  "bg-red-100 text-red-600",

                isSelected(day.iso) &&
                  isExceptionDay(day.iso) &&
                  "bg-linear-to-br from-indigo-600 to-red-500 text-white",

                "hover:bg-indigo-50",
              )}
            >
              {day.d}

              {isExceptionDay(day.iso) && (
                <span className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExceptionCalendar;
