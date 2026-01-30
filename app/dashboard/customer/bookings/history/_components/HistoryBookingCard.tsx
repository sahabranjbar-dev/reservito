import React from "react";
import {
  Calendar,
  Clock,
  Scissors,
  User,
  RotateCcw,
  XCircle,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";

// مپینگ رنگ وضعیت‌ها (با تغییرات جزئی برای تاریخچه)
const getStatusStyle = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CANCELED":
    case "REJECTED":
    case "NO_SHOW_CUSTOMER":
    case "NO_SHOW_STAFF":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "انجام شده";
    case "CANCELED":
      return "لغو شده توسط شما";
    case "REJECTED":
      return "رد شده توسط مجموعه";
    case "NO_SHOW_CUSTOMER":
      return "عدم حضور شما";
    case "NO_SHOW_STAFF":
      return "عدم حضور پرسنل";
    default:
      return status;
  }
};

export interface HistoryCardProps {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  finalPrice: number;
  business: {
    businessName: string;
    businessType: string;
    logo?: string | null;
    slug: string; // برای لینک رزرو مجدد
  };
  service: {
    name: string;
    duration: number;
  };
  staff: {
    name: string;
    avatar?: string | null;
  };
}

export const HistoryBookingCard: React.FC<HistoryCardProps> = ({
  startTime,
  endTime,
  status,
  finalPrice,
  business,
  service,
  staff,
}) => {
  const isCompleted = status === "COMPLETED";

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-300 group
      ${isCompleted ? "border-slate-100 shadow-sm hover:shadow-md" : "border-rose-100 bg-rose-50/30 opacity-75"}`}
    >
      <div className="p-4 flex flex-col sm:flex-row gap-4">
        {/* ستون سمت چپ: اطلاعات سالن */}
        <div className="flex items-start gap-3 w-full sm:w-1/3">
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
            {business.logo ? (
              <img
                src={business.logo}
                alt={business.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <Scissors className="text-slate-400" size={20} />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-sm truncate">
              {business.businessName}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${getStatusStyle(status)}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>
        </div>

        {/* ستون وسط: جزئیات نوبت */}
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-slate-800 text-sm">
              {service.name}
            </h4>
            <span className="font-bold text-slate-700 text-sm whitespace-nowrap">
              {finalPrice.toLocaleString()}{" "}
              <span className="text-[10px] font-normal text-slate-400">
                تومان
              </span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                {new Intl.DateTimeFormat("fa-IR", {
                  month: "short",
                  day: "numeric",
                }).format(startTime)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>
                {new Intl.DateTimeFormat("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(startTime)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{staff.name}</span>
            </div>
          </div>
        </div>

        {/* ستون سمت راست: عملیات */}
        <div className="flex items-center sm:justify-end">
          {isCompleted ? (
            <Link
              href={`/business/${business.slug}`} // فرض بر وجود صفحه بیزنس با اسلاگ
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
            >
              <RotateCcw size={14} />
              رزرو مجدد
            </Link>
          ) : (
            <div className="flex items-center gap-1 text-xs text-rose-400 font-medium">
              <XCircle size={14} />
              {status === "CANCELED" ? "قابل بازگشت نیست" : "لغو شده"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
