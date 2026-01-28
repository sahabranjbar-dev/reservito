import React from "react";
import { XCircle } from "lucide-react";
import Link from "next/link";

const PaymentFailure = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 text-red-600">
            <XCircle className="w-7 h-7" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-red-600">
          پرداخت ناموفق بود
        </h1>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          متأسفانه پرداخت شما با خطا مواجه شد یا توسط بانک تأیید نشد. در صورت
          کسر وجه، مبلغ طی چند ساعت آینده به حساب شما بازگردانده می‌شود.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/payment"
            className="inline-flex justify-center items-center rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            تلاش مجدد برای پرداخت
          </Link>

          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:underline"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
