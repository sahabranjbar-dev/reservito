import { CheckCircle } from "lucide-react";
import Link from "next/link";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600">
            <CheckCircle className="w-7 h-7" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold text-green-600">
          پرداخت با موفقیت انجام شد
        </h1>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          پرداخت شما با موفقیت انجام شد و رزرو شما ثبت گردید. جزئیات رزرو در
          داشبورد شما قابل مشاهده است.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard/reservations"
            className="inline-flex justify-center items-center rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            مشاهده رزرو
          </Link>

          <Link
            href="/"
            className="text-sm text-muted-foreground hover:underline"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
