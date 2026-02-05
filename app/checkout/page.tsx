"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  History,
  LayoutDashboard,
  RefreshCcw,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createBookingAction,
  getAvailableStaffAction,
  getServiceDetail,
} from "./_meta/actions";
import { LoginForm, Modal } from "@/components";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";

interface IData {
  businessId: string;
  staffId: string;
  serviceId: string;
  date: string;
  time: string;
  customerNotes: string;
}

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const success = searchParams.get("success") === "true";

  const serviceId = searchParams.get("serviceId") || "";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";
  const businessId = searchParams.get("businessId") || "";

  // استیت‌ها
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [customerNotes, setCustomerNotes] = useState("");

  // فچ کردن اطلاعات سرویس (برای نمایش قیمت و نام)
  const { data: serviceData, isLoading: isServiceLoading } = useQuery({
    queryKey: ["serviceDetail", serviceId],
    queryFn: async () => {
      const res = await getServiceDetail(serviceId);
      if (!res.success) throw new Error(res.error);
      return res.service;
    },
    enabled: !!serviceId,
  });

  // فچ کردن لیست پرسنل‌های آزاد
  const {
    data: availableStaff = [],
    isLoading: isStaffLoading,
    isFetching: isStaffFetching,
    isError: isStaffError,
    refetch: refetchStaff,
  } = useQuery({
    queryKey: ["availableStaff", businessId, serviceId, date, time],
    queryFn: async () => {
      const res = await getAvailableStaffAction({
        businessId,
        serviceId,
        date,
        time,
      });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: !!businessId && !!serviceId && !!date && !!time,
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (data: IData) => {
      const response = await createBookingAction(data);

      if (!response.success) {
        toast.error(response.error);
        return null;
      }

      toast.success(response.message);

      return response.bookingId;
    },
  });

  const handleConfirm = async () => {
    if (!session?.user.id) {
      toast.warning("لطفاً ابتدا وارد حساب کاربری شوید.");
      setOpenModal(true);

      return;
    }

    if (!selectedStaffId) {
      toast.error("لطفاً یک پرسنل را انتخاب کنید.");
      return;
    }

    mutateAsync({
      businessId,
      customerNotes,
      date,
      serviceId,
      time,
      staffId: selectedStaffId,
    }).then((bookingId) => {
      router.push(`/checkout?success=true&bookingId=${bookingId}`);
    });
  };

  useEffect(() => {
    if (success) return;
    // اگر پارامترهای حیاتی وجود ندارند، کاربر را برگردان
    if (!serviceId || !date || !time || !businessId) {
      router.back();
    }
  }, [serviceId, date, time, router, businessId, success]);

  const goToPreviousPage = () => {
    router.back();
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center bg-linear-to-b from-blue-50 to-white">
        <div className="rounded-2xl border border-blue-100 bg-white px-6 py-3 shadow-sm">
          <span className="text-base font-semibold text-blue-700">
            نوبت شما با موفقیت ثبت شد 🎉
          </span>
        </div>

        <DotLottieReact
          className="w-72 h-72"
          src="/lottie/success-booking.lottie"
          autoplay
          speed={1.8}
        />

        <p className="max-w-md text-sm leading-7 text-gray-600">
          اطلاعات نوبت ثبت شد و در زمان مقرر منتظر شما هستیم. در صورت نیاز
          می‌توانید نوبت خود را از پنل کاربری مدیریت کنید.
        </p>

        <Link
          target="_blank"
          href="/dashboard/customer/bookings/active"
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          رفتن به پنل کاربری
          <LayoutDashboard />
        </Link>
      </div>
    );
  }

  if (!serviceId || !date || !time || !businessId) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8 min-h-[60vh]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">تکمیل رزرو</h1>

          <p className="text-slate-500">
            اطلاعات نهایی و پرسنل مورد نظر خود را انتخاب کنید
          </p>

          <Button
            onClick={goToPreviousPage}
            rightIcon={<ArrowRight />}
            variant="ghost"
            className="absolute top-0 right-0 font-semibold"
          >
            بازگشت
          </Button>
        </div>
        <div></div>
        <Card className="shadow-xl border-slate-200 overflow-hidden">
          {/* 1. بخش خلاصه سرویس و زمان */}
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle>اطلاعات انتخابی شما</CardTitle>
            <CardDescription>
              جزئیات خدمت و زمانی که انتخاب کرده‌اید
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1">
                    تاریخ و زمان
                  </p>
                  <p className="font-bold text-slate-900">
                    {Intl.DateTimeFormat("fa-IR").format(new Date(date))}
                  </p>
                  <p className="text-sm text-slate-600">ساعت {time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-50 p-2 rounded-lg text-green-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1">خدمت</p>
                  {isServiceLoading ? (
                    <div className="h-5 w-24 bg-slate-200 animate-pulse rounded" />
                  ) : (
                    <>
                      <p className="font-bold text-slate-900">
                        {serviceData?.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {serviceData?.duration} دقیقه
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* 2. انتخاب پرسنل (بخش جدید) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-bold text-slate-900">
                  انتخاب پرسنل
                </Label>
                <Badge variant="secondary" className="text-xs">
                  {availableStaff.length} نفر آزاد
                </Badge>
              </div>

              {isStaffLoading || isStaffFetching ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton className="h-24 rounded-xl" key={i} />
                  ))}
                </div>
              ) : isStaffError ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm text-center">
                  خطا در دریافت لیست پرسنل. لطفاً صفحه را رفرش کنید.
                  <button
                    onClick={() => refetchStaff()}
                    className="mr-2 underline font-bold inline-flex items-center gap-1 group"
                  >
                    دریافت مجدد
                    <RefreshCcw
                      size={16}
                      className="group-hover:-rotate-180 duration-300"
                    />
                  </button>
                </div>
              ) : availableStaff.length === 0 ? (
                <div className="bg-amber-50 text-amber-700 p-4 rounded-lg text-sm text-center flex flex-col items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  <span>
                    متاسفانه در این زمان هیچ پرسنلی آزاد نیست. لطفاً زمان دیگری
                    را انتخاب کنید.
                  </span>
                  <Button
                    variant={"outline"}
                    leftIcon={<History />}
                    onClick={() => {
                      goToPreviousPage();
                    }}
                    className="font-bold border border-amber-700 hover:border-amber-900 transition-colors mt-2"
                  >
                    بازگشت به انتخاب زمان
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableStaff.map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => setSelectedStaffId(staff.id)}
                      className={cn(
                        "relative p-4 rounded-xl border-2 text-right transition-all group hover:border-indigo-200",
                        selectedStaffId === staff.id
                          ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                          : "border-slate-100 bg-white hover:bg-slate-50",
                      )}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                          <AvatarImage src={staff.avatar || ""} />
                          <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                            {staff.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center">
                          <p
                            className={cn(
                              "text-sm font-bold",
                              selectedStaffId === staff.id
                                ? "text-indigo-900"
                                : "text-slate-800",
                            )}
                          >
                            {staff.name}
                          </p>
                        </div>
                        {selectedStaffId === staff.id && (
                          <div className="absolute top-2 left-2 bg-indigo-600 text-white rounded-full p-0.5 shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* 3. توضیحات */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-900 font-bold">
                توضیحات (اختیاری)
              </Label>
              <Textarea
                id="notes"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="h-24 resize-none"
              />
              <p className="text-xs text-slate-400">
                این متن مستقیماً برای پرسنل انتخاب شده ارسال می‌شود.
              </p>
            </div>

            {/* {!session?.user.id && (
              <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg text-amber-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>برای ثبت نهایی باید وارد حساب کاربری خود شوید.</p>
              </div>
            )} */}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 bg-slate-50/50 border-t pt-6">
            <Button
              onClick={handleConfirm}
              disabled={!selectedStaffId}
              loading={isStaffLoading || isStaffFetching || isPending}
              className="w-full h-12 text-base font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all"
            >
              ثبت نهایی
            </Button>
            <Button
              variant="outline"
              onClick={goToPreviousPage}
              className="text-slate-500"
            >
              بازگشت و تغییر اطلاعات
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Modal
        title="ورود / ثبت‌نام حساب کاربری"
        onOpenChange={setOpenModal}
        open={openModal}
        hideActions
        width="md:max-w-xl"
      >
        <LoginForm
          onLoginSuccess={() => {
            setOpenModal(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default CheckoutPage;
