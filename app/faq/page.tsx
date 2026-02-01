import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "سوالات متداول | رزرویتو",
};

const FAQPage = () => {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-neutral-800">
      {/* Header */}
      <header className="border-b bg-neutral-50">
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">سوالات متداول</h1>
          <p className="mt-4 text-neutral-600 max-w-3xl">
            در این بخش پاسخ رایج‌ترین سوالات کاربران درباره استفاده از سامانه
            رزرویتو را مشاهده می‌کنید.
          </p>
        </div>
      </header>

      {/* FAQ Content */}
      <section className="container mx-auto px-6 py-12 max-w-4xl space-y-8">
        {/* Item */}
        <div>
          <h2 className="text-lg font-bold mb-2">
            چگونه می‌توانم نوبت رزرو کنم؟
          </h2>
          <p className="text-neutral-700 leading-8">
            کافی است کسب‌وکار مورد نظر خود را جستجو کرده، سرویس دلخواه را انتخاب
            کنید و زمان مناسب را رزرو نمایید. پس از ثبت نهایی، اطلاعات نوبت برای
            شما نمایش داده خواهد شد.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">
            آیا برای رزرو نیاز به ثبت‌نام دارم؟
          </h2>
          <p className="text-neutral-700 leading-8">
            بله، برای مدیریت بهتر نوبت‌ها و اطلاع‌رسانی، ثبت‌نام با شماره موبایل
            یا ایمیل الزامی است.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">
            آیا امکان لغو یا تغییر نوبت وجود دارد؟
          </h2>
          <p className="text-neutral-700 leading-8">
            بله، در صورتی که کسب‌وکار مربوطه اجازه دهد، می‌توانید تا قبل از زمان
            تعیین‌شده نوبت خود را لغو یا ویرایش کنید.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">
            پرداخت هزینه چگونه انجام می‌شود؟
          </h2>
          <p className="text-neutral-700 leading-8">
            بسته به سیاست هر کسب‌وکار، پرداخت ممکن است به صورت آنلاین یا حضوری
            انجام شود. اطلاعات پرداخت قبل از ثبت نهایی نوبت نمایش داده می‌شود.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">
            اگر کسب‌وکار در زمان نوبت حاضر نبود چه کنم؟
          </h2>
          <p className="text-neutral-700 leading-8">
            در صورت بروز مشکل، می‌توانید از طریق پشتیبانی رزرویتو موضوع را گزارش
            دهید تا بررسی و پیگیری انجام شود.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-2">
            چگونه با پشتیبانی تماس بگیرم؟
          </h2>
          <p className="text-neutral-700 leading-8">
            از طریق صفحه «تماس با ما» می‌توانید پیام خود را ارسال کنید یا از
            اطلاعات تماس درج‌شده استفاده نمایید.
          </p>
        </div>

        {/* Footer note */}
        <div className="border-t pt-6 text-sm text-neutral-500">
          <p>
            اگر پاسخ سوال خود را پیدا نکردید، لطفاً از طریق صفحه تماس با ما با
            تیم پشتیبانی در ارتباط باشید.
          </p>
        </div>
      </section>
    </main>
  );
};

export default FAQPage;
