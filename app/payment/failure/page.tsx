"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  XCircle,
  AlertTriangle,
  RotateCcw,
  Home,
  CreditCard,
  ShieldAlert,
  Clock,
  Phone,
  Mail,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { faIR } from "date-fns/locale";

interface PaymentError {
  code: string;
  message: string;
  suggestedAction: string;
  retryable: boolean;
}

const PAYMENT_ERRORS: Record<string, PaymentError> = {
  INSUFFICIENT_FUNDS: {
    code: "INSUFFICIENT_FUNDS",
    message: "موجودی حساب شما کافی نیست",
    suggestedAction:
      "لطفاً از حساب دیگری استفاده کنید یا موجودی حساب خود را افزایش دهید",
    retryable: true,
  },
  CARD_DECLINED: {
    code: "CARD_DECLINED",
    message: "کارت بانکی شما توسط بانک مسدود شده است",
    suggestedAction: "با بانک صادرکننده کارت تماس بگیرید",
    retryable: false,
  },
  TIMEOUT: {
    code: "TIMEOUT",
    message: "زمان اتصال به درگاه پرداخت به پایان رسید",
    suggestedAction: "لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید",
    retryable: true,
  },
  INVALID_CARD: {
    code: "INVALID_CARD",
    message: "اطلاعات کارت بانکی نامعتبر است",
    suggestedAction: "لطفاً اطلاعات کارت را با دقت وارد کنید",
    retryable: true,
  },
  TRANSACTION_LIMIT: {
    code: "TRANSACTION_LIMIT",
    message: "مبلغ تراکنش بیش از حد مجاز است",
    suggestedAction: "لطفاً مبلغ کمتری را انتخاب کنید یا با بانک تماس بگیرید",
    retryable: true,
  },
  SECURITY_VIOLATION: {
    code: "SECURITY_VIOLATION",
    message: "تراکنش به دلیل مسائل امنیتی رد شد",
    suggestedAction: "لطفاً از کارت بانکی اصلی خود استفاده کنید",
    retryable: false,
  },
};

const PaymentFailure = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [errorDetails, setErrorDetails] = useState<PaymentError | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [autoRedirectTimer, setAutoRedirectTimer] = useState(15);
  const [selectedTab, setSelectedTab] = useState("details");

  const paymentId = searchParams.get("paymentId");
  const errorCode = searchParams.get("error") || "UNKNOWN_ERROR";

  useEffect(() => {
    // تشخیص نوع خطا
    const error = PAYMENT_ERRORS[errorCode] || {
      code: "UNKNOWN_ERROR",
      message: "خطای ناشناخته در پرداخت رخ داده است",
      suggestedAction: "لطفاً با پشتیبانی تماس بگیرید",
      retryable: true,
    };

    setErrorDetails(error);

    // تایمر برای ریدایرکت خودکار
    const timer = setInterval(() => {
      setAutoRedirectTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // نمایش نوتیفیکیشن خطا
    toast.error("پرداخت ناموفق", {
      description: error.message,
      duration: 5000,
      action: {
        label: "تلاش مجدد",
        // eslint-disable-next-line react-hooks/immutability
        onClick: () => handleRetryPayment(),
      },
    });

    return () => clearInterval(timer);
  }, [errorCode, router]);

  const handleRetryPayment = () => {
    if (retryCount >= 3) {
      toast.error("تعداد تلاش‌های شما به پایان رسید", {
        description: "لطفاً با پشتیبانی تماس بگیرید",
      });
      return;
    }

    setRetryCount((prev) => prev + 1);
    toast.info("در حال تلاش مجدد برای پرداخت...");

    // شبیه‌سازی پرداخت مجدد
    setTimeout(() => {
      router.push(`/checkout/${paymentId}`);
    }, 1500);
  };

  const handleContactSupport = () => {
    const supportData = {
      paymentId,
      errorCode: errorDetails?.code,
      timestamp: new Date().toISOString(),
    };

    // در حالت واقعی اینجا API call برای ثبت درخواست پشتیبانی
    localStorage.setItem("support_request", JSON.stringify(supportData));

    toast.success("درخواست پشتیبانی ثبت شد", {
      description: "کارشناسان ما به زودی با شما تماس خواهند گرفت",
    });
  };

  const handleReportIssue = () => {
    const reportWindow = window.open(
      `mailto:support@example.com?subject=گزارش خطای پرداخت&body=Payment ID: ${paymentId}%0D%0AError Code: ${errorCode}`,
      "_blank",
    );
    reportWindow?.focus();
  };

  // انیمیشن ویبره برای آیکون خطا
  const vibrationAnimation = {
    scale: [1, 1.1, 1],
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 2,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ChevronRight className="h-4 w-4" />
              بازگشت
            </Button>

            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              <span className="text-xs font-medium text-rose-700">
                پرداخت ناموفق
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Main Error Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-rose-500 to-orange-500 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={vibrationAnimation}
                    className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    <XCircle className="h-10 w-10" />
                  </motion.div>

                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">پرداخت ناموفق بود</h1>
                    <p className="text-rose-100">
                      تراکنش توسط بانک یا درگاه پرداخت رد شد
                    </p>
                  </div>
                </div>

                <Badge variant="secondary" className="text-rose-700">
                  <AlertTriangle className="h-3 w-3 ml-1" />
                  نیاز به اقدام
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Error Details */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="details" className="gap-2">
                  <FileText className="h-4 w-4" />
                  جزئیات خطا
                </TabsTrigger>
                <TabsTrigger value="solutions" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  راه‌حل‌ها
                </TabsTrigger>
                <TabsTrigger value="support" className="gap-2">
                  <Phone className="h-4 w-4" />
                  پشتیبانی
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-slate-500">کد خطا</p>
                        <Badge variant="outline" className="font-mono">
                          {errorDetails?.code}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-slate-500">شناسه پرداخت</p>
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {paymentId || "نامشخص"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-slate-500">پیغام خطا</p>
                      <p className="text-sm font-medium text-rose-600">
                        {errorDetails?.message}
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h4 className="font-medium text-amber-800">
                            توجه مهم
                          </h4>
                          <p className="text-sm text-amber-700">
                            در صورت کسر وجه از حساب شما، مبلغ طی ۷۲ ساعت کاری به
                            صورت خودکار بازگردانده می‌شود.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="solutions" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      اقدامات پیشنهادی
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          ۱
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">
                            بررسی اطلاعات کارت
                          </h4>
                          <p className="text-sm text-slate-500">
                            از صحت شماره کارت، تاریخ انقضا و CVV2 اطمینان حاصل
                            کنید
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                          ۲
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">
                            بررسی موجودی حساب
                          </h4>
                          <p className="text-sm text-slate-500">
                            از کافی بودن موجودی حساب و عدم محدودیت تراکنش
                            اطمینان حاصل کنید
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                          ۳
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">
                            استفاده از درگاه متفاوت
                          </h4>
                          <p className="text-sm text-slate-500">
                            در صورت امکان از درگاه پرداخت یا کارت بانکی دیگری
                            استفاده کنید
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="text-center">
                      <p className="text-sm text-slate-500">
                        اگر مشکل حل نشد، با پشتیبانی تماس بگیرید
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="support" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      راه‌های ارتباط با پشتیبانی
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-slate-400" />
                          <div>
                            <h4 className="font-medium text-slate-900">
                              تماس تلفنی
                            </h4>
                            <p className="text-sm text-slate-500">
                              پاسخگویی ۲۴ ساعته
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <a href="tel:02191000123">۰۲۱-۹۱۰۰۰۱۲۳</a>
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-slate-400" />
                          <div>
                            <h4 className="font-medium text-slate-900">
                              ایمیل پشتیبانی
                            </h4>
                            <p className="text-sm text-slate-500">
                              پاسخ در کمتر از ۲ ساعت
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <a href="mailto:support@example.com">ارسال ایمیل</a>
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        هنگام تماس، لطفاً شناسه پرداخت خود را آماده داشته باشید:{" "}
                        <span className="font-mono font-bold">{paymentId}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Automatic Redirect */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <div>
                      <h4 className="font-medium text-slate-900">
                        بازگشت خودکار به داشبورد
                      </h4>
                      <p className="text-sm text-slate-500">
                        در {autoRedirectTimer} ثانیه دیگر به داشبورد منتقل
                        می‌شوید
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={(autoRedirectTimer / 15) * 100}
                    className="w-24"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-slate-900">
                  اقدامات سریع
                </h2>
              </CardHeader>
              <CardContent className="space-y-3">
                {errorDetails?.retryable && (
                  <Button
                    onClick={handleRetryPayment}
                    className="w-full gap-2"
                    disabled={retryCount >= 3}
                  >
                    <RotateCcw className="h-4 w-4" />
                    تلاش مجدد پرداخت
                    {retryCount > 0 && (
                      <Badge variant="secondary" className="mr-2">
                        {retryCount}/3
                      </Badge>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => router.push("/dashboard")}
                >
                  <Home className="h-4 w-4" />
                  بازگشت به داشبورد
                </Button>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleContactSupport}
                >
                  <Phone className="h-4 w-4" />
                  تماس با پشتیبانی
                </Button>

                <Button
                  variant="ghost"
                  className="w-full gap-2"
                  onClick={handleReportIssue}
                >
                  <ExternalLink className="h-4 w-4" />
                  گزارش مشکل
                </Button>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-slate-900">
                  روش‌های پرداخت جایگزین
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => router.push("/payment/methods")}
                >
                  <CreditCard className="h-4 w-4" />
                  تغییر روش پرداخت
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => router.push("/wallet")}
                >
                  <CreditCard className="h-4 w-4" />
                  استفاده از کیف پول
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => toast.info("به زودی فعال می‌شود")}
                >
                  <CreditCard className="h-4 w-4" />
                  پرداخت اقساطی
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">تعداد تلاش</span>
                    <span className="font-medium text-slate-900">
                      {retryCount}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      زمان آخرین تلاش
                    </span>
                    <span className="font-medium text-slate-900">
                      {formatDistanceToNow(new Date(), {
                        locale: faIR,
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Notes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200"
        >
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="font-medium text-slate-900">امنیت پرداخت شما</h4>
              <p className="text-sm text-slate-600">
                تمامی تراکنش‌ها با بالاترین سطح رمزگذاری انجام می‌شوند. در صورت
                هرگونه مشکل، مبلغ کسر شده حداکثر طی ۷۲ ساعت کاری به حساب شما
                بازگردانده می‌شود.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PaymentFailure;
