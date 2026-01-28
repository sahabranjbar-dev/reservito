"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  FileText,
  Download,
  Share2,
  Clock,
  Calendar,
  User,
  CreditCard,
  ArrowLeft,
  Home,
  QrCode,
  ShieldCheck,
  BellRing,
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
import { toast } from "sonner";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";

interface BookingDetails {
  id: string;
  bookingCode: string;
  serviceName: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  customerName: string;
  status: "confirmed" | "pending" | "completed";
  paymentMethod: string;
  transactionId: string;
}

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null,
  );
  const [showConfetti, setShowConfetti] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // شبیه‌سازی دریافت اطلاعات رزرو
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // در حالت واقعی اینجا API call خواهد بود
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockDetails: BookingDetails = {
          id: searchParams.get("bookingId") || "BK-2024-001",
          bookingCode:
            "RES-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
          serviceName: "مشاوره تخصصی فنی",
          date: format(new Date(), "dd MMMM yyyy", { locale: faIR }),
          time: "۱۴:۳۰ - ۱۶:۰۰",
          duration: "۱ ساعت و ۳۰ دقیقه",
          price: 850000,
          customerName: "علی محمدی",
          status: "confirmed",
          paymentMethod: "کارت به کارت بانک ملت",
          transactionId: "TX-" + Date.now(),
        };

        setBookingDetails(mockDetails);

        // نمایش نوتیفیکیشن
        toast.success("پرداخت با موفقیت تأیید شد", {
          description: "جزئیات رزرو به ایمیل شما ارسال شد",
          duration: 5000,
        });
      } catch (error) {
        toast.error("خطا در دریافت اطلاعات", {
          description: "لطفاً دوباره تلاش کنید",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();

    // پاک کردن کانفتتی بعد از ۳ ثانیه
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // شبیه‌سازی دانلود فاکتور
  const handleDownloadInvoice = async () => {
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success("فاکتور با موفقیت دانلود شد");
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `رزرو ${bookingDetails?.serviceName}`,
          text: `رزرو ${bookingDetails?.serviceName} با موفقیت انجام شد`,
          url: window.location.href,
        });
        toast.info("لینک رزرو به اشتراک گذاشته شد");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("لینک رزرو در کلیپ‌بورد کپی شد");
    }
  };

  const handleAddToCalendar = () => {
    toast.info("به تقویم اضافه شد", {
      description: "یادآور رزرو به تقویم شما اضافه گردید",
    });
  };

  // انیمیشن کانفتتی
  const Confetti = () => (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0,
            scale: 0,
          }}
          animate={{
            y: window.innerHeight + 20,
            rotate: 360,
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random(),
            ease: "easeOut",
            delay: Math.random() * 0.5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="mx-auto w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
          />
          <p className="text-sm text-emerald-600 font-medium">
            در حال دریافت اطلاعات رزرو...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showConfetti && <Confetti />}

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
        {/* Header Navigation */}
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                بازگشت به داشبورد
              </Button>

              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700">
                  پرداخت ایمن
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Success Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                    >
                      <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                        <CheckCircle className="h-10 w-10" />
                      </div>
                    </motion.div>

                    <div className="space-y-1">
                      <h1 className="text-2xl font-bold">
                        پرداخت با موفقیت انجام شد!
                      </h1>
                      <p className="text-emerald-100">
                        رزرو شما با موفقیت ثبت و تأیید شد
                      </p>
                    </div>
                  </div>

                  <Badge variant="secondary" className="text-emerald-700">
                    <BellRing className="h-3 w-3 ml-1" />
                    تأیید شده
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Info Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      جزئیات رزرو
                    </h2>
                    <Badge variant="outline" className="font-mono">
                      {bookingDetails?.bookingCode}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">تاریخ:</span>
                        <span className="text-sm font-medium text-slate-900">
                          {bookingDetails?.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">زمان:</span>
                        <span className="text-sm font-medium text-slate-900">
                          {bookingDetails?.time}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">مشتری:</span>
                        <span className="text-sm font-medium text-slate-900">
                          {bookingDetails?.customerName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600">
                          روش پرداخت:
                        </span>
                        <span className="text-sm font-medium text-slate-900">
                          {bookingDetails?.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {bookingDetails?.serviceName}
                        </h3>
                        <p className="text-sm text-slate-500">
                          مدت زمان: {bookingDetails?.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-500">
                          مبلغ پرداخت شده
                        </p>
                        <p className="text-xl font-bold text-emerald-600">
                          {bookingDetails?.price.toLocaleString()} تومان
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-slate-900">
                    مراحل بعدی
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                        ۱
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">
                          دریافت ایمیل تأیید
                        </h3>
                        <p className="text-sm text-slate-500">
                          جزئیات کامل رزرو به ایمیل شما ارسال شده است
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        ۲
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">
                          آماده‌سازی برای جلسه
                        </h3>
                        <p className="text-sm text-slate-500">
                          ۱۵ دقیقه قبل از زمان مقرر در محل حاضر شوید
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                        ۳
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">
                          ارائه مدارک لازم
                        </h3>
                        <p className="text-sm text-slate-500">
                          مدارک شناسایی را همراه داشته باشید
                        </p>
                      </div>
                    </div>
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
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleDownloadInvoice}
                  >
                    <FileText className="h-4 w-4" />
                    دریافت فاکتور
                    {downloadProgress > 0 && downloadProgress < 100 && (
                      <Progress value={downloadProgress} className="w-16" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                    اشتراک‌گذاری
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleAddToCalendar}
                  >
                    <Calendar className="h-4 w-4" />
                    افزودن به تقویم
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => router.push("/dashboard/reservations")}
                  >
                    <Home className="h-4 w-4" />
                    مشاهده همه رزروها
                  </Button>
                </CardContent>
              </Card>

              {/* QR Code */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3 text-center">
                    <div className="inline-block p-4 bg-slate-100 rounded-lg">
                      <QrCode className="h-24 w-24 text-slate-700" />
                    </div>
                    <p className="text-sm text-slate-500">
                      اسکن کنید برای ذخیره در موبایل
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-slate-900 text-center">
                      نیاز به کمک دارید؟
                    </h3>
                    <p className="text-sm text-slate-500 text-center">
                      تیم پشتیبانی ما ۲۴/۷ در دسترس شماست
                    </p>
                    <Button variant="ghost" className="w-full gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      تماس با پشتیبانی
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              size="lg"
              className="gap-2"
              onClick={() => router.push("/dashboard/reservations")}
            >
              مشاهده رزرو در داشبورد
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="gap-2"
              onClick={() => router.push("/")}
            >
              بازگشت به صفحه اصلی
            </Button>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-500">
                در صورت بروز هرگونه مشکل با پشتیبانی تماس بگیرید
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
                <span>شماره پیگیری: {bookingDetails?.transactionId}</span>
                <Separator orientation="vertical" className="h-4" />
                <span>
                  زمان پرداخت: {new Date().toLocaleTimeString("fa-IR")}
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PaymentSuccess;
