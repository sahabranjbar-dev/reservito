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
  User,
  Building2,
  Calendar,
  Wallet,
  ExternalLink,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { businessTypeLabelsFa } from "@/app/business/_meta/utils";
import { BookingStatus, BusinessType } from "@/constants/enums";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

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

const BookingReceipt = ({ booking }: Props) => {
  const { back } = useRouter();
  // فرمت تاریخ برای تقویم
  const formatDateForICS = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  };

  // --- 1. چاپ ---
  const handlePrint = () => {
    window.print();
  };

  // --- 2. دانلود تقویم ---
  const downloadCalendarEvent = () => {
    try {
      const eventStart = new Date(booking.startTime);
      const eventEnd = new Date(
        eventStart.getTime() + booking.service.duration * 60000,
      );

      const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pro Reserve//Event//FA
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${booking.id}@proreserve.ir
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${formatDateForICS(eventStart)}
DTEND:${formatDateForICS(eventEnd)}
SUMMARY:رزرو ${booking.business.businessName} - ${booking.service.name}
DESCRIPTION:شماره رزرو: ${booking.id}\\nخدمت: ${booking.service.name}\\nمدت: ${booking.service.duration} دقیقه\\nآدرس: ${booking.business.address || "آدرس مشخص نشده"}
LOCATION:${booking.business.address || ""}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

      const blob = new Blob([icsContent], {
        type: "text/calendar;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `booking-${booking.id}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("فایل تقویم با موفقیت دانلود شد");
    } catch (error) {
      toast.error("خطا در دانلود تقویم");
      console.error("Error downloading calendar:", error);
    }
  };

  // --- 3. کپی لینک ---
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("لینک رسید در کلیپ‌بورد کپی شد");
  };

  // --- 4. دریافت کد QR ---
  const generateQRCode = () => {
    const qrData = {
      bookingId: booking.id,
      business: booking.business.businessName,
      service: booking.service.name,
      time: booking.startTime.toISOString(),
      customer: booking.customer.fullName,
    };

    // در حالت واقعی اینجا QR code generator استفاده کنید
    // console.log("QR Code Data:", qrData);
    toast.info("QR Code برای نمایش در پنل کسب‌وکار آماده است");
  };

  // --- 5. تنظیمات وضعیت با useMemo برای بهینه‌سازی ---
  const statusConfig = useMemo(() => {
    const status = booking.status;

    // حالت‌های موفقیت
    if (status === BookingStatus.CONFIRMED) {
      return {
        title: "رزرو تأیید شد",
        description:
          "رزرو شما توسط کسب‌وکار تأیید شد. لطفاً سر وقت مراجعه کنید.",
        gradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
        icon: CheckCircle2,
        iconColor: "text-emerald-300",
        textClass: "text-emerald-50",
        actionAllowed: true,
        statusColor: "success",
      };
    }

    if (status === BookingStatus.COMPLETED) {
      return {
        title: "تکمیل شده",
        description: "خدمت با موفقیت ارائه شد. از همراهی شما سپاسگزاریم.",
        gradient: "bg-gradient-to-br from-slate-600 to-gray-700",
        icon: CheckCircle2,
        iconColor: "text-slate-300",
        textClass: "text-slate-50",
        actionAllowed: false,
        statusColor: "neutral",
      };
    }

    if (status === BookingStatus.PENDING) {
      return {
        title: "در انتظار تأیید",
        description: "پرداخت موفق. منتظر تأیید نهایی کسب‌وکار باشید.",
        gradient: "bg-gradient-to-br from-blue-500 to-cyan-600",
        icon: Hourglass,
        iconColor: "text-blue-300",
        textClass: "text-blue-50",
        actionAllowed: false,
        statusColor: "info",
      };
    }

    // حالت‌های لغو و عدم حضور
    if (status === BookingStatus.CANCELED) {
      return {
        title: "لغو شده",
        description: "این رزرو توسط شما یا کسب‌وکار لغو شده است.",
        gradient: "bg-gradient-to-br from-rose-500 to-pink-600",
        icon: XCircle,
        iconColor: "text-rose-300",
        textClass: "text-rose-50",
        actionAllowed: false,
        statusColor: "error",
      };
    }

    if (status === BookingStatus.NO_SHOW_CUSTOMER) {
      return {
        title: "عدم مراجعه مشتری",
        description: "متأسفانه شما در زمان مقرر مراجعه نکردید.",
        gradient: "bg-gradient-to-br from-red-500 to-rose-600",
        icon: User,
        iconColor: "text-red-300",
        textClass: "text-red-50",
        actionAllowed: false,
        statusColor: "error",
      };
    }

    if (status === BookingStatus.NO_SHOW_STAFF) {
      return {
        title: "عدم حضور کارمند",
        description: "متأسفانه کارمند در زمان مقرر حاضر نشد.",
        gradient: "bg-gradient-to-br from-red-500 to-rose-600",
        icon: User,
        iconColor: "text-red-300",
        textClass: "text-red-50",
        actionAllowed: false,
        statusColor: "error",
      };
    }

    if (status === BookingStatus.REJECTED) {
      return {
        title: "رد شده",
        description: "این رزرو توسط کسب‌وکار رد شده است.",
        gradient: "bg-gradient-to-br from-red-600 to-rose-700",
        icon: XCircle,
        iconColor: "text-red-300",
        textClass: "text-red-50",
        actionAllowed: false,
        statusColor: "error",
      };
    }

    // پیش‌فرض
    return {
      title: "در حال بررسی",
      description: "وضعیت رزرو در حال بررسی است.",
      gradient: "bg-gradient-to-br from-slate-500 to-gray-600",
      icon: AlertCircle,
      iconColor: "text-slate-300",
      textClass: "text-slate-50",
      actionAllowed: false,
      statusColor: "neutral",
    };
  }, [booking.status]);

  // --- فرمت تاریخ فارسی ---
  const formatPersianDate = (date: Date) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(date);
  };

  const formatPersianTime = (date: Date) => {
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // --- محاسبه زمان پایان ---
  const endTime = useMemo(() => {
    const start = new Date(booking.startTime);
    const end = new Date(start.getTime() + booking.service.duration * 60000);
    return formatPersianTime(end);
  }, [booking.startTime, booking.service.duration]);

  // --- اشتراک‌گذاری ---
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `رزرو ${booking.business.businessName}`,
        text: `رزرو ${booking.service.name} در ${booking.business.businessName}`,
        url: window.location.href,
      });
    } else {
      copyLink();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 print:p-0">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        {/* هدر و دکمه‌های اکشن */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">رسید رزرو</h1>
            <p className="text-slate-600">
              مشاهده و مدیریت رزرو شماره {booking.id}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                back();
              }}
            >
              بازگشت
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 ml-2" />
              اشتراک
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCalendarEvent}>
              <Download className="w-4 h-4 ml-2" />
              تقویم
            </Button>
            <Button size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 ml-2" />
              چاپ رسید
            </Button>
            <Button variant="outline" size="sm" onClick={generateQRCode}>
              <QrCode className="w-4 h-4 ml-2" />
              QR Code
            </Button>
          </div>
        </div>

        {/* کارت اصلی رسید */}
        <Card className="border-slate-200 shadow-2xl overflow-hidden print:shadow-none print:border-none">
          {/* هدر داینامیک */}
          <div
            className={cn(
              "p-8 text-white print:bg-white",
              statusConfig.gradient,
            )}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30">
                    <statusConfig.icon
                      className={cn("w-8 h-8", statusConfig.iconColor)}
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      {statusConfig.title}
                    </h1>
                    <p
                      className={cn(
                        "mt-2 opacity-90 max-w-xl",
                        statusConfig.textClass,
                      )}
                    >
                      {statusConfig.description}
                    </p>
                  </div>
                </div>

                {/* کد رزرو */}
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 border-white/30 text-white"
                  >
                    کد رزرو
                  </Badge>
                  <code className="font-mono text-lg font-bold bg-black/20 px-4 py-2 rounded-lg border border-white/30">
                    {booking.id}
                  </code>
                </div>
              </div>

              {/* برند و اطلاعات */}
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 opacity-70" />
                  <span className="text-sm opacity-80">رسید رسمی</span>
                </div>
                <div className="mt-2">
                  <div className="font-bold text-xl tracking-tight opacity-90">
                    PRO<span className="font-light opacity-70">RESERVE</span>
                  </div>
                  <div className="text-xs uppercase tracking-widest opacity-60 mt-1">
                    Electronic Receipt
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* بدنه رسید */}
          <CardContent className="p-8 print:p-6">
            <div className="space-y-8">
              {/* بخش اول: اطلاعات مشتری و کسب‌وکار */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* اطلاعات مشتری */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-6 bg-slate-300 rounded-full" />
                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                      اطلاعات مشتری
                    </h3>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <User className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-slate-900">
                          {booking.customer.fullName || "مشتری گرامی"}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span dir="ltr" className="font-mono text-sm">
                            {booking.customer.phone || "شماره ثبت نشده"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* اطلاعات کسب‌وکار */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-6 bg-slate-300 rounded-full" />
                    <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                      مرکز خدمات
                    </h3>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <Building2 className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-slate-900">
                          {booking.business.businessName}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-600">
                          <Badge variant="outline" className="text-xs">
                            {businessTypeLabelsFa[
                              booking.business.businessType
                            ] || "خدمات"}
                          </Badge>
                          <span>مدیر: {booking.business.owner.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span dir="ltr" className="font-mono text-sm">
                            {booking.business.owner.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* جداکننده تزئینی */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-slate-400">
                    <ReceiptText className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* بخش دوم: جزئیات سرویس */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* زمان مراجعه */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <IconWrapper color="bg-blue-50 text-blue-600">
                      <CalendarDays className="w-5 h-5" />
                    </IconWrapper>
                    <h4 className="font-bold text-slate-800">زمان مراجعه</h4>
                  </div>
                  <div className="bg-white border border-slate-100 p-5 rounded-xl">
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-slate-900">
                        {formatPersianDate(new Date(booking.startTime))}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="space-y-1">
                          <p className="text-sm text-slate-500">ساعت شروع</p>
                          <p className="text-lg font-semibold text-slate-900 tabular-nums">
                            {formatPersianTime(new Date(booking.startTime))}
                          </p>
                        </div>
                        <div className="h-8 w-px bg-slate-200" />
                        <div className="space-y-1">
                          <p className="text-sm text-slate-500">ساعت پایان</p>
                          <p className="text-lg font-semibold text-slate-900 tabular-nums">
                            {endTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* خدمت انتخابی */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <IconWrapper color="bg-emerald-50 text-emerald-600">
                      <Scissors className="w-5 h-5" />
                    </IconWrapper>
                    <h4 className="font-bold text-slate-800">خدمت انتخابی</h4>
                  </div>
                  <div className="bg-white border border-slate-100 p-5 rounded-xl">
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-slate-900">
                        {booking.service.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          مدت زمان: {booking.service.duration} دقیقه
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          مسئول: {booking.staff.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* آدرس و اطلاعات */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <IconWrapper color="bg-amber-50 text-amber-600">
                      <MapPin className="w-5 h-5" />
                    </IconWrapper>
                    <h4 className="font-bold text-slate-800">آدرس مرکز</h4>
                  </div>
                  <div className="bg-white border border-slate-100 p-5 rounded-xl">
                    <div className="space-y-2">
                      {booking.business.address ? (
                        <p className="text-slate-700 leading-relaxed">
                          {booking.business.address}
                        </p>
                      ) : (
                        <p className="text-slate-500">آدرس ثبت نشده است</p>
                      )}
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          مشاهده روی نقشه
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* نکات مهم */}
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h5 className="font-bold text-amber-800">نکات مهم</h5>
                    <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                      <li>لطفاً ۱۰ دقیقه قبل از زمان مقرر در محل حاضر شوید.</li>
                      <li>این رسید به منزله تأیید رزرو می‌باشد.</li>
                      <li>
                        در صورت نیاز به لغو، حداقل ۲ ساعت قبل اقدام فرمایید.
                      </li>
                      <li>
                        جهت هرگونه سؤال با شماره {booking.business.owner.phone}{" "}
                        تماس بگیرید.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* فوتر */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 text-center">
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-slate-600 mb-4">
                این رسید به صورت الکترونیکی صادر شده و دارای اعتبار قانونی
                می‌باشد. برای مشاهده جزئیات بیشتر به پنل کاربری خود مراجعه کنید.
              </p>
              <div className="flex justify-center gap-4 print:hidden">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 ml-2" />
                  اشتراک
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadCalendarEvent}
                >
                  <Download className="w-4 h-4 ml-2" />
                  افزودن به تقویم
                </Button>
                <Button size="sm" onClick={handlePrint}>
                  <Printer className="w-4 h-4 ml-2" />
                  چاپ رسید
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BookingReceipt;
