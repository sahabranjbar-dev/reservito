import { useState, useCallback, memo } from "react";
import { useFormContext } from "react-hook-form";
import clsx from "clsx";
import { BaseField, CheckboxContainer, TimePicker } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Calendar,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { IworkingHours } from "./ServiceForm";
import { toast } from "sonner";

// انواع داده‌ها
interface Weekday {
  farsiTitle: string;
  englishTitle: string;
  shortTitle: string;
}

interface DefaultWeeklyScheduleProps {
  className?: string;
}

export const WEEKDAYS: Weekday[] = [
  { farsiTitle: "شنبه", englishTitle: "saturday", shortTitle: "ش" },
  { farsiTitle: "یکشنبه", englishTitle: "sunday", shortTitle: "ی" },
  { farsiTitle: "دوشنبه", englishTitle: "monday", shortTitle: "د" },
  { farsiTitle: "سه‌شنبه", englishTitle: "tuesday", shortTitle: "س" },
  { farsiTitle: "چهارشنبه", englishTitle: "wednesday", shortTitle: "چ" },
  { farsiTitle: "پنج‌شنبه", englishTitle: "thursday", shortTitle: "پ" },
  { farsiTitle: "جمعه", englishTitle: "friday", shortTitle: "ج" },
];

const TimeSlotCard = memo(
  ({
    index,
    workingHour,
    weekday,
  }: {
    index: number;
    workingHour: IworkingHours;
    weekday: Weekday;
  }) => {
    const { setValue } = useFormContext();

    return (
      <div
        className={clsx(
          "relative p-4 border rounded-xl transition-all duration-200",
          "bg-white hover:shadow-md hover:border-primary/30",
          workingHour.isActive
            ? "border-primary/20 shadow-sm"
            : "border-gray-200 opacity-75"
        )}
      >
        {/* Day Header */}
        <div className="flex items-center justify-between mb-3">
          <BaseField
            component={CheckboxContainer}
            name={`workingHours.${index}.isActive`}
            text={
              <span className="font-semibold text-gray-800">
                {weekday.farsiTitle}
              </span>
            }
            onChange={() => {
              setValue("selectedDate", null);
            }}
          />

          <span
            className={clsx(
              "text-xs font-medium px-2 py-1 rounded-full",
              workingHour.isActive
                ? "bg-primary/10 text-primary"
                : "bg-gray-100 text-gray-500"
            )}
          >
            {weekday.shortTitle}
          </span>
        </div>

        {/* Time Pickers */}
        <div
          className={clsx(
            "grid grid-cols-2 gap-3 p-3 rounded-lg transition-all duration-200",
            workingHour.isActive
              ? "bg-primary/5 border border-primary/10"
              : "bg-gray-100/50 border border-gray-200 cursor-not-allowed"
          )}
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              شروع
            </label>
            <BaseField
              component={TimePicker}
              name={`workingHours.${index}.startTime`}
              disabled={!workingHour.isActive}
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              پایان
            </label>
            <BaseField
              component={TimePicker}
              name={`workingHours.${index}.endTime`}
              disabled={!workingHour.isActive}
              className="w-full"
            />
          </div>
        </div>

        {/* Status Indicator */}
        <div
          className={clsx(
            "absolute top-3 left-3 w-2 h-2 rounded-full",
            workingHour.isActive ? "bg-green-500" : "bg-gray-400"
          )}
        />
      </div>
    );
  }
);

TimeSlotCard.displayName = "TimeSlotCard";

const BulkActions = memo(() => {
  const { watch, setValue, getValues } = useFormContext();
  const workingHours = watch("workingHours");
  const [isApplyingTime, setIsApplyingTime] = useState(false);

  const handleCheckAll = useCallback(() => {
    setValue(
      "workingHours",
      workingHours.map((item: IworkingHours) => ({ ...item, isActive: true }))
    );
  }, [workingHours, setValue]);

  const handleUncheckAll = useCallback(() => {
    setValue(
      "workingHours",
      workingHours.map((item: IworkingHours) => ({ ...item, isActive: false }))
    );
  }, [workingHours, setValue]);

  const handleApplyTimeToAll = useCallback(() => {
    const allStartTime = getValues("allStartTime");
    const allEndTime = getValues("allEndTime");

    if (!allStartTime || !allEndTime) {
      // در حالت واقعی می‌توانید یک toast یا alert نمایش دهید
      toast.warning("لطفا زمان شروع و پایان را وارد کنید");
      return;
    }

    setIsApplyingTime(true);
    setValue(
      "workingHours",
      workingHours.map((item: IworkingHours) => ({
        ...item,
        startTime: allStartTime,
        endTime: allEndTime,
      }))
    );

    // شبیه‌سازی delay برای UX بهتر
    setTimeout(() => setIsApplyingTime(false), 500);
  }, [workingHours, setValue, getValues]);

  return (
    <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-800">
          اعمال تنظیمات به همه روزها
        </h3>
      </div>

      <div className="space-y-4">
        {/* Selection Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCheckAll}
            className="flex items-center gap-2"
          >
            <CheckSquare className="w-4 h-4" />
            فعال کردن همه
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUncheckAll}
            className="flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            غیرفعال کردن همه
          </Button>
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              ساعت شروع همه
            </label>
            <BaseField
              component={TimePicker}
              name="allStartTime"
              placeholder="--:--"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              ساعت پایان همه
            </label>
            <BaseField
              component={TimePicker}
              name="allEndTime"
              placeholder="--:--"
              className="w-full"
            />
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              onClick={handleApplyTimeToAll}
              disabled={isApplyingTime}
              className="w-full"
              variant="default"
            >
              {isApplyingTime ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  در حال اعمال...
                </span>
              ) : (
                <span className="flex items-center gap-2">اعمال برای همه</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

BulkActions.displayName = "BulkActions";

const DefaultWeeklySchedule = ({ className }: DefaultWeeklyScheduleProps) => {
  const { watch } = useFormContext();
  const workingHours = watch("workingHours");

  // محاسبه روزهای فعال
  const activeDaysCount =
    workingHours?.filter((item: IworkingHours) => item.isActive).length || 0;

  return (
    <div
      className={clsx(
        "border border-gray-300 rounded-2xl p-6 bg-white",
        "shadow-sm hover:shadow-md transition-shadow duration-300",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            ساعات کاری هفتگی (پیش‌فرض)
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            تنظیم ساعات کاری پیش‌فرض برای تمامی روزهای هفته
          </p>
        </div>

        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg">
          <span className="font-semibold">{activeDaysCount}</span>
          <span className="text-sm mr-2">روز فعال</span>
        </div>
      </div>

      {/* Bulk Actions Section */}
      <BulkActions />

      {/* Days Grid */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          تنظیمات تک‌تک روزها
        </h3>

        {workingHours && workingHours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {workingHours.map((workingHour: IworkingHours, index: number) => (
              <TimeSlotCard
                key={`day-${index}-${workingHour.weekday}`}
                index={index}
                workingHour={workingHour}
                weekday={WEEKDAYS[workingHour.weekday]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-xl">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">هیچ روز کاری تنظیم نشده است</p>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          ⓘ تغییرات به صورت خودکار ذخیره می‌شوند. برای بازگشت به حالت پیش‌فرض،
          تمامی روزها را غیرفعال کنید.
        </p>
      </div>
    </div>
  );
};

export default memo(DefaultWeeklySchedule);
