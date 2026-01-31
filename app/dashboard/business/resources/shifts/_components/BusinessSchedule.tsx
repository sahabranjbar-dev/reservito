"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // فرض بر این است که سوئچ دارید، اگر ندارید از Toggle استفاده کنید
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Check,
  X,
  AlertCircle,
  Save,
} from "lucide-react";
import { toJalaali, toGregorian } from "jalaali-js";
import { toast } from "sonner";
import { useTransition } from "react";
// کامپوننت تنظیمات شیفت هفتگی (کد قبلی شما - جدا شده برای تمیزی)
import ShiftSettings from "./ShiftSettings";

// اکشن‌ها را ایمپورت کنید
// import { getBusinessExceptions, upsertBusinessException } from "@/app/actions";

/* ------------------ Constants & Types ------------------ */

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

interface Exception {
  date: string; // YYYY-MM-DD
  isClosed: boolean;
  reason: string | null;
}

/* ------------------ Calendar Component ------------------ */

interface ExceptionCalendarProps {
  exceptions: Exception[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const ExceptionCalendar = ({
  exceptions,
  selectedDate,
  onDateSelect,
}: ExceptionCalendarProps) => {
  const [viewYear, setViewYear] = useState(0);
  const [viewMonth, setViewMonth] = useState(0);

  // منطق تولید روزهای مشابه کد قبلی
  const calendarDays = useMemo(() => {
    const daysInMonth =
      viewMonth <= 6
        ? 31
        : viewMonth <= 11
          ? 30
          : (viewYear % 4 === 3 &&
                (viewYear % 33) % 4 === 1 &&
                (viewYear % 33) % 132 !== 1) ||
              ((viewYear % 33) % 4 === 1 && (viewYear % 33) % 132 !== 1)
            ? 30
            : 29;

    const gDate = toGregorian(viewYear, viewMonth, 1);
    const dateObj = new Date(gDate.gy, gDate.gm - 1, gDate.gd);
    const startDayOfWeek = dateObj.getDay();
    const firstDayOffset = (startDayOfWeek + 1) % 7;

    const days = [];

    for (let i = 0; i < firstDayOffset; i++) {
      days.push({ type: "padding", value: "" });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const gDateItem = toGregorian(viewYear, viewMonth, i);
      const isoDate = `${gDateItem.gy}-${String(gDateItem.gm).padStart(
        2,
        "0",
      )}-${String(gDateItem.gd).padStart(2, "0")}`;

      // بررسی وضعیت تعطیلی
      const exception = exceptions.find((e) => e.date === isoDate);
      const isClosed = exception?.isClosed ?? false;

      const today = new Date();
      const isToday =
        today.getFullYear() === gDateItem.gy &&
        today.getMonth() === gDateItem.gm - 1 &&
        today.getDate() === gDateItem.gd;

      const isSelected = isoDate === selectedDate;

      days.push({
        type: "day",
        value: i,
        isoDate,
        isToday,
        isSelected,
        isClosed,
      });
    }
    return days;
  }, [viewYear, viewMonth, selectedDate, exceptions]);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      const jToday = toJalaali(new Date());
      setViewYear(jToday.jy);
      setViewMonth(jToday.jm);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => changeMonth(-1)}
          className="p-1 hover:bg-slate-100 rounded-full"
        >
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </button>
        <span className="font-bold text-lg text-slate-800 flex items-center gap-2">
          {MONTHS[viewMonth - 1]} {viewYear}
        </span>
        <button
          onClick={() => changeMonth(1)}
          className="p-1 hover:bg-slate-100 rounded-full"
        >
          <ChevronLeft className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="text-xs font-bold text-slate-400 py-2">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          if (day.type === "padding")
            return <div key={index} className="py-2" />;

          return (
            <button
              key={day.isoDate}
              onClick={() => onDateSelect(day.isoDate as string)}
              className={cn(
                "py-2 rounded-lg text-sm font-medium transition-all relative h-10 w-10 mx-auto flex items-center justify-center",
                day.isSelected
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2"
                  : day.isClosed
                    ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                    : "text-slate-700 hover:bg-slate-50",
                day.isToday &&
                  !day.isSelected &&
                  "border border-indigo-200 font-bold",
              )}
            >
              <span className="relative z-10">
                {new Intl.NumberFormat("fa-IR").format(day.value as any)}
              </span>
              {/* نشانگر تعطیلی */}
              {day.isClosed && !day.isSelected && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------ Main Page Component ------------------ */

const BusinessSchedule = ({ businessId }: { businessId: string }) => {
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // استیت‌های مربوط به مودال تغییر وضعیت
  const [formIsClosed, setFormIsClosed] = useState(false);
  const [formReason, setFormReason] = useState("");

  // لود کردن اولیه روزهای تعطیل
  useEffect(() => {
    // اینجا از useQuery می‌توانید استفاده کنید یا مستقیم فراخوانی
    // برای سادگی تابع شبیه‌سازی می‌کنیم
    // const load = async () => { const res = await getBusinessExceptions(businessId); if(res.success) setExceptions(res.data); }
    // load();
  }, [businessId]);

  // هندل کلیک روی تاریخ
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const current = exceptions.find((e) => e.date === date);
    if (current) {
      setFormIsClosed(current.isClosed);
      setFormReason(current.reason || "");
    } else {
      setFormIsClosed(false);
      setFormReason("");
    }
  };

  // ذخیره تغییر وضعیت یک روز خاص
  const handleSaveException = () => {
    if (!selectedDate) return;

    startTransition(async () => {
      // آپدیت UI به صورت Optimistic
      const newExceptions = exceptions.filter((e) => e.date !== selectedDate);
      if (formIsClosed) {
        newExceptions.push({
          date: selectedDate,
          isClosed: true,
          reason: formReason,
        });
      }
      setExceptions(newExceptions);

      // فراخوانی API
      // const res = await upsertBusinessException(businessId, selectedDate, formIsClosed, formReason);
      // if(res.success) toast.success("ذخیره شد");

      toast.success(`وضعیت روز ${selectedDate} ذخیره شد`);
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          مدیریت زمان‌بندی
        </h1>
        <p className="text-slate-500">
          برنامه هفتگی و روزهای استثنا (تعطیلات) را تعیین کنید.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ستون راست: تقویم استثناها */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                روزهای تعطیل / استثنا
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExceptionCalendar
                exceptions={exceptions}
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </CardContent>
          </Card>

          {/* پنل تنظیم تاریخ انتخاب شده */}
          {selectedDate && (
            <Card className="border-indigo-100 bg-indigo-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex justify-between items-center">
                  <span>تاریخ انتخاب شده</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDate(null)}
                  >
                    بستن
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                  <span className="text-sm font-medium text-slate-600">
                    {selectedDate}
                  </span>
                  {exceptions.find((e) => e.date === selectedDate)
                    ?.isClosed && (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                      تعطیل
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="closed-toggle"
                      className="cursor-pointer font-medium"
                    >
                      این روز تعطیل است؟
                    </Label>
                    <Switch
                      id="closed-toggle"
                      checked={formIsClosed}
                      onCheckedChange={setFormIsClosed}
                      className={formIsClosed ? "bg-red-500" : "bg-slate-300"}
                    />
                  </div>

                  {formIsClosed && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <Label className="text-xs text-slate-500">
                        دلیل تعطیلی (اختیاری)
                      </Label>
                      <Textarea
                        placeholder="مثلاً: تعطیلات رسمی، تعمیرات..."
                        value={formReason}
                        onChange={(e) => setFormReason(e.target.value)}
                        className="min-h-[80px] text-sm"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSaveException}
                  disabled={isPending}
                  className="w-full gap-2"
                  variant={formIsClosed ? "destructive" : "default"}
                >
                  {isPending
                    ? "در حال ذخیره..."
                    : formIsClosed
                      ? "ثبت تعطیلی"
                      : "حذف تعطیلی"}
                  <Save size={16} />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ستون چپ: تنظیمات شیفت هفتگی */}
        <div className="lg:col-span-2">
          {/* استفاده از کامپوننتی که قبلاً نوشتیم */}
          <ShiftSettings businessId={businessId} />
        </div>
      </div>
    </div>
  );
};

export default BusinessSchedule;
