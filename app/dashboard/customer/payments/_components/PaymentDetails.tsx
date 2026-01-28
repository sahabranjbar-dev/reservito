"use client";

import clsx from "clsx";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Download,
  FileText,
  MapPin,
  XCircle,
} from "lucide-react";
import Image from "next/image";

// --- Types بر اساس JSON ارسالی شما ---

type PaymentStatus = "UNPAID" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type PaymentMethod = "ONLINE" | "OFFLINE";

interface User {
  id: string;
  fullName: string | null;
  phone: string;
}

interface Business {
  id: string;
  businessName: string;
  logo: string | null;
  address: string | null;
}

interface Service {
  name: string;
  duration: number;
  price: number;
}

interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  business: Business;
  service: Service;
  staff: { name: string };
}

interface PaymentData {
  id: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  refId: string | null;
  authority: string | null;
  gatewayName: string | null;
  createdAt: string;
  verifiedAt: string | null;
  booking: Booking;
  verifiedBy: User | null;
}

interface Props {
  paymentData: PaymentData | null;
  loading: boolean;
  // کالبک‌های برای دکمه‌های اکشن
  onPay?: () => void;
  onDownloadInvoice?: () => void;
  onClose?: () => void;
}

// --- Helper Components & Functions ---

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fa-IR").format(amount / 10) + " تومان";
};

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));
};

const getStatusInfo = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return {
        label: "پرداخت موفق",
        colorClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
        icon: CheckCircle2,
        headerClass: "from-emerald-500 to-emerald-600",
      };
    case "FAILED":
      return {
        label: "پرداخت ناموفق",
        colorClass: "bg-rose-50 text-rose-700 border-rose-100",
        icon: XCircle,
        headerClass: "from-rose-500 to-rose-600",
      };
    case "PENDING":
      return {
        label: "در انتظار پرداخت",
        colorClass: "bg-amber-50 text-amber-700 border-amber-100",
        icon: Clock,
        headerClass: "from-amber-500 to-amber-600",
      };
    case "REFUNDED":
      return {
        label: "برگشت خورده",
        colorClass: "bg-slate-100 text-slate-600 border-slate-200",
        icon: ArrowLeft,
        headerClass: "from-slate-500 to-slate-700",
      };
    default:
      return {
        label: "نامشخص",
        colorClass: "bg-gray-50 text-gray-700 border-gray-100",
        icon: Clock,
        headerClass: "from-gray-400 to-gray-500",
      };
  }
};

// --- Main Component ---

const PaymentDetails = ({
  paymentData,
  loading,
  onPay,
  onDownloadInvoice,
  onClose,
}: Props) => {
  // حالت لودینگ (Skeleton)
  if (loading) {
    return (
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
        <div className="h-32 bg-slate-100 rounded-lg mb-6" />
        <div className="space-y-4">
          <div className="h-4 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-5/6" />
          <div className="h-4 bg-slate-100 rounded w-4/6" />
        </div>
      </div>
    );
  }

  // اگر دیتا نیست
  if (!paymentData) {
    return (
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center">
        <p className="text-slate-500">اطلاعات یافت نشد.</p>
      </div>
    );
  }

  const statusInfo = getStatusInfo(paymentData.status);
  const StatusIcon = statusInfo.icon;

  return (
    <>
      {/* Header Area (Gradient based on Status) */}
      <div
        className={clsx(
          "relative h-32 bg-linear-to-l p-6 flex flex-col justify-between",
          statusInfo.headerClass,
        )}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
            <FileText className="w-4 h-4" />
            جزئیات پرداخت #{paymentData.id.slice(-6)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
            <StatusIcon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{statusInfo.label}</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Transaction Amount */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-6">
          <span className="text-slate-500 text-sm">مبلغ قابل پرداخت</span>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(paymentData.amount)}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="col-span-2 sm:col-span-1 space-y-1">
            <p className="text-slate-400 text-xs">کد پیگیری (Ref ID)</p>
            <div className="flex items-center gap-2 font-medium text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="dir-ltr text-xs">
                {paymentData.refId || "---"}
              </span>
              {paymentData.refId && (
                <Copy
                  className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-blue-600"
                  onClick={() =>
                    navigator.clipboard.writeText(paymentData.refId!)
                  }
                />
              )}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 space-y-1">
            <p className="text-slate-400 text-xs">درگاه بانکی</p>
            <div className="flex items-center gap-2 font-medium text-slate-700 h-8.5">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>{paymentData.gatewayName || "---"}</span>
            </div>
          </div>

          <div className="col-span-2 space-y-1">
            <p className="text-slate-400 text-xs">تاریخ تراکنش</p>
            <p className="font-medium text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              {formatDate(paymentData.createdAt)}
            </p>
          </div>
        </div>

        {/* Booking Context (Card) */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-400 overflow-hidden">
              {paymentData.booking.business.logo ? (
                <Image
                  width={100}
                  height={100}
                  src={
                    paymentData.booking.business.logo ||
                    "/images/placeholder.png"
                  }
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">
                {paymentData.booking.business.businessName}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-1">
                {paymentData.booking.business.address || "آدرس ثبت نشده"}
              </p>
            </div>
          </div>

          <div className="h-px bg-slate-200/50 w-full"></div>

          <div className="flex justify-between items-center text-sm">
            <div>
              <p className="text-xs text-slate-400">خدمت</p>
              <p className="font-semibold text-slate-800">
                {paymentData.booking.service.name}{" "}
                <span className="font-medium">
                  {paymentData.booking?.staff?.name
                    ? `- ${paymentData.booking?.staff?.name}`
                    : null}
                </span>
              </p>
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-400">زمان رزرو</p>
              <p className="font-medium text-slate-800 text-xs">
                {formatDate(paymentData.booking.startTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Area */}
        <div className="flex flex-col gap-3 pt-2">
          {/* دکمه اصلی بر اساس وضعیت */}
          {paymentData.status === "PENDING" && onPay && (
            <button
              onClick={onPay}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 hover:-translate-y-0.5 active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              پرداخت آنلاین
            </button>
          )}

          {paymentData.status === "PAID" && onDownloadInvoice && (
            <button
              onClick={onDownloadInvoice}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition-all hover:bg-emerald-700 hover:-translate-y-0.5 active:scale-95"
            >
              <Download className="w-4 h-4" />
              دانلود فاکتور
            </button>
          )}

          {paymentData.status === "FAILED" && onPay && (
            <button
              onClick={onPay}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-100 transition-all hover:bg-rose-700 hover:-translate-y-0.5 active:scale-95"
            >
              تلاش مجدد پرداخت
            </button>
          )}

          {/* دکمه ثانویه */}
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            بازگشت
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentDetails;
