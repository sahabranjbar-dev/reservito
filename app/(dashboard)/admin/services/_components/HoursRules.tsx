"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PenLine,
} from "lucide-react";
import { getDefaultClassNames } from "react-day-picker";
import { DayPicker, faIR } from "react-day-picker/persian";
import { useFormContext } from "react-hook-form";
import EditModal from "./EditModal";
import { useMemo } from "react";

interface CalendarRule {
  id: number;
  type: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

interface WorkingHour {
  englishTitle: string;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
}

const HoursRules = () => {
  const { setValue, watch } = useFormContext();
  const rules: CalendarRule[] = watch("calendarRules") || [];
  const workingHours: WorkingHour[] = watch("workingHours") || [];
  const selectedDate: Date[] = watch("selectedDate") || [];
  const defaultClassNames = getDefaultClassNames();

  const selectedDatesCount = useMemo(() => selectedDate.length, [selectedDate]);

  const getRuleLabel = (rule: CalendarRule): string => {
    const { type, startDate, endDate, startTime, endTime } = rule;

    switch (type) {
      case "DAY_OFF":
        return "امروز را تعطیل اعلام کردید";
      case "CUSTOM_DAY":
        return `ساعت امروز را به ${startTime} - ${endTime} تغییر دادید`;
      case "RANGE_OFF":
        return `از تاریخ ${formatPersianDate(startDate)} تا ${formatPersianDate(
          endDate
        )} را تعطیل اعلام کردید`;
      case "RANGE_CUSTOM":
        return `ساعت روزهای ${formatPersianDate(
          startDate
        )} تا ${formatPersianDate(
          endDate
        )} را به ${startTime} - ${endTime} تغییر دادید`;
      default:
        return "";
    }
  };

  const formatPersianDate = (dateString?: string): string => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleDateString("fa");
  };

  const formatDateToPersian = (date: Date): string => {
    return Intl.DateTimeFormat("fa").format(date);
  };

  const formatWeekdayToPersian = (date: Date): string => {
    return Intl.DateTimeFormat("fa", { weekday: "long" }).format(date);
  };

  const formatWeekdayToEnglish = (date: Date): string => {
    return Intl.DateTimeFormat("en", { weekday: "long" }).format(date);
  };

  const isDateDisabled = (date: Date): boolean => {
    const weekday = formatWeekdayToEnglish(date);
    const dayConfig = workingHours.find(
      (item) => item?.englishTitle === weekday
    );
    return !dayConfig?.isActive;
  };

  const calendarClassNames = {
    root: cn(
      "w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xs",
      defaultClassNames.root
    ),
    months: cn("relative p-4 flex justify-center", defaultClassNames.months),
    month: cn("flex flex-col w-full gap-2", defaultClassNames.month),
    nav: cn(
      "flex items-center w-full absolute top-4 px-2 justify-between",
      defaultClassNames.nav
    ),
    button_previous: cn(
      buttonVariants({ variant: "ghost", size: "icon" }),
      "size-8 hover:bg-gray-100 dark:hover:bg-gray-800 aria-disabled:opacity-30",
      defaultClassNames.button_previous
    ),
    button_next: cn(
      buttonVariants({ variant: "ghost", size: "icon" }),
      "size-8 hover:bg-gray-100 dark:hover:bg-gray-800 aria-disabled:opacity-30",
      defaultClassNames.button_next
    ),
    month_caption: cn(
      "flex items-center justify-center h-10 w-full text-gray-900 dark:text-gray-100 font-semibold",
      defaultClassNames.month_caption
    ),
    dropdowns: cn(
      "w-full flex items-center text-sm font-medium justify-center h-10 gap-3",
      defaultClassNames.dropdowns
    ),
    dropdown_root: cn(
      "relative has-focus:border-blue-500 border border-gray-300 dark:border-gray-700 shadow-xs has-focus:ring-blue-500/20 has-focus:ring-2 rounded-lg w-24 bg-white dark:bg-gray-900",
      defaultClassNames.dropdown_root
    ),
    dropdown: cn(
      "absolute bg-white dark:bg-gray-900 inset-0 opacity-0",
      defaultClassNames.dropdown
    ),
    caption_label: cn(
      "select-none font-semibold text-gray-900 dark:text-gray-100 flex justify-between p-2 w-full"
    ),
    table: "w-full border-collapse mt-4",
    weekdays: cn("flex", defaultClassNames.weekdays),
    weekday: cn(
      "text-gray-500 dark:text-gray-400 font-medium text-sm select-none text-center flex-1 py-3",
      defaultClassNames.weekday
    ),
    week: cn("flex w-full", defaultClassNames.week),
    week_number_header: cn(
      "select-none w-10",
      defaultClassNames.week_number_header
    ),
    week_number: cn(
      "text-sm select-none text-gray-400 dark:text-gray-500 font-medium",
      defaultClassNames.week_number
    ),
    day: cn(
      "relative w-full h-full p-0 text-center group/day aspect-square select-none",
      defaultClassNames.day
    ),
    range_start: cn(
      "rounded-r-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      defaultClassNames.range_start
    ),
    range_middle: cn(
      "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30",
      defaultClassNames.range_middle
    ),
    range_end: cn(
      "rounded-l-lg bg-gradient-to-l from-blue-500 to-blue-600 text-white",
      defaultClassNames.range_end
    ),
    today: cn("bg-gray-200 rounded-lg", defaultClassNames.today),
    outside: cn(
      "text-gray-300 dark:text-gray-600 aria-selected:text-gray-300 dark:aria-selected:text-gray-600",
      defaultClassNames.outside
    ),
    disabled: cn(
      "text-gray-300 dark:text-gray-700 cursor-not-allowed",
      defaultClassNames.disabled
    ),
    hidden: cn("invisible", defaultClassNames.hidden),
  };

  const calendarComponents = {
    Root({ className, rootRef, ...props }: any) {
      return (
        <div
          data-slot="calendar"
          ref={rootRef}
          className={cn(className)}
          {...props}
        />
      );
    },
    WeekNumber({ children, ...props }: any) {
      return (
        <td {...props}>
          <div className="flex items-center justify-center text-center">
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              {children}
            </span>
          </div>
        </td>
      );
    },
    Chevron({ className, orientation, ...props }: any) {
      const Icon =
        orientation === "right"
          ? ChevronLeftIcon
          : orientation === "left"
          ? ChevronRightIcon
          : ChevronDownIcon;

      return (
        <Icon
          className={cn(
            "size-5 text-gray-600 dark:text-gray-400",
            orientation === "down" && "size-4",
            className
          )}
          {...props}
        />
      );
    },
    DayButton({ modifiers, ...rest }: any) {
      return (
        <Button
          {...rest}
          type="button"
          variant="ghost"
          size="icon"
          data-selected-single={
            modifiers.selected &&
            !modifiers.range_start &&
            !modifiers.range_end &&
            !modifiers.range_middle
          }
          className={cn(
            "h-full w-full flex-col gap-0.5 font-normal hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200",
            "data-[selected-single=true]:bg-linear-to-br data-[selected-single=true]:from-blue-500 data-[selected-single=true]:to-blue-600 data-[selected-single=true]:text-white",
            "data-[range-middle=true]:bg-blue-50 dark:data-[range-middle=true]:bg-blue-900/20",
            "data-[range-start=true]:bg-linear-to-r data-[range-start=true]:from-blue-500 data-[range-start=true]:to-blue-600 data-[range-start=true]:text-white",
            "data-[range-end=true]:bg-linear-to-l data-[range-end=true]:from-blue-500 data-[range-end=true]:to-blue-600 data-[range-end=true]:text-white",
            "data-[disabled=true]:opacity-30 data-[disabled=true]:cursor-not-allowed",
            "border rounded-lg"
          )}
        />
      );
    },
  };

  const getDayConfig = (date: Date) => {
    const weekday = formatWeekdayToEnglish(date);
    return workingHours.find((item) => item?.englishTitle === weekday);
  };

  const renderSelectedDateItem = (date: Date, index: number) => {
    const dayConfig = getDayConfig(date);
    const rule = rules.find((item, i) => i === index);
    const startTime = dayConfig?.startTime || "--";
    const endTime = dayConfig?.endTime || "--";

    return (
      <div
        className="group bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-3 transition-all duration-200"
        key={index}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
              <CalendarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {formatDateToPersian(date)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatWeekdayToPersian(date)}
              </div>
            </div>
          </div>
          <EditModal date={date} index={index} />
        </div>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {rule ? (
            <div>{getRuleLabel(rule)}</div>
          ) : (
            <>
              <span className="font-medium">ساعت کاری:</span>
              <span className="mr-2 font-mono">
                {startTime} - {endTime}
              </span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden w-full transition-all duration-200">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xs">
              <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                استثنا و تغییر ساعت روز
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                روزهای انتخاب شده را می‌توانید ویرایش کنید
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white dark:bg-gray-800">
            {selectedDatesCount} روز انتخاب شده
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-100 dark:border-gray-800">
              <DayPicker
                locale={faIR}
                mode="multiple"
                selected={selectedDate}
                className="w-full"
                onSelect={(selected) => setValue("selectedDate", selected)}
                disabled={isDateDisabled}
                captionLayout="dropdown"
                dir="rtl"
                classNames={calendarClassNames}
                components={calendarComponents}
              />
            </div>
          </div>

          {/* Selected Dates Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xs h-full">
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <PenLine className="w-4 h-4" />
                  روزهای انتخاب شده
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  برای ویرایش ساعت کاری هر روز کلیک کنید
                </p>
              </div>

              <div className="p-4 max-h-100 overflow-y-auto">
                {selectedDate.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDate.map((date, index) =>
                      renderSelectedDateItem(date, index)
                    )}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
      <CalendarIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
    </div>
    <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
      روزی انتخاب نشده است
    </h5>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      روزهایی را که می‌خواهید ویرایش کنید از تقویم انتخاب کنید
    </p>
  </div>
);

export default HoursRules;
