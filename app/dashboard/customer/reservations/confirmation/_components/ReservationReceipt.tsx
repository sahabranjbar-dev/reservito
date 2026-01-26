"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Clock,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Phone,
  Scissors,
  AlertCircle,
  XCircle,
  Hourglass,
  ReceiptText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { businessTypeLabelsFa } from "@/app/business/_meta/utils";
import { BusinessType } from "@/constants/enums";

// تایپ‌ها (بر اساس اسکیما شما)
type BookingStatus =
  | "PENDING_CONFIRMATION"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

type Booking = {
  id: string;
  status: BookingStatus;
  totalPrice: number;
  startTime: Date;
  business: {
    businessName: string;
    address: string | null;
    phone: string | null;
    owner: {
      fullName: string;
      phone: string;
    };
    businessType: BusinessType;
  };
  service: {
    name: string;
    duration: number;
  };
  staff: {
    name: string;
  };
  customer: {
    fullName: string | null;
    phone: string | null;
  };
  // اگر دیتای پرداخت را هم فرستاده باشید
  payments?: {
    status: PaymentStatus;
    method: "ONLINE" | "OFFLINE";
    amount: number;
    bookingId: string;
    businessId: string;
  }[];
};

interface Props {
  booking: Booking;
}

const IconWrapper = ({
  children,
  color = "bg-slate-50 text-slate-600",
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <div className={cn("p-3 rounded-xl border border-slate-100", color)}>
    {children}
  </div>
);

const ReservationReceipt = ({ booking }: Props) => {
  const payment = booking.payments?.find(
    (item) => item.bookingId === booking.id
  );
  // --- 1. چاپ ---
  const handlePrint = () => {
    window.print();
  };

  // --- 2. دانلود تقویم ---
  const downloadCalendarEvent = () => {
    const eventStart = new Date(booking.startTime);
    const eventEnd = new Date(
      eventStart.getTime() + booking.service.duration * 60000
    );

    const icsMsg = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pro Reserve//Event//FA
BEGIN:VEVENT
DTSTART:${formatDateForICS(eventStart)}
DTEND:${formatDateForICS(eventEnd)}
SUMMARY:رزرو ${booking.business.businessName} - ${booking.service.name}
DESCRIPTION:شماره رزرو: ${booking.id}
LOCATION:${booking.business.address}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsMsg], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `booking-${booking.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("فایل تقویم دانلود شد");
  };

  const formatDateForICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  };

  // --- 3. کپی لینک ---
  const copyLink = () => {
    // change into public url
    navigator.clipboard.writeText(window.location.href);
    toast.success("لینک رسید کپی شد");
  };

  // ==========================================
  // 4. تنظیمات وضعیت (Config System)
  // ==========================================

  const getStatusConfig = () => {
    const status = booking.status;

    // حالت‌های موفقیت
    if (status === "CONFIRMED" || status === "COMPLETED") {
      return {
        title: status === "CONFIRMED" ? "رزرو تایید شد" : "تکمیل شد",
        description: "از همراهی شما سپاسگزاریم",
        gradient: "bg-gradient-to-br from-emerald-600 to-teal-700",
        icon: CheckCircle2,
        iconColor: "text-emerald-400 print:text-black",
        textClass: "text-emerald-400 print:text-black",
        actionAllowed: true,
      };
    }

    // حالت‌های در انتظار (پرداخت یا تایید ادمین)
    if (status === "PENDING_CONFIRMATION") {
      const paymentStatus = payment?.status;

      if (paymentStatus === "UNPAID" || paymentStatus === "REFUNDED") {
        return {
          title: "در انتظار پرداخت",
          description: "لطفاً برای نهایی‌سازی رزرو، مبلغ را پرداخت کنید",
          gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
          icon: AlertCircle,
          iconColor: "text-amber-300 print:text-black",
          textClass: "text-amber-100 print:text-black",
          actionAllowed: true, // برای رفتن به درگاه
        };
      } else {
        // پرداخت شده ولی تایید نشده (Admin action)
        return {
          title: "در انتظار تایید مرکز",
          description: "رزرو شما ثبت شد و منتظر تایید پرسنل هستیم",
          gradient: "bg-gradient-to-br from-sky-500 to-blue-600",
          icon: Hourglass,
          iconColor: "text-sky-300 print:text-black",
          textClass: "text-sky-100 print:text-black",
          actionAllowed: false,
        };
      }
    }

    // حالت لغو شده
    if (status === "CANCELLED" || status === "NO_SHOW") {
      return {
        title: status === "NO_SHOW" ? "عدم مراجعه" : "رزرو لغو شد",
        description:
          status === "NO_SHOW"
            ? "متاسفانه شما سر وقت معین مراجعه نکردید"
            : "این رزرو توسط شما یا مرکز لغو شده است",
        gradient: "bg-gradient-to-br from-rose-600 to-red-700",
        icon: XCircle,
        iconColor: "text-rose-300 print:text-black",
        textClass: "text-rose-100 print:text-black",
        actionAllowed: false,
      };
    }

    // پیش‌فرض (مثلا اگر وضعیتی جدید اضافه شود)
    return {
      title: "وضعیت نامشخص",
      description: "لطفاً با پشتیبانی تماس بگیرید",
      gradient: "bg-slate-800",
      icon: AlertCircle,
      iconColor: "text-slate-400",
      textClass: "text-slate-300",
      actionAllowed: false,
    };
  };

  const config = getStatusConfig();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-4xl space-y-4">
        {/* دکمه‌های اکشن (فقط اگر عملیات مجاز باشد) */}
        {config.actionAllowed && (
          <div className="flex justify-end gap-2 no-print">
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Share2 className="w-4 h-4 ml-2" />
              اشتراک
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCalendarEvent}>
              <Download className="w-4 h-4 ml-2" />
              تقویم
            </Button>
            <Button size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 ml-2" />
              چاپ
            </Button>
          </div>
        )}

        {/* کارت اصلی رسید */}
        <Card className="border-slate-200 shadow-2xl overflow-hidden print:shadow-none print:border-none">
          {/* هدر داینامیک */}
          <div
            className={cn(
              "p-8 text-white print:bg-white print:text-black print:border-b-2 print:border-black",
              config.gradient
            )}
          >
            <div className="flex justify-between items-start max-w-4xl mx-auto">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm border border-white/30">
                    <config.icon className={cn("w-8 h-8", config.iconColor)} />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {config.title}
                  </h1>
                </div>
                <p className={cn("opacity-90 max-w-md", config.textClass)}>
                  {config.description}
                </p>
                {/* کد رزرو */}
                <div className="mt-6 inline-block">
                  <span className="text-xs font-bold uppercase opacity-70">
                    کد رزرو:
                  </span>
                  <div
                    className={cn(
                      "font-mono text-lg font-bold bg-black/20 px-3 py-1 rounded-lg border border-white/20 mt-1 inline-block print:bg-slate-100 print:border-black print:text-black"
                    )}
                  >
                    {booking.id}
                  </div>
                </div>
              </div>

              {/* برند */}
              <div className="text-right hidden md:block">
                <div className="font-bold text-2xl tracking-tighter opacity-90 print:text-black">
                  PRO<span className="font-light opacity-70">RESERVE</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] opacity-60 print:text-black">
                  Official Ticket
                </div>
              </div>
            </div>
          </div>

          {/* بدنه رسید */}
          <div className="p-8 max-w-4xl mx-auto space-y-8 print:p-0 print:max-w-none">
            {/* دو ستون: مشتری و بیزنس */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* ستون مشتری */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-8 bg-slate-200 rounded-full print:bg-black" />
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    اطلاعات مشتری
                  </h3>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 print:bg-white print:border-none">
                  <p className="font-bold text-xl text-slate-800 print:text-black">
                    {booking.customer.fullName || "مشتری گرامی"}
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-slate-600 print:text-black">
                    <Phone className="w-4 h-4" />
                    <span dir="ltr" className="font-mono text-sm">
                      {booking.customer.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* ستون بیزنس */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-8 bg-slate-200 rounded-full print:bg-black" />
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    مرکز خدمات
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">نام مرکز</p>
                    <p className="font-bold text-lg text-slate-900 print:text-black">
                      {booking.business.businessName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    {businessTypeLabelsFa[booking.business.businessType] ||
                      "خدمات عمومی"}
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>مدیر: {booking.business.owner.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 print:text-black">
                    <Phone className="w-4 h-4" />
                    <span dir="ltr" className="font-mono">
                      {booking.business.owner.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* خط برش (Dashed Line) */}
            <div className="relative py-6 flex items-center gap-4">
              <div className="h-px flex-1 border-t-2 border-dashed border-slate-200 print:border-black print:border-t"></div>
              <div className="w-8 h-8 rounded-full bg-slate-50 -my-2 border border-slate-200 flex items-center justify-center print:bg-white print:border-black">
                <ReceiptText className="w-4 h-4 text-slate-400 print:text-black" />
              </div>
              <div className="h-px flex-1 border-t-2 border-dashed border-slate-200 print:border-black print:border-t"></div>
            </div>

            {/* جزئیات سرویس و زمان */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 print:text-black flex items-center gap-2">
                  <IconWrapper>
                    <CalendarDays className="w-5 h-5" />
                  </IconWrapper>
                  زمان مراجعه
                </h4>
                <div className="bg-white border border-slate-100 p-4 rounded-xl min-h-24 h-32">
                  <p className="text-xl font-bold text-slate-900 print:text-black">
                    {new Intl.DateTimeFormat("fa-IR", {
                      month: "long",
                      day: "numeric",
                    }).format(new Date(booking.startTime))}
                  </p>
                  <p className="text-slate-600 text-lg mt-1 tabular-nums print:text-black">
                    ساعت{" "}
                    {new Intl.DateTimeFormat("fa-IR", {
                      timeStyle: "short",
                    }).format(new Date(booking.startTime))}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 print:text-black flex items-center gap-2">
                  <IconWrapper color="bg-indigo-50 text-indigo-600 print:bg-transparent print:text-black">
                    <Clock className="w-5 h-5" />
                  </IconWrapper>
                  خدمت انتخابی
                </h4>
                <div className="bg-white border border-slate-100 p-4 rounded-xl min-h-24 h-32">
                  <p className="font-bold text-slate-900 print:text-black">
                    {booking.service.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500 print:text-black">
                    <span>مدت زمان: {booking.service.duration} دقیقه</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>با: {booking.staff.name}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 print:text-black flex items-center gap-2">
                  <IconWrapper color="bg-emerald-50 text-emerald-600 print:bg-transparent print:text-black">
                    <MapPin className="w-5 h-5" />
                  </IconWrapper>
                  آدرس
                </h4>
                <div className="bg-white border border-slate-100 p-4 rounded-xl min-h-24 h-32">
                  <p className="text-slate-700 leading-relaxed text-sm md:text-base print:text-black">
                    {booking.business.address}
                  </p>
                </div>
              </div>
            </div>

            {/* بخش مالی */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  روش پرداخت
                </p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs print:border print:border-black bg-slate-100 text-slate-600 print:text-black"
                  >
                    {payment?.method === "OFFLINE"
                      ? "پرداخت در محل"
                      : "پرداخت آنلاین"}
                  </Badge>
                  {payment?.status === "PAID" ? (
                    <span className="text-sm font-bold text-slate-700 print:text-black">
                      پرداخت شد
                    </span>
                  ) : payment?.status === "REFUNDED" ? (
                    <span className="text-sm font-bold text-red-600 print:text-black">
                      بازگردانده شد
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-slate-500 print:text-black">
                      در انتظار پرداخت
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right md:text-left">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                  مبلغ کل
                </p>
                <p className="text-4xl font-extrabold text-slate-900 print:text-black tabular-nums">
                  {new Intl.NumberFormat("fa-IR").format(booking.totalPrice)}
                  <span className="text-sm font-normal text-slate-500 mr-1 print:text-black">
                    تومان
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* فوتر پرینت */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 text-center print:bg-white print:border-none print:text-black">
            <p className="text-xs text-slate-400 print:text-black">
              این رسید به صورت الکترونیکی صادر شده و دارای اعتبار قانونی
              می‌باشد. ممنونیم از اعتماد شما.
            </p>
            <div className="mt-2 flex justify-center gap-4 no-print">
              {config.actionAllowed && (
                <>
                  <button
                    onClick={downloadCalendarEvent}
                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    افزودن به تقویم
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={handlePrint}
                    className="text-xs text-slate-600 hover:underline flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3" />
                    چاپ رسید
                  </button>
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReservationReceipt;
