// types/booking.ts

// نقشه برداری رنگ‌ها برای وضعیت‌ها
export const statusConfig = {
  AWAITING_PAYMENT: {
    label: "منتظر پرداخت",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "CreditCard",
  },
  AWAITING_CONFIRMATION: {
    label: "در انتظار تایید",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "Clock",
  },
  CONFIRMED: {
    label: "تایید شده",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: "CheckCircle",
  },
  REJECTED: {
    label: "رد شده",
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: "XCircle",
  },
  CANCELED: {
    label: "لغو شده",
    color: "bg-slate-100 text-slate-500 border-slate-200",
    icon: "XCircle",
  },
  COMPLETED: {
    label: "انجام شده",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    icon: "CheckCircle2",
  },
  NO_SHOW_CUSTOMER: {
    label: "عدم حضور شما",
    color: "bg-slate-100 text-slate-500 border-slate-200",
    icon: "UserMinus",
  },
  NO_SHOW_STAFF: {
    label: "عدم حضور پرسنل",
    color: "bg-slate-100 text-slate-500 border-slate-200",
    icon: "UserMinus",
  },
} as const;

export interface BookingCardProps {
  id: string;
  startTime: Date;
  endTime: Date;
  status: keyof typeof statusConfig;
  totalPrice: number;
  finalPrice: number;
  customerNotes?: string | null;

  // Relations
  business: {
    id: string;
    businessName: string;
    businessType: string;
    logo?: string | null;
    address?: string | null;
  };
  service: {
    name: string;
    duration: number; // minutes
  };
  staff: {
    name: string;
    avatar?: string | null;
  };
  discountUsages?: Array<{
    discountAmount: number;
  }>;
}
