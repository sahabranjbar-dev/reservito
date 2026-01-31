"use client";
import {
  businessTypeLabelsFa,
  getBusinessTypeOptions,
} from "@/app/business/_meta/utils";
import { Button } from "@/components/ui/button";
import { getFullDateTime } from "@/utils/common";
import { format } from "date-fns-jalali"; // یا کتابخانه مشابه
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Hourglass,
  ShieldCheck,
  Ticket,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { BookingCardProps, statusConfig } from "../_meta/type";

export const ActiveBookingCard: React.FC<BookingCardProps> = ({
  startTime,
  endTime,
  status,
  totalPrice,
  business,
  service,
  staff,
  discountUsages,
  id,
  customerNotes,
  ...res
}) => {
  const { push } = useRouter();
  const config = statusConfig[status];

  const AllbusinessData = getBusinessTypeOptions();

  const userBusiness = AllbusinessData.find(
    (item) => item.id === business.businessType,
  );

  const BusinessIcon = userBusiness?.icon;

  // محاسبه میزان تخفیف
  const discountAmount =
    discountUsages?.reduce((sum, item) => sum + item.discountAmount, 0) || 0;

  // تعیین متن دکمه اصلی بر اساس وضعیت
  const renderActionButtons = () => {
    if (status === "CONFIRMED") {
      return (
        <button className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
          <Ticket size={20} />
          مشاهده بلیط و جزئیات
        </button>
      );
    }
    if (status === "PENDING") {
      return (
        <div className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-medium flex items-center justify-center gap-2 border border-blue-100">
          <Hourglass size={20} className="animate-pulse" />
          در انتظار تایید ...
        </div>
      );
    }
    if (status === "REJECTED" || status === "CANCELED") {
      return (
        <button className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-medium hover:bg-slate-200 transition-all">
          رزرو مجدد این خدمت
        </button>
      );
    }
    return null;
  };

  const bookingEditHandler = () => {
    if (status !== "PENDING") return;

    push(`/dashboard/customer/bookings/active/${id}`);
  };

  const reciepteHandler = () => {
    push(`/dashboard/customer/bookings/receipt/${id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 group">
      {/* هدر کارت: وضعیت و نام کسب‌وکار */}
      <div className="p-5 border-b border-slate-50 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
            {business?.logo ? (
              <Image
                width={100}
                height={100}
                src={business?.logo || "images/placeholder.png"}
                alt={business.businessName}
                className="w-full h-full object-cover"
              />
            ) : BusinessIcon ? (
              <BusinessIcon className="text-slate-400" />
            ) : null}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">
              {business?.businessName}
            </h3>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <ShieldCheck size={12} />
              {businessTypeLabelsFa[business?.businessType]}
            </div>
          </div>
        </div>

        {/* بج وضعیت */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${config.color}`}
        >
          {status === "CONFIRMED" && <CheckCircle size={12} />}
          {status === "PENDING" && <Clock size={12} />}
          {(status === "REJECTED" || status === "CANCELED") && (
            <XCircle size={12} />
          )}
          <span>{config.label}</span>
        </div>
      </div>

      {/* بدنه کارت: زمان و خدمات */}
      <div className="p-5">
        {/* ستون زمان و مکان */}

        {/* ستون سرویس و قیمت */}
        <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 flex flex-col justify-between w-full">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-800">{service.name}</h4>
              {/* آیکون منو برای عملیات بیشتر (لغو، ویرایش) */}

              <div className="flex flex-col">
                <Button
                  type="button"
                  onClick={bookingEditHandler}
                  variant="ghost"
                  rightIcon={<Edit size={14} className="text-blue-500" />}
                  className="group"
                >
                  ویرایش نوبت
                </Button>

                <Button
                  type="button"
                  onClick={reciepteHandler}
                  variant="ghost"
                  rightIcon={<Eye size={14} className="text-blue-500" />}
                >
                  مشاهده رسید
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    تاریخ و زمان
                  </p>
                  <p className="font-bold text-slate-800 text-base mt-0.5">
                    {getFullDateTime(startTime)}
                  </p>
                  <p className="text-slate-600 text-sm flex items-center gap-2 mt-1">
                    <Clock size={14} className="text-slate-400" />
                    {format(startTime, "HH:mm")} تا {format(endTime, "HH:mm")}
                    <span className="text-slate-300">|</span>
                    <span>{service.duration} دقیقه</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    پرسنل منتخب
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-slate-800">
                      {staff.name}
                    </span>
                    {staff.avatar && (
                      <Image
                        width={100}
                        height={100}
                        src={staff?.avatar || "/images/placeholder.png"}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* یادداشت مشتری اگر وجود دارد */}
            {!!customerNotes && (
              <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 bg-white p-2 rounded border border-slate-100">
                <AlertCircle
                  size={14}
                  className="shrink-0 mt-0.5 text-amber-500"
                />
                یادداشت مشتری:
                <span>{customerNotes}</span>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3">
            {totalPrice && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">قیمت:</span>
                <span
                  className={`font-medium ${discountAmount > 0 ? "line-through text-slate-400" : "text-slate-800"}`}
                >
                  {totalPrice?.toLocaleString()} تومان
                </span>
              </div>
            )}

            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-emerald-600 flex items-center gap-1">
                  <Ticket size={12} />
                  تخفیف:
                </span>
                <span className="font-bold text-emerald-600">
                  {discountAmount.toLocaleString()} تومان
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* فوتر عملیات */}
      <div className="p-5 bg-slate-50/80 border-t border-slate-100">
        <div className="flex gap-3">
          <div className="flex-1">{renderActionButtons()}</div>

          {/* دکمه تماس (اختیاری) */}
          {status !== "PENDING" && (
            <Link
              href={`tel:${staff.phone}`}
              className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shrink-0"
              aria-label="تماس"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                {/* Phone Icon component here */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
