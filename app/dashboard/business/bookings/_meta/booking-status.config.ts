import { BookingStatus } from "@/constants/enums";
import { CheckCircle2, XCircle, Clock, UserX } from "lucide-react";

export const BOOKING_STATUS_CONFIG = {
  [BookingStatus.PENDING]: {
    label: "در انتظار",
    confirmTitle: "آیا می‌خواهید وضعیت این رزرو را به «در انتظار» تغییر دهید؟",
    icon: Clock,
    className: "text-slate-600",
  },
  [BookingStatus.CONFIRMED]: {
    label: "تأیید شده",
    confirmTitle: "آیا از تأیید این رزرو اطمینان دارید؟",
    icon: CheckCircle2,
    className: "text-green-600",
  },
  [BookingStatus.COMPLETED]: {
    label: "تکمیل شده",
    confirmTitle: "آیا از ثبت این رزرو به‌عنوان تکمیل‌شده اطمینان دارید؟",
    icon: CheckCircle2,
    className: "text-indigo-600",
  },
  [BookingStatus.CANCELED]: {
    label: "لغو شده",
    confirmTitle: "آیا از لغو این رزرو اطمینان دارید؟",
    icon: XCircle,
    className: "text-red-600",
  },
  [BookingStatus.REJECTED]: {
    label: "رد شده",
    confirmTitle: "آیا از رد کردن این رزرو اطمینان دارید؟",
    icon: XCircle,
    className: "text-red-600",
  },
  [BookingStatus.NO_SHOW_CUSTOMER]: {
    label: "عدم حضور مشتری",
    confirmTitle:
      "آیا می‌خواهید این رزرو را به‌عنوان «عدم حضور مشتری» ثبت کنید؟",
    icon: UserX,
    className: "text-orange-600",
  },
  [BookingStatus.NO_SHOW_STAFF]: {
    label: "عدم حضور همکار",
    confirmTitle:
      "آیا می‌خواهید این رزرو را به‌عنوان «عدم حضور همکار» ثبت کنید؟",
    icon: UserX,
    className: "text-orange-600",
  },
};
