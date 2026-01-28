"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { ArrowRight, CreditCard, Percent, Wallet } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, useState } from "react";
import { toast } from "sonner";
import { getBookingDetails, processPaymentAction } from "./_meta/actions";

type PaymentMethod = "ONLINE" | "OFFLINE";

interface IData {
  bookingId: string;
  method: PaymentMethod;
  gateway?: string; // اگر آنلاین باشد
  discountCode?: string;
}

const PaymentMethodPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "";

  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "OFFLINE">(
    "ONLINE",
  );
  const [gateway, setGateway] = useState("ZARINPAL");
  const [discountCode, setDiscountCode] = useState("");

  // دریافت اطلاعات رزرو برای نمایش مبلغ
  const { data: booking, isLoading } = useQuery({
    queryKey: ["bookingDetail", bookingId],
    queryFn: async () => {
      const response = await getBookingDetails(bookingId);

      return response.booking;
    },
    enabled: !!bookingId,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: IData) => {
      const response = await processPaymentAction(data);

      return response;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data?.error || "خطا در پردازش پرداخت");
        return;
      }

      if (data.isOffline) {
        toast.success("رزرو با موفقیت انجام شد، در انتظار تایید میباشد");
        router.replace(`/offline-reservation/confirmation/${data.bookingId}`);
      } else {
        if (!data.paymentUrl) return;
        toast.success("به درگاه منتقل می‌شوید...");

        window.location.href = data.paymentUrl;
      }
    },
  });

  const handlePay = async () => {
    await mutateAsync({
      bookingId,
      method: paymentMethod,
      gateway: paymentMethod === "ONLINE" ? gateway : undefined,
    });
  };

  if (isLoading)
    return <div className="text-center py-20">در حال بارگذاری...</div>;

  return (
    <div className="container mx-auto px-4 py-8 min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowRight className="w-4 h-4 ml-2" /> بازگشت
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">
            انتخاب روش پرداخت
          </h1>
          <p className="text-slate-500 mt-1">
            لطفاً روش مناسب خود را انتخاب کنید
          </p>
        </div>

        <Card className="shadow-xl border-slate-200 overflow-hidden">
          <CardHeader>
            <CardTitle>اطلاعات پرداخت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* انتخاب روش پرداخت */}
            <div className="space-y-4">
              <Label>روش پرداخت</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as any)}
              >
                <Activity
                  mode={
                    booking?.business.allowOnlinePayment ? "visible" : "hidden"
                  }
                >
                  <Label
                    htmlFor="ONLINE"
                    className="flex items-center space-x-2 space-x-reverse border p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem value="ONLINE" id="ONLINE" />
                    <div className="flex items-center gap-3" id="ONLINE">
                      <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">
                          پرداخت آنلاین
                        </p>
                        <p className="text-xs text-slate-500">
                          درگاه بانکی مطمئن
                        </p>
                      </div>
                    </div>
                  </Label>
                </Activity>

                <Activity
                  mode={
                    booking?.business.allowOfflinePayment ? "visible" : "hidden"
                  }
                >
                  <Label
                    htmlFor="OFFLINE"
                    className="flex items-center space-x-2 space-x-reverse border p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <RadioGroupItem value="OFFLINE" id="OFFLINE" />
                    <div className="flex items-center gap-3 " id="OFFLINE">
                      <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">
                          پرداخت در محل
                        </p>
                        <p className="text-xs text-slate-500">
                          پرداخت نقدی در مرکز
                        </p>
                      </div>
                    </div>
                  </Label>
                </Activity>
              </RadioGroup>
            </div>

            {/* انتخاب درگاه (فقط اگر آنلاین باشد) */}
            {paymentMethod === "ONLINE" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <Label>انتخاب درگاه بانکی</Label>
                <RadioGroup
                  value={gateway}
                  onValueChange={setGateway}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="ZARINPAL"
                    className={clsx(
                      "border font-bold rounded-xl p-3 flex items-center justify-center cursor-pointer hover:border-indigo-500",
                      {
                        "bg-blue-500/20 border-indigo-500":
                          gateway === "ZARINPAL",
                      },
                    )}
                  >
                    <RadioGroupItem
                      value="ZARINPAL"
                      id="ZARINPAL"
                      className="sr-only"
                    />
                    زرین‌پال
                  </Label>
                  <Label
                    htmlFor="IDPAY"
                    className={clsx(
                      "border font-bold rounded-xl p-3 flex items-center justify-center cursor-pointer hover:border-indigo-500",
                      {
                        "bg-blue-500/10 border-indigo-500": gateway === "IDPAY",
                      },
                    )}
                  >
                    <RadioGroupItem
                      value="IDPAY"
                      id="IDPAY"
                      className="sr-only"
                    />
                    آیدی‌پی
                  </Label>
                </RadioGroup>
              </div>
            )}

            <Separator />

            {/* کد تخفیف */}
            <div className="space-y-2">
              <Label htmlFor="discountCode" className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-slate-500" />
                کد تخفیف (اختیاری)
              </Label>
              <div className="flex gap-2">
                <Input
                  id="discountCode"
                  placeholder="کد را وارد کنید..."
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="h-10 text-left dir-ltr"
                />
                {/* دکمه اعمال تخفیف (در اینجا شبیه‌سازی شده است) */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.success("کد اعمال شد (تستی)")}
                  className="h-10 px-4"
                >
                  ثبت
                </Button>
              </div>
              <p className="text-xs text-slate-400">
                برای تست از کد off10 استفاده کنید.
              </p>
            </div>

            <Separator />

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className=""> مبلغ خدمت:</span>
                <span>
                  {new Intl.NumberFormat("fa-IR").format(
                    booking?.totalPrice || 0,
                  )}{" "}
                  تومان
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className=""> مالیات + ارزش‌افزوده: </span>
                <span>
                  {new Intl.NumberFormat("fa-IR").format(
                    ((booking?.totalPrice ?? 1) *
                      (booking?.business.commissionRate ?? 1)) /
                      100,
                  )}{" "}
                  تومان
                </span>
              </div>
              <div className="flex justify-between items-center text-green-600">
                <span className=""> تخفیف: </span>
                <span>{new Intl.NumberFormat("fa-IR").format(0)} تومان</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold"> مبلغ قابل پرداخت:</span>
                <span>
                  {new Intl.NumberFormat("fa-IR").format(
                    ((booking?.totalPrice ?? 1) *
                      (booking?.business.commissionRate ?? 1)) /
                      100 +
                      (booking?.totalPrice ?? 0),
                  )}{" "}
                  تومان
                </span>
              </div>
            </div>

            <Separator />

            <Button
              onClick={handlePay}
              loading={isPending}
              className="w-full h-12 text-lg font-bold shadow-lg shadow-indigo-200"
            >
              پرداخت و تکمیل رزرو
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
