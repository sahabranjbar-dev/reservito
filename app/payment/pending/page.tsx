"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Home,
  Loader2,
  RefreshCw,
  Shield,
  XCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { paymentChecking } from "./_meta/actions";

// تعریف انواع
type PaymentStatus = "loading" | "paid" | "failed" | "error" | "invalid";
type PaymentDetails = {
  amount?: number;
  transactionId?: string;
  timestamp?: string;
};

// پیکربندی پیشرفته برای وضعیت‌ها
const STATUS_CONFIG: Record<
  PaymentStatus,
  {
    icon: React.ElementType;
    title: string;
    description: string;
    color: {
      primary: string;
      light: string;
      dark: string;
    };
    gradient: string;
    actions: {
      primary?: {
        label: string;
        variant: "default" | "destructive" | "outline" | "secondary";
        icon: React.ElementType;
      };
      secondary?: {
        label: string;
        variant: "outline" | "ghost";
        icon: React.ElementType;
      };
    };
  }
> = {
  loading: {
    icon: Loader2,
    title: "در حال تأیید پرداخت",
    description: "لطفاً چند لحظه صبر کنید",
    color: {
      primary: "text-blue-600",
      light: "bg-blue-50",
      dark: "bg-blue-600",
    },
    gradient: "from-blue-50 via-white to-blue-50",
    actions: {},
  },
  paid: {
    icon: CheckCircle2,
    title: "پرداخت موفق",
    description: "تراکنش شما با موفقیت تکمیل شد",
    color: {
      primary: "text-emerald-600",
      light: "bg-emerald-50",
      dark: "bg-emerald-600",
    },
    gradient: "from-emerald-50 via-white to-emerald-50",
    actions: {
      primary: {
        label: "مشاهده رزرو",
        variant: "default",
        icon: ArrowRight,
      },
      secondary: {
        label: "بازگشت به خانه",
        variant: "outline",
        icon: Home,
      },
    },
  },
  failed: {
    icon: XCircle,
    title: "پرداخت ناموفق",
    description: "تراکنش توسط بانک رد شد",
    color: {
      primary: "text-rose-600",
      light: "bg-rose-50",
      dark: "bg-rose-600",
    },
    gradient: "from-rose-50 via-white to-rose-50",
    actions: {
      primary: {
        label: "تلاش مجدد",
        variant: "destructive",
        icon: RefreshCw,
      },
      secondary: {
        label: "پشتیبانی",
        variant: "outline",
        icon: Shield,
      },
    },
  },
  error: {
    icon: AlertTriangle,
    title: "خطای سیستم",
    description: "مشکلی در پردازش رخ داده است",
    color: {
      primary: "text-amber-600",
      light: "bg-amber-50",
      dark: "bg-amber-600",
    },
    gradient: "from-amber-50 via-white to-amber-50",
    actions: {
      primary: {
        label: "بازگشت",
        variant: "outline",
        icon: Home,
      },
      secondary: {
        label: "راهنما",
        variant: "ghost",
        icon: AlertTriangle,
      },
    },
  },
  invalid: {
    icon: AlertTriangle,
    title: "اطلاعات نامعتبر",
    description: "شناسه پرداخت معتبر نیست",
    color: {
      primary: "text-slate-600",
      light: "bg-slate-100",
      dark: "bg-slate-600",
    },
    gradient: "from-slate-50 via-white to-slate-50",
    actions: {
      primary: {
        label: "بازگشت به خانه",
        variant: "outline",
        icon: Home,
      },
    },
  },
};

const PaymentVerification = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State Management
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [message, setMessage] = useState<string>("");
  const [redirectCountdown, setRedirectCountdown] = useState<number>(0);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});

  const bookingId = searchParams.get("bookingId");
  const paymentId = searchParams.get("paymentId");

  const {} = useQuery({
    queryKey: ["checking-payment", bookingId, paymentId],
    queryFn: async () => {
      if (!paymentId || !bookingId) return [];
      const result = await paymentChecking(paymentId, bookingId);

      if (result) {
        verifyPayment(result);
        return result;
      }
    },
    enabled: !!bookingId && !!bookingId,
  });

  // Memoized Configuration
  const config = useMemo(() => STATUS_CONFIG[status], [status]);

  // Handler Functions
  const handleRedirect = useCallback(
    (url: string, delaySeconds: number = 15) => {
      setRedirectUrl(url);
      setRedirectCountdown(delaySeconds);

      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(url);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    },
    [router],
  );

  const handleRetry = useCallback(() => {
    if (bookingId) {
      router.push(`/checkout/${bookingId}`);
    }
  }, [bookingId, router]);

  const handleSupport = useCallback(() => {
    router.push("/support?topic=payment-issue");
  }, [router]);

  // Payment Verification Logic
  const verifyPayment = useCallback(
    async (result: any) => {
      if (!paymentId || !bookingId) {
        setStatus("invalid");
        setMessage("شناسه پرداخت یا رزرو یافت نشد");
        handleRedirect("/", 10);
        return;
      }

      try {
        setStatus("loading");

        // Update payment details if available
        if (result?.details) {
          setPaymentDetails(result?.details);
        }

        switch (result.paymentStatus) {
          case "PAID":
            setStatus("paid");
            setMessage(
              result.message ||
                "رزرو شما با موفقیت ثبت و تأیید شد. جزئیات به ایمیل شما ارسال گردید.",
            );
            handleRedirect("/dashboard/customer/reservations", 8);
            break;
          case "FAILED":
            setStatus("failed");
            setMessage(
              result.message ||
                "تراکنش توسط بانک رد شد. در صورت کسر وجه، مبلغ تا ۷۲ ساعت کاری به حساب شما بازگردانده می‌شود.",
            );
            handleRedirect(`/payment/failure?paymentId=${result.paymentId}`, 3);
            break;
          default:
            setStatus("error");
            setMessage("وضعیت پرداخت نامشخص است");
            handleRedirect(
              `/payment/failure?paymentId=${result.paymentId}&error=INVALID_CARD`,
              7,
            );
        }
      } catch (error: any) {
        console.error("Payment verification failed:", error);
        setStatus("error");
        setMessage(
          error?.message || "خطا در ارتباط با سرور. لطفاً مجدداً تلاش کنید.",
        );
      }
    },
    [paymentId, bookingId, handleRedirect],
  );

  // Render Components
  const renderStatusIcon = () => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      className="relative"
    >
      <div className={`relative p-6 rounded-2xl ${config.color.light}`}>
        <div
          className={`p-4 rounded-full bg-white shadow-lg ${config.color.primary}`}
        >
          <config.icon
            className={`h-12 w-12 ${status === "loading" ? "animate-spin" : ""}`}
          />
        </div>

        {/* Animated rings for loading state */}
        {status === "loading" && (
          <>
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-blue-200"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-blue-300"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </>
        )}
      </div>
    </motion.div>
  );

  const renderPaymentDetails = () => {
    if (!paymentDetails.amount && !paymentDetails.transactionId) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200"
      >
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          جزئیات تراکنش
        </h3>
        <div className="space-y-2 text-sm">
          {paymentDetails.amount && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">مبلغ:</span>
              <span className="font-bold text-slate-900">
                {paymentDetails.amount.toLocaleString()} تومان
              </span>
            </div>
          )}
          {paymentDetails.transactionId && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">شناسه تراکنش:</span>
              <Badge variant="outline" className="font-mono">
                {paymentDetails.transactionId.slice(0, 12)}...
              </Badge>
            </div>
          )}
          {paymentDetails.timestamp && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500">زمان:</span>
              <span className="text-slate-700">{paymentDetails.timestamp}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderActions = () => {
    const { actions } = config;

    return (
      <div className="space-y-3">
        {/* Countdown Timer */}
        {redirectUrl && redirectCountdown > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-sm text-slate-600"
          >
            <Clock className="h-4 w-4" />
            <span>هدایت خودکار در {redirectCountdown} ثانیه</span>
            <Progress value={(redirectCountdown / 10) * 100} className="w-20" />
          </motion.div>
        )}

        {/* Primary Action Button */}
        {actions.primary && (
          <Button
            onClick={() => {
              if (status === "failed") {
                handleRetry();
              } else if (redirectUrl) {
                router.push(redirectUrl);
              } else {
                router.push("/");
              }
            }}
            variant={actions.primary.variant}
            size="lg"
            className="w-full gap-2"
          >
            <actions.primary.icon className="h-4 w-4" />
            {actions.primary.label}
            {redirectCountdown > 0 && ` (${redirectCountdown})`}
          </Button>
        )}

        {/* Secondary Action Button */}
        {actions.secondary && (
          <Button
            onClick={
              status === "failed" ? handleSupport : () => router.push("/")
            }
            variant={actions.secondary.variant}
            size="lg"
            className="w-full gap-2"
          >
            <actions.secondary.icon className="h-4 w-4" />
            {actions.secondary.label}
          </Button>
        )}

        {/* Quick Links */}
        {status === "paid" && (
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center mb-2">
              دسترسی سریع
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-xs"
              >
                <Home className="h-3 w-3 ml-1" />
                داشبورد
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/booking/tickets")}
                className="text-xs"
              >
                <CreditCard className="h-3 w-3 ml-1" />
                بلیط‌ها
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card
            className={`overflow-hidden border-0 shadow-2xl bg-linear-to-b ${config.gradient}`}
          >
            {/* Header with gradient */}
            <div className={`h-2 ${config.color.dark}`} />

            <CardHeader className="pb-8 pt-10">
              <div className="flex flex-col items-center">
                {renderStatusIcon()}

                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-6 text-2xl font-bold text-slate-900 text-center"
                >
                  {config.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 text-sm text-slate-500 text-center"
                >
                  {config.description}
                </motion.p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <p className="text-slate-700 leading-relaxed">{message}</p>
              </motion.div>

              {/* Payment Details */}
              {renderPaymentDetails()}

              {/* Status-specific tips */}
              {status === "failed" && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>
                      در صورت کسر وجه از حساب، مبلغ تا ۷۲ ساعت کاری به طور
                      خودکار بازگردانده می‌شود. در غیر این صورت با پشتیبانی تماس
                      بگیرید.
                    </span>
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col pt-6 pb-8">
              {renderActions()}

              {/* Security Badge */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Shield className="h-3 w-3" />
                  <span>پرداخت امن با رمزگذاری SSL</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PaymentVerification;
