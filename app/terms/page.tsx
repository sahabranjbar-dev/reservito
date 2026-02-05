import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "قوانین و مقررات استفاده از رزرو مارکت",
};

const TermsPage = () => {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-neutral-800">
      {/* Header */}
      <header className="border-b bg-neutral-50">
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            قوانین و مقررات استفاده از رزرو مارکت
          </h1>
          <p className="mt-4 text-neutral-600 max-w-3xl">
            استفاده از خدمات رزرو مارکت به منزله پذیرش کامل قوانین و مقررات زیر
            می‌باشد. لطفاً پیش از استفاده از خدمات، این صفحه را با دقت مطالعه
            نمایید.
          </p>
        </div>
      </header>

      {/* Content */}
      <section className="container mx-auto px-6 py-12 space-y-10 max-w-4xl">
        {/* Section 1 */}
        <div>
          <h2 className="text-xl font-bold mb-3">۱. تعاریف</h2>
          <p className="leading-8 text-neutral-700">
            در این سند، منظور از «رزرو مارکت» سامانه آنلاین مدیریت و رزرو نوبت
            است و «کاربر» به هر شخص حقیقی یا حقوقی گفته می‌شود که از خدمات
            سامانه استفاده می‌کند.
          </p>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-xl font-bold mb-3">۲. شرایط استفاده از خدمات</h2>
          <ul className="list-disc pr-6 space-y-2 text-neutral-700">
            <li>کاربران موظف‌اند اطلاعات صحیح و واقعی ثبت کنند.</li>
            <li>
              مسئولیت هرگونه فعالیت انجام‌شده از طریق حساب کاربری بر عهده کاربر
              است.
            </li>
            <li>
              استفاده از خدمات برای اهداف غیرقانونی یا مغایر با عرف ممنوع است.
            </li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-xl font-bold mb-3">۳. ثبت و لغو نوبت</h2>
          <p className="leading-8 text-neutral-700">
            ثبت نوبت از طریق سامانه انجام می‌شود و شرایط لغو یا تغییر نوبت ممکن
            است بسته به سیاست هر کسب‌وکار متفاوت باشد. کاربران موظف‌اند قبل از
            ثبت نهایی، شرایط مربوطه را بررسی کنند.
          </p>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-xl font-bold mb-3">۴. پرداخت‌ها و هزینه‌ها</h2>
          <p className="leading-8 text-neutral-700">
            در صورت فعال بودن پرداخت آنلاین، کاربران موظف به پرداخت هزینه‌ها طبق
            تعرفه‌های اعلام‌شده هستند. رزرو مارکت مسئولیتی در قبال اختلافات مالی
            بین کاربر و کسب‌وکار ارائه‌دهنده خدمات ندارد.
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-xl font-bold mb-3">۵. مسئولیت‌ها و محدودیت‌ها</h2>
          <ul className="list-disc pr-6 space-y-2 text-neutral-700">
            <li>
              رزرو مارکت تنها بستر ارتباطی بین کاربران و کسب‌وکارها را فراهم
              می‌کند.
            </li>
            <li>مسئولیت کیفیت خدمات ارائه‌شده بر عهده کسب‌وکار مربوطه است.</li>
            <li>
              رزرو مارکت مسئول خسارات ناشی از قطعی اینترنت یا مشکلات فنی خارج از
              کنترل خود نیست.
            </li>
          </ul>
        </div>

        {/* Section 6 */}
        <div>
          <h2 className="text-xl font-bold mb-3">۶. تعلیق یا مسدودسازی حساب</h2>
          <p className="leading-8 text-neutral-700">
            در صورت نقض قوانین یا سوءاستفاده از سامانه، رزرو مارکت حق دارد بدون
            اطلاع قبلی حساب کاربری را به صورت موقت یا دائم مسدود نماید.
          </p>
        </div>

        {/* Section 7 */}
        <div>
          <h2 className="text-xl font-bold mb-3">
            ۷. تغییرات در قوانین و مقررات
          </h2>
          <p className="leading-8 text-neutral-700">
            رزرو مارکت می‌تواند در هر زمان این قوانین را به‌روزرسانی کند. ادامه
            استفاده از خدمات به معنای پذیرش نسخه جدید قوانین خواهد بود.
          </p>
        </div>

        {/* Footer note */}
        <div className="border-t pt-6 text-sm text-neutral-500">
          <p>
            در صورت وجود هرگونه سوال درباره قوانین و مقررات، می‌توانید از طریق
            صفحه «تماس با ما» با پشتیبانی رزرو مارکت ارتباط برقرار کنید.
          </p>
        </div>
      </section>
    </main>
  );
};

export default TermsPage;
