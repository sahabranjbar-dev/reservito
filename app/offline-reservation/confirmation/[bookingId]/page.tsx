import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/utils/prisma";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Home,
  MapPin,
  Wallet,
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ bookingId: string }>;
}

const OfflineConfirmationPage = async ({ params }: Props) => {
  const { bookingId } = await params;

  // دریافت اطلاعات کامل رزرو برای نمایش در رسید
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
      deletedAt: null, // مطمئن شویم حذف نشده باشد
    },
    include: {
      service: {
        select: { name: true, duration: true },
      },
      business: {
        select: {
          businessName: true,
          address: true,
          businessType: true,
        },
      },
      staff: {
        select: { name: true },
      },
      customer: {
        select: {
          fullName: true,
        },
      },
    },
  });

  // اگر رزرو پیدا نشد (لینک خراب یا دستکاری شده)
  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-200 shadow-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-red-700">خطا در اطلاعات</CardTitle>
            <CardDescription>
              رزرو مورد نظر یافت نشد یا لغو شده است.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard/customer">
              <Button variant="outline" className="w-full">
                بازگشت به داشبورد
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // تعیین وضعیت و رنگ متن
  const isConfirmed =
    booking.status === "CONFIRMED" || booking.status === "COMPLETED";
  const isPending = booking.status === "PENDING_CONFIRMATION";

  const statusConfig: any = {
    CONFIRMED: {
      label: "تایید شده",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    PENDING_CONFIRMATION: {
      label: "در انتظار تایید",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    COMPLETED: {
      label: "تکمیل شده",
      color: "bg-slate-100 text-slate-700 border-slate-200",
    },
    CANCELLED: {
      label: "لغو شده",
      color: "bg-red-50 text-red-600 border-red-100",
    },
  }[booking.status as keyof typeof statusConfig];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 animate-in fade-in duration-500">
      <Card className="max-w-lg w-full shadow-xl border-slate-200 overflow-hidden">
        {/* هدر موفقیت */}
        <div className="bg-white p-8 text-center border-b border-slate-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
            رزرو شما ثبت شد
          </CardTitle>
          <CardDescription className="text-slate-500">
            کد رزرو شما:{" "}
            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-sm">
              {booking.id}
            </span>
          </CardDescription>
        </div>

        {/* بدنه کارت رسید */}
        <CardContent className="p-6 space-y-6">
          {/* وضعیت رزرو */}
          <div className="flex justify-center">
            <Badge
              className={`text-sm px-4 py-1.5 font-bold border ${statusConfig.color}`}
            >
              {statusConfig.label}
            </Badge>
          </div>

          <Separator />

          {/* اطلاعات رزرو */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">تاریخ و ساعت</p>
                <p className="font-bold text-slate-900 text-lg">
                  {new Intl.DateTimeFormat("fa-IR", {
                    dateStyle: "long",
                  }).format(new Date(booking.startTime))}
                </p>
                <p className="text-slate-600 font-medium">
                  ساعت{" "}
                  {new Intl.DateTimeFormat("fa-IR", {
                    timeStyle: "short",
                  }).format(new Date(booking.startTime))}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">خدمت انتخابی</p>
                <p className="font-bold text-slate-900 text-lg">
                  {booking.service.name}
                </p>
                <p className="text-slate-500 text-sm">
                  {booking.service.duration} دقیقه • با {booking.staff.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">مکان</p>
                <p className="font-bold text-slate-900">
                  {booking.business.businessName}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed mt-1">
                  {booking.business.address}
                </p>
              </div>
            </div>
          </div>

          {/* بخش پرداخت آفلاین */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-start gap-3">
            <div className="bg-white p-2 rounded-full border border-slate-200 shadow-sm">
              <Wallet className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">پرداخت در محل</p>
              <p className="text-xs text-slate-500 mt-1">
                مبلغ{" "}
                <span className="font-mono font-bold text-slate-700 mx-1">
                  {new Intl.NumberFormat("fa-IR").format(booking.totalPrice)}
                </span>{" "}
                تومان را در محل مرکز و در هنگام مراجعه پرداخت کنید.
              </p>
            </div>
          </div>
        </CardContent>

        {/* فوتر و دکمه‌ها */}
        <div className="bg-slate-50 p-6 border-t border-slate-100">
          <Link href="/dashboard/customer" className="block">
            <Button className="w-full h-12 shadow-lg shadow-slate-200 font-bold flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              بازگشت به داشبورد مشتری
            </Button>
          </Link>
          <p className="text-center text-[10px] text-slate-400 mt-4">
            در صورت نیاز به پشتیبانی از طریق داشبورد با ما در تماس باشید.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default OfflineConfirmationPage;
