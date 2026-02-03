"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Clock } from "lucide-react";
import React, { useState } from "react";
import {
  getStaffAvailability,
  upsertStaffScheduleAction,
} from "../_meta/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Combobox, SwitchComponent } from "@/components";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const DAYS = [
  { value: 0, label: "شنبه", short: "ش" },
  { value: 1, label: "یکشنبه", short: "ی" },
  { value: 2, label: "دوشنبه", short: "د" },
  { value: 3, label: "سه‌شنبه", short: "س" },
  { value: 4, label: "چهارشنبه", short: "چ" },
  { value: 5, label: "پنج‌شنبه", short: "پ" },
  { value: 6, label: "جمعه", short: "ج" },
];
interface ScheduleForm {
  dayOfWeek: number;
  isClosed: boolean;
  startTime: string;
  endTime: string;
  label?: string;
}

const AvailabilityForm = () => {
  const [localSchedules, setLocalSchedules] = useState<ScheduleForm[]>([]);

  const [breakMinutes, setBreakMinutes] = useState<number>(0);

  const { data: staffAvailability } = useQuery({
    queryFn: async () => {
      const result = await getStaffAvailability();

      if (!result.success) {
        toast.error(result.message);
        throw new Error(result.message);
      }

      const resolvedAvailability = result.staffAvailability?.map(
        (availability) => ({
          ...availability,
          label: DAYS.find((item) => item.value === availability.dayOfWeek)
            ?.label,
        }),
      );

      setLocalSchedules(resolvedAvailability as ScheduleForm[]);
      return result.staffAvailability;
    },
    queryKey: ["staff-availability"],
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({
      schedule,
      breakMinutes,
    }: {
      schedule: ScheduleForm[];
      breakMinutes?: number;
    }) => {
      const result = await upsertStaffScheduleAction(schedule, breakMinutes);

      if (!result.success) {
        toast.error(result.error);
        throw new Error(result.error);
      }

      toast.success(result.message);
      return result;
    },
  });

  const handleScheduleChange = (
    dayOfWeek: number,
    field: keyof ScheduleForm,
    value: any,
  ) => {
    let finalValue = value;
    if (field === "isClosed") {
      finalValue = !value;
    }

    setLocalSchedules((prev) =>
      prev.map((sch) =>
        sch.dayOfWeek === dayOfWeek ? { ...sch, [field]: finalValue } : sch,
      ),
    );
    // setHasChanges(true);
  };

  const onSaveHandler = async () => {
    await mutateAsync({
      schedule: localSchedules,
      breakMinutes: Number(breakMinutes),
    });
  };
  return (
    <div className="space-y-6">
      {/* روزهای کاری */}

      {DAYS.map((day) => {
        const schedule = localSchedules.find((s) => s.dayOfWeek === day.value);

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

      {/* تنظیمات پیشرفته */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          تنظیمات پیشرفته
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              زمان استراحت بین نوبت‌ها (دقیقه)
            </Label>

            <Combobox
              options={[
                { id: "0", farsiTitle: "بدون استراحت", englishTitle: "0" },
                { id: "5", farsiTitle: "۵ دقیقه", englishTitle: "5" },
                { id: "10", farsiTitle: "۱۰ دقیقه", englishTitle: "10" },
                { id: "15", farsiTitle: "۱۵ دقیقه", englishTitle: "15" },
                { id: "20", farsiTitle: "۲۰ دقیقه", englishTitle: "20" },
              ]}
              value={breakMinutes}
              defaultValue={"0"}
              onChange={(value) => {
                setBreakMinutes(value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <Button
          rightIcon={<Check />}
          loading={isPending}
          type="button"
          onClick={onSaveHandler}
        >
          ذخیره تغییرات
        </Button>
      </div>
    </div>
  );
};

export default AvailabilityForm;
