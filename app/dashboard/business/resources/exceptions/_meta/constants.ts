import { ExceptionType } from "@/constants/enums";
import { ExceptionTypeOption } from "./types";

export const EXCEPTIONS_TYPE_OPTIONS: ExceptionTypeOption[] = [
  {
    id: ExceptionType.ONE_DAY_CHANGE,
    farsiTitle: "تغییر ساعت یک روز",
    englishTitle: "One day time change",
  },
  {
    id: ExceptionType.MULTI_DAYS_CHANGE,
    farsiTitle: "تغییر ساعت چند روز",
    englishTitle: "Multiple days time change",
  },
  {
    id: ExceptionType.RANGE_DAYS_CHANGE,
    farsiTitle: "تغییر ساعت بازه‌ای روزها",
    englishTitle: "Range days time change",
  },
  {
    id: ExceptionType.ONE_DAY_CLOSE,
    farsiTitle: "تعطیلی یک روز",
    englishTitle: "One day closure",
  },
  {
    id: ExceptionType.MULTI_DAYS_CLOSE,
    farsiTitle: "تعطیلی چند روز",
    englishTitle: "Multiple days closure",
  },
  {
    id: ExceptionType.RANGE_DAYS_CLOSE,
    farsiTitle: "تعطیلی بازه‌ای روزها",
    englishTitle: "Range days closure",
  },
];
