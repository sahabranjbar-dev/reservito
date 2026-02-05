"use client";
import { getBusinessTypeOptions } from "@/app/business/detail/_meta/utils";
import { StatusBadge } from "@/components";
import { BookingStatus } from "@/constants/enums";
import { formatDate } from "@/utils/common";
import {
  Calendar,
  CheckCircle,
  ChevronLeft,
  Clock,
  RotateCcw,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface HistoryCardProps {
  id: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  business: {
    businessName: string;
    businessType: string;
    logo?: string | null;
    slug: string;
    id: string;
  };
  service: {
    name: string;
    duration: number;
    id: string;
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
  id,
}) => {
  const AllbusinessData = getBusinessTypeOptions();

  const userBusiness = AllbusinessData.find(
    (item) => item.id === business?.businessType,
  );

  const BusinessIcon = userBusiness?.icon;

  const getRebookingUrl = () => {
    const params = new URLSearchParams();
    //  href={`=${business?.id}&serviceId=${service?.id}&date=${formatDate(startTime.toISOString())}&time=${startTime})}`}
    params.append("businessId", business?.id);
    params.append("serviceId", service?.id);
    params.append("date", formatDate(startTime));
    params.append(
      "time",
      `${String(startTime.getHours()).padStart(2, "0")}:${String(startTime.getMinutes()).padStart(2, "0")}`,
    );

    return `/checkout?${params}`;
  };

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm transition-all hover:shadow-md overflow-hidden`}
    >
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-center">
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
            <StatusBadge status={status} />
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
                }).format(new Date(startTime))}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>
                {new Intl.DateTimeFormat("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(startTime))}{" "}
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

        <div className="flex items-center w-full sm:w-auto justify-end">
          {status === BookingStatus.CANCELED ||
          status === BookingStatus.REJECTED ? (
            <Link
              target="_blank"
              href={getRebookingUrl()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
            >
              <RotateCcw size={14} />
              رزرو مجدد
            </Link>
          ) : status === BookingStatus.PENDING ? (
            <Link
              href={`/dashboard/customer/bookings/active/${id}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
            >
              <CheckCircle size={14} />
              ویرایش نوبت
            </Link>
          ) : status === BookingStatus.NO_SHOW_CUSTOMER ||
            status === BookingStatus.NO_SHOW_STAFF ? (
            <div>
              <Link
                target="_blank"
                href={`/business/${business?.id}/${business.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
              >
                ثبت نوبت دیگر
                <ChevronLeft size={20} />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
