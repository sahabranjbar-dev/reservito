import { Clock, Loader2 } from "lucide-react";

interface Props {
  searchParams: Promise<{ id: string }>;
}

const PaymentPending = async ({ searchParams }: Props) => {
  const { id } = await searchParams;

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm text-center space-y-6">
          <h1 className="text-xl font-semibold text-red-600">
            شناسه پرداخت نامعتبر است
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            شناسه پرداخت ارائه شده معتبر نیست. لطفاً دوباره تلاش کنید یا با
            پشتیبانی تماس بگیرید.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-100 text-yellow-600">
            <Clock className="w-7 h-7" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold">پرداخت در حال بررسی است</h1>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          پرداخت شما با موفقیت انجام شده اما هنوز توسط سیستم بانکی تأیید نهایی
          نشده است. این فرآیند معمولاً چند ثانیه طول می‌کشد.
        </p>

        {/* Loader */}
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>

        {/* Hint */}
        <p className="text-xs text-muted-foreground">
          لطفاً این صفحه را نبندید. پس از تأیید، به‌صورت خودکار هدایت می‌شوید.
        </p>
      </div>
    </div>
  );
};

export default PaymentPending;
