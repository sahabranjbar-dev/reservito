import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, Home, ArrowRight } from "lucide-react";

export default function BookingNotFound() {
  // تلاش می‌کنیم اسلاگ را از URL بگیریم تا لینک بازگشت دقیق باشد
  // این فقط برای نمایش زیباست
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 max-w-md w-full text-center space-y-6">
        {/* آیکون خطا */}
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>

        {/* متن‌ها */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            اطلاعات رزرو نامعتبر است
          </h1>
          <p className="text-slate-500 leading-relaxed">
            متاسفانه لینک رزرو شما منقضی شده است، سرویس انتخاب شده وجود ندارد یا
            اطلاعات ناقصی به این صفحه ارسال شده است.
          </p>
        </div>

        {/* دکمه‌های عملیاتی */}
        <div className="space-y-3 pt-4">
          <Link href="/" className="block w-full">
            <Button className="w-full h-12 text-base shadow-lg shadow-indigo-100 hover:shadow-indigo-200">
              بازگشت به صفحه اصلی
            </Button>
          </Link>

          <Link href={"/business"}>
            <Button
              variant="ghost"
              className="w-full text-slate-600 hover:text-slate-900"
            >
              جستجوی کسب‌وکار جدید
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
