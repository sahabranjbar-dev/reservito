"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronLeft,
  Clock,
  Calendar,
  X,
  Save,
} from "lucide-react";
import { toJalaali, toGregorian } from "jalaali-js";
import { toast } from "sonner";
import { useTransition } from "react";

/* ------------------ Types ------------------ */

interface WeeklySchedule {
  dayOfWeek: number;
  startTime: string | null;
  endTime: string | null;
  isClosed: boolean;
}

interface Exception {
  date: string; // YYYY-MM-DD
  isClosed: boolean;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
}

// حالت‌های انتخاب شده در فرم
type FormMode = "DEFAULT" | "CUSTOM" | "CLOSED";

/* ------------------ Calendar (Sub-component) ------------------ */

interface StaffCalendarProps {
  exceptions: Exception[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const StaffCalendar = ({
  exceptions,
  selectedDate,
  onDateSelect,
}: StaffCalendarProps) => {
  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);

  const calendarDays = useMemo(() => {
    const daysInMonth = viewMonth <= 6 ? 31 : viewMonth <= 11 ? 30 : 29;
    const gDate = toGregorian(viewYear, viewMonth, 1);
    const dateObj = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
    const startDayOfWeek = dateObj.getDay();
    const firstDayOffset = (startDayOfWeek + 1) % 7;
    const days = [];

    for (let i = 0; i < firstDayOffset; i++)
      days.push({ type: "padding", value: "" });

    for (let i = 1; i <= daysInMonth; i++) {
      const gDateItem = toGregorian(viewYear, viewMonth, i);
      const isoDate = `${gDateItem.gy}-${String(gDateItem.gm).padStart(
        2,
        "0"
      )}-${String(gDateItem.gd).padStart(2, "0")}`;
      const exception = exceptions.find((e) => e.date === isoDate);

      days.push({
        type: "day",
        value: i,
        isoDate,
        isToday: new Date().toISOString().split("T")[0] === isoDate,
        isSelected: isoDate === selectedDate,
        status: exception
          ? exception.isClosed
            ? "CLOSED"
            : "CUSTOM"
          : "DEFAULT",
      });
    }
    return days;
  }, [viewYear, viewMonth, selectedDate, exceptions]);

  useEffect(() => {
    const jToday = toJalaali(new Date());
    setViewYear(jToday.jy);
    setViewMonth(jToday.jm);
  }, []);

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

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => changeMonth(-1)}
          className="p-1 hover:bg-slate-100 rounded-full"
        >
          <ChevronRight />
        </button>
        <span className="font-bold text-lg text-slate-800">
          {" "}
          {/* ماه */} {/* ماه‌های شمسی را می‌توانید اینجا قرار دهید */}
          {
            [
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
            ][viewMonth - 1]
          }{" "}
          {viewYear}
        </span>
        <button
          onClick={() => changeMonth(1)}
          className="p-1 hover:bg-slate-100 rounded-full"
        >
          <ChevronLeft />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((d) => (
          <div key={d} className="text-xs font-bold text-slate-400 py-2">
            {d}
          </div>
        ))}
        {calendarDays.map((day, i) =>
          day.type === "padding" ? (
            <div key={i} className="py-2" />
          ) : (
            <button
              key={day.isoDate}
              onClick={() => onDateSelect(day.isoDate as string)}
              className={cn(
                "h-10 w-10 mx-auto flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                day.isSelected
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : day.status === "CLOSED"
                  ? "bg-red-50 text-red-600 border border-red-200"
                  : day.status === "CUSTOM"
                  ? "bg-purple-50 text-purple-600 border border-purple-200"
                  : "hover:bg-slate-50 text-slate-700"
              )}
            >
              {new Intl.NumberFormat("fa-IR").format(day.value as any)}
            </button>
          )
        )}
      </div>
    </div>
  );
};

/* ------------------ Main Component ------------------ */

const StaffExceptionManager = ({
  staffId,
  weeklySchedule, // باید برنامه هفتگی استاندارد را پاس بدهید
}: {
  staffId: string;
  weeklySchedule: WeeklySchedule[];
}) => {
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // فیلدهای فرم
  const [formMode, setFormMode] = useState<FormMode>("DEFAULT");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [reason, setReason] = useState("");

  // پیدا کردن برنامه پیش‌فرض روز انتخاب شده
  const defaultScheduleForDay = useMemo(() => {
    if (!selectedDate) return null;
    const dateObj = new Date(selectedDate);
    const dayOfWeek = dateObj.getDay(); // Sun=0 ... Sat=6
    return weeklySchedule.find((s) => s.dayOfWeek === dayOfWeek);
  }, [selectedDate, weeklySchedule]);

  // هندل کلیک روی تاریخ
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    const ex = exceptions.find((e) => e.date === date);

    if (ex) {
      // اگر قبلاً استثنا ثبت شده
      if (ex.isClosed) {
        setFormMode("CLOSED");
      } else {
        setFormMode("CUSTOM");
        setStartTime(ex.startTime || "09:00");
        setEndTime(ex.endTime || "17:00");
      }
      setReason(ex.reason || "");
    } else {
      // اگر استثنایی وجود ندارد
      setFormMode("DEFAULT");
      setReason("");
    }
  };

  // ذخیره استثنا
  const handleSave = () => {
    if (!selectedDate) return;

    startTransition(async () => {
      // منطق آپدیت لوکال (برای سرعت UI)
      const newExceptions = exceptions.filter((e) => e.date !== selectedDate);

      if (formMode === "DEFAULT") {
        // حذف استثنا
        // await prisma.staffException.delete({ where: { ... } })
      } else if (formMode === "CLOSED") {
        // افزودن تعطیلی
        newExceptions.push({
          date: selectedDate,
          isClosed: true,
          startTime: null,
          endTime: null,
          reason,
        });
        // await prisma.staffException.upsert(...)
      } else if (formMode === "CUSTOM") {
        // افزودن ساعت خاص
        newExceptions.push({
          date: selectedDate,
          isClosed: false,
          startTime,
          endTime,
          reason,
        });
        // await prisma.staffException.upsert(...)
      }

      setExceptions(newExceptions);
      toast.success("برنامه کاری شما بروزرسانی شد.");
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          مدیریت روزهای کاری
        </h1>
        <p className="text-slate-500">
          روزهای تعطیل را مشخص کنید یا ساعات کاری روزهای خاص را تغییر دهید.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* تقویم */}
        <div className="lg:col-span-5">
          <StaffCalendar
            exceptions={exceptions}
            selectedDate={selectedDate}
            onDateSelect={handleDateClick}
          />
        </div>

        {/* پنل تنظیمات */}
        {selectedDate && (
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-4">
            <Card>
              <CardHeader className="border-b bg-slate-50/50">
                <CardTitle className="flex justify-between items-center">
                  <span>
                    تنظیمات برای تاریخ:{" "}
                    {new Intl.DateTimeFormat("fa-IR", {
                      dateStyle: "full",
                    }).format(new Date(selectedDate))}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedDate(null)}
                  >
                    <X size={16} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* نمایش برنامه پیش‌فرض برای این روز */}
                {defaultScheduleForDay && (
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-4">
                    <Clock className="text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500 font-bold uppercase">
                        برنامه هفتگی (پیش‌فرض)
                      </div>
                      <div className="text-sm font-semibold text-slate-700">
                        {defaultScheduleForDay.isClosed ? (
                          <span className="text-red-600">
                            تعطیل (طبق برنامه)
                          </span>
                        ) : (
                          `${defaultScheduleForDay.startTime} تا ${defaultScheduleForDay.endTime}`
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* انتخاب حالت جدید */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-slate-800">
                    وضعیت این روز:
                  </Label>
                  <RadioGroup
                    value={formMode}
                    onValueChange={(v) => setFormMode(v as FormMode)}
                  >
                    <div
                      className={cn(
                        "flex items-start space-x-3 space-x-reverse rounded-lg border p-4 hover:bg-slate-50",
                        formMode === "DEFAULT" &&
                          "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                      )}
                    >
                      <RadioGroupItem
                        value="DEFAULT"
                        id="default"
                        className="mt-1"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="default"
                          className="font-semibold cursor-pointer"
                        >
                          همان برنامه هفتگی
                        </Label>
                        <p className="text-xs text-slate-500">
                          استفاده از ساعات کاری تعیین شده در تنظیمات هفتگی.
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex items-start space-x-3 space-x-reverse rounded-lg border p-4 hover:bg-purple-50",
                        formMode === "CUSTOM" &&
                          "border-purple-500 bg-purple-50 ring-1 ring-purple-500"
                      )}
                    >
                      <RadioGroupItem
                        value="CUSTOM"
                        id="custom"
                        className="mt-1"
                      />
                      <div className="grid gap-1.5 leading-none w-full">
                        <Label
                          htmlFor="custom"
                          className="font-semibold cursor-pointer flex items-center gap-2"
                        >
                          ساعت کاری خاص (تغییر ساعت)
                        </Label>
                        <p className="text-xs text-slate-500">
                          برای این روز ساعات متفاوتی دارم.
                        </p>

                        {/* ظاهر شدن ورودی‌های ساعت اگر انتخاب شود */}
                        {formMode === "CUSTOM" && (
                          <div className="flex items-center gap-2 mt-3 animate-in fade-in">
                            <Input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="w-28"
                            />
                            <span className="text-slate-400">-</span>
                            <Input
                              type="time"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="w-28"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className={cn(
                        "flex items-start space-x-3 space-x-reverse rounded-lg border p-4 hover:bg-red-50",
                        formMode === "CLOSED" &&
                          "border-red-500 bg-red-50 ring-1 ring-red-500"
                      )}
                    >
                      <RadioGroupItem
                        value="CLOSED"
                        id="closed"
                        className="mt-1"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="closed"
                          className="font-semibold cursor-pointer text-red-700"
                        >
                          تعطیل / مرخصی
                        </Label>
                        <p className="text-xs text-slate-500">
                          این روز در دسترس نیستم.
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* توضیحات/دلیل */}
                {formMode !== "DEFAULT" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label>توضیحات (اختیاری)</Label>
                    <Textarea
                      placeholder={
                        formMode === "CLOSED"
                          ? "علت مرخصی..."
                          : "توضیح درباره تغییر ساعت..."
                      }
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                )}

                <Button
                  onClick={handleSave}
                  disabled={isPending}
                  className="w-full"
                  variant={
                    formMode === "CLOSED"
                      ? "destructive"
                      : formMode === "CUSTOM"
                      ? "default"
                      : "outline"
                  }
                >
                  {isPending ? "در حال ذخیره..." : "ثبت نهایی"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffExceptionManager;
