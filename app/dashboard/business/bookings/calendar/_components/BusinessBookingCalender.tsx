/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { toJalaali, toGregorian } from "jalaali-js";

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

interface Props {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  moreInfo?: (day: any) => React.ReactNode;
  onMonthChange?: (range: {
    year: number;
    month: number;
    from: string;
    to: string;
  }) => void;
}

export default function BusinessBookingCalender({
  selectedDate,
  onDateSelect,
  moreInfo,
  onMonthChange,
}: Props) {
  const todayJalali = toJalaali(new Date());

  const [viewYear, setViewYear] = useState(todayJalali.jy);
  const [viewMonth, setViewMonth] = useState(todayJalali.jm);

  /* ---------- Sync with selectedDate ---------- */
  useEffect(() => {
    if (!selectedDate) return;
    const j = toJalaali(new Date(selectedDate));
    setViewYear(j.jy);
    setViewMonth(j.jm);
  }, [selectedDate]);

  /* ---------- Notify parent on month change ---------- */
  useEffect(() => {
    const daysInMonth =
      viewMonth <= 6
        ? 31
        : viewMonth <= 11
          ? 30
          : isLeapJalali(viewYear)
            ? 30
            : 29;

    const gFrom = toGregorian(viewYear, viewMonth, 1);
    const gTo = toGregorian(viewYear, viewMonth, daysInMonth);

    onMonthChange?.({
      year: viewYear,
      month: viewMonth,
      from: formatISO(gFrom),
      to: formatISO(gTo),
    });
  }, [viewYear, viewMonth]);

  /* ---------- Calendar days ---------- */
  const days = useMemo(() => {
    const daysInMonth =
      viewMonth <= 6
        ? 31
        : viewMonth <= 11
          ? 30
          : isLeapJalali(viewYear)
            ? 30
            : 29;

    const gFirst = toGregorian(viewYear, viewMonth, 1);
    const startOffset =
      (new Date(gFirst.gy, gFirst.gm - 1, gFirst.gd).getDay() + 1) % 7;

    const result: any[] = [];

    for (let i = 0; i < startOffset; i++) result.push({ type: "padding" });

    for (let d = 1; d <= daysInMonth; d++) {
      const g = toGregorian(viewYear, viewMonth, d);
      const iso = formatISO(g);

      result.push({
        type: "day",
        value: d,
        isoDate: iso,
        isToday:
          iso ===
          formatISO(
            toGregorian(todayJalali.jy, todayJalali.jm, todayJalali.jd),
          ),
        isSelected: iso === selectedDate,
      });
    }

    return result;
  }, [viewYear, viewMonth, selectedDate]);

  /* ---------- Month navigation ---------- */
  const changeMonth = (dir: 1 | -1) => {
    setViewMonth((m) => {
      if (m + dir > 12) {
        setViewYear((y) => y + 1);
        return 1;
      }
      if (m + dir < 1) {
        setViewYear((y) => y - 1);
        return 12;
      }
      return m + dir;
    });
  };

  return (
    <div className="bg-white border rounded-2xl p-4 space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={() => changeMonth(-1)}>
          <ChevronRight />
        </button>
        <span className="font-bold">
          {MONTHS[viewMonth - 1]} {viewYear}
        </span>
        <button onClick={() => changeMonth(1)}>
          <ChevronLeft />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-xs text-slate-400">
            {d}
          </div>
        ))}

        {days.map((d, i) =>
          d.type === "padding" ? (
            <div key={i} />
          ) : (
            <button
              key={d.isoDate}
              onClick={() => onDateSelect(d.isoDate)}
              className={cn(
                "py-3 rounded-lg relative",
                d.isSelected && "bg-indigo-600 text-white",
                d.isToday && !d.isSelected && "border border-indigo-400",
              )}
            >
              {new Intl.NumberFormat("fa-IR").format(d.value)}
              {moreInfo?.(d)}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function formatISO(g: { gy: number; gm: number; gd: number }) {
  return `${g.gy}-${String(g.gm).padStart(2, "0")}-${String(g.gd).padStart(2, "0")}`;
}

function isLeapJalali(year: number) {
  return (year % 33) % 4 === 1;
}
