"use client";

import { Button } from "@/components/ui/button";
import { toPersianDate } from "@/utils/date";
import { useFormContext } from "react-hook-form";

export default function CalendarRulesList() {
  const { watch, setValue } = useFormContext();
  const rules = watch("calendarRules") || [];

  const remove = (idx: number) => {
    const next = [...rules];
    next.splice(idx, 1);
    setValue("calendarRules", next);
  };

  return (
    <div className="space-y-2">
      <div className="font-bold">قوانین تعریف‌شده</div>
      {rules.length === 0 ? (
        <div className="text-muted-foreground">هیچ قانونی تعریف نشده است.</div>
      ) : (
        rules.map((r: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center justify-between border rounded-2xl p-3"
          >
            <div>
              <div className="font-bold">{r.type}</div>
              <div className="text-sm">
                {toPersianDate(new Date(r.startDate))}
                {r.endDate ? ` تا ${toPersianDate(new Date(r.endDate))}` : ""}
              </div>
              {r.startTime && r.endTime && (
                <div className="text-sm">
                  {r.startTime} - {r.endTime}
                </div>
              )}
            </div>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => remove(idx)}
            >
              حذف
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
