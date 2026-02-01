"use client";
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
import Image from "next/image";
import { getBusinessTypeOptions } from "@/app/business/_meta/utils";

// مپینگ رنگ و متن وضعیت‌ها
const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "در انتظار",
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  CONFIRMED: {
    label: "تأیید شده",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  COMPLETED: {
    label: "انجام شده",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  CANCELED: {
    label: "لغو شده توسط شما",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  REJECTED: {
    label: "رد شده توسط مجموعه",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  NO_SHOW_CUSTOMER: {
    label: "عدم حضور شما",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
  NO_SHOW_STAFF: {
    label: "عدم حضور پرسنل",
    className: "bg-rose-50 text-rose-700 border-rose-200",
  },
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
    slug: string;
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
  business,
  service,
  staff,
}) => {
  const AllbusinessData = getBusinessTypeOptions();

  const userBusiness = AllbusinessData.find(
    (item) => item.id === business?.businessType,
  );

  const BusinessIcon = userBusiness?.icon;
  const statusData = STATUS_STYLES[status] || {
    label: status,
    className: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm transition-all hover:shadow-md overflow-hidden`}
    >
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-start">
        {/* ستون سمت چپ: اطلاعات کسب‌وکار */}
        <div className="flex items-start gap-3 w-full sm:w-1/3">
          <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
            {business.logo ? (
              <Image
                width={100}
                height={100}
                src={business.logo || "/images/placeholder.png"}
                alt={business.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              BusinessIcon && (
                <BusinessIcon className="text-slate-400" size={20} />
              )
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-sm truncate">
              {business.businessName}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 border ${statusData.className}`}
            >
              {statusData.label}
            </span>
          </div>
        </div>

        {/* ستون وسط: جزئیات نوبت */}
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold text-slate-800 text-sm">
            {service.name}
          </h4>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
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
                }).format(startTime)}{" "}
                -{" "}
                {new Intl.DateTimeFormat("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(endTime)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{staff.name}</span>
            </div>
          </div>
        </div>

        {/* ستون سمت راست: عملیات */}
        <div className="flex items-center sm:justify-end w-full sm:w-auto">
          {status === "COMPLETED" ? (
            <Link
              href={`/business/${business.slug}`}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
            >
              <RotateCcw size={14} />
              رزرو مجدد
            </Link>
          ) : status === "PENDING" ? (
            <Link
              href={`/dashboard/customer/bookings/edit/${business.slug}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
            >
              <CheckCircle size={14} />
              ویرایش نوبت
            </Link>
          ) : (
            <div className="flex items-center gap-1 text-xs text-rose-500 font-medium">
              <XCircle size={14} />
              {statusData.label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
