"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Clock, Loader2, Save } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  getStaffAction,
  getStaffScheduleAction,
  upsertScheduleAction,
} from "../_meta/actions";
import { SwitchComponent } from "@/components";
import { useQuery } from "@tanstack/react-query";

/* ------------------ Constants ------------------ */

const DAYS = [
  { value: 0, label: "شنبه", short: "ش" },
  { value: 1, label: "یکشنبه", short: "ی" },
  { value: 2, label: "دوشنبه", short: "د" },
  { value: 3, label: "سه‌شنبه", short: "س" },
  { value: 4, label: "چهارشنبه", short: "چ" },
  { value: 5, label: "پنج‌شنبه", short: "پ" },
  { value: 6, label: "جمعه", short: "ج" },
];

interface Staff {
  id: string;
  name: string;
}

interface ScheduleForm {
  dayOfWeek: number;
  isClosed: boolean;
  startTime: string;
  endTime: string;
}

/* ------------------ Component ------------------ */

const ShiftSettings = ({ businessId }: { businessId: string }) => {
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [localSchedules, setLocalSchedules] = useState<ScheduleForm[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPending, startTransition] = useTransition();

  /* ----------- Staff List ----------- */

  const { data: staffList = [], isLoading: isStaffLoading } = useQuery({
    queryKey: ["staffList", businessId],
    queryFn: async () => {
      const res = await getStaffAction(businessId);
      if (!res.success) {
        toast.error(res.error || "خطا در دریافت لیست پرسنل");
        return [];
      }
      return res.data ?? [];
    },
  });

  /* ----------- Staff Schedules ----------- */

  const { data: schedulesData, isLoading: isSchedulesLoading } = useQuery({
    queryKey: ["staffSchedules", selectedStaffId],
    enabled: !!selectedStaffId,
    queryFn: async () => {
      const res = await getStaffScheduleAction(selectedStaffId);

      if (!res.success) {
        toast.error(res.error || "خطا در دریافت شیفت‌ها");
        return [];
      }

      return DAYS.map((day) => {
        const existing = res.data?.find((s: any) => s.dayOfWeek === day.value);

        return {
          dayOfWeek: day.value,
          isClosed: existing?.isClosed ?? true,
          startTime: existing?.startTime ?? "09:00",
          endTime: existing?.endTime ?? "17:00",
        };
      });
    },
  });

  /* ----------- Sync Query → Local State (FIXED) ----------- */

  useEffect(() => {
    // باگ اصلاح شده:
    // فقط زمانی داده‌های سرور را روی استیت لوکال اعمال کن که کاربر تغییری اعمال نکرده باشد.
    // این جلوی پاک شدن تغییرات کاربر هنگام ریلود شدن کوئری را می‌گیرد.
    if (schedulesData && !hasChanges) {
      startTransition(() => {
        setLocalSchedules(schedulesData);
      });
    }
  }, [schedulesData]); // startTransition را از آرایه وابستگی حذف کردیم چون ثابت است

  /* ----------- Handlers ----------- */

  const handleScheduleChange = (
    dayOfWeek: number,
    field: keyof ScheduleForm,
    value: any,
  ) => {
    // باگ اصلاح شده (Switch Logic):
    // اگر فیلد isClosed است و اسویچ تغییر کرده، مقدار را برعکس می‌کنیم چون Switch
    // نشان‌دهنده "بودن" است ولی فیلد دیتابیس نشان‌دهنده "نبودن" است.
    let finalValue = value;
    if (field === "isClosed") {
      // value در اینجا وضعیت جدید اسویچ است (true = روشن/باز)
      // ما باید isClosed را برعکس آن تنظیم کنیم (باز = isClosed = false)
      finalValue = !value;
    }

    setLocalSchedules((prev) =>
      prev.map((sch) =>
        sch.dayOfWeek === dayOfWeek ? { ...sch, [field]: finalValue } : sch,
      ),
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!selectedStaffId) return;

    startTransition(async () => {
      const res = await upsertScheduleAction(selectedStaffId, localSchedules);

      if (res.success) {
        toast.success(res.message || "ذخیره شد");
        setHasChanges(false); // پس از ذخیره، وضعیت تغییرات را ریست می‌کنیم تا افکت دوباره همگام شود
      } else {
        toast.error(res.error || "خطا در ذخیره");
      }
    });
  };

  /* ------------------ Render ------------------ */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">مدیریت شیفت‌ها</h2>
          <p className="text-sm text-slate-500">
            زمان‌بندی کاری پرسنل را مشخص کنید
          </p>
        </div>
      </div>

      {/* Staff Select */}
      <Card>
        <CardHeader>
          <CardTitle>انتخاب پرسنل</CardTitle>
        </CardHeader>
        <CardContent>
          {isStaffLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <Select
              value={selectedStaffId}
              onValueChange={setSelectedStaffId}
              disabled={!staffList.length}
            >
              <SelectTrigger>
                <SelectValue placeholder="پرسنل را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map((staff: Staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Schedules */}
      {selectedStaffId && !isSchedulesLoading && (
        <div className="grid gap-4">
          {DAYS.map((day) => {
            const schedule = localSchedules.find(
              (s) => s.dayOfWeek === day.value,
            );

            if (!schedule) return null;

            const isToday = day.value === (new Date().getDay() + 1) % 7;

            return (
              <div
                key={day.value}
                className={cn(
                  "border rounded-xl p-4",
                  isToday
                    ? "border-indigo-300 ring-1 ring-indigo-100"
                    : "border-slate-200",
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Day */}
                  <div className="flex items-center gap-3 min-w-35">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center font-bold",
                        isToday
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {day.short}
                    </div>
                    <div>
                      <div className="font-bold">{day.label}</div>
                      {isToday && (
                        <Badge variant="secondary" className="mt-1">
                          امروز
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-6">
                    <SwitchComponent
                      name={`closed-${day.value}`}
                      checked={!schedule.isClosed}
                      text={schedule.isClosed ? "تعطیل" : "باز"}
                      onChange={(checked) => {
                        handleScheduleChange(day.value, "isClosed", checked);
                      }}
                    />

                    {!schedule.isClosed && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <Input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              day.value,
                              "startTime",
                              e.target.value,
                            )
                          }
                          className="w-28"
                        />
                        <span>تا</span>
                        <Input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              day.value,
                              "endTime",
                              e.target.value,
                            )
                          }
                          className="w-28"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="w-full flex justify-end p-3">
        <Button
          onClick={handleSave}
          disabled={!hasChanges || isPending || !selectedStaffId}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          ذخیره تغییرات
        </Button>
      </div>
    </div>
  );
};

export default ShiftSettings;
