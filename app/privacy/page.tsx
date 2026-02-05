import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "حریم خصوصی کاربران | رزرو مارکت",
};

const PrivacyPage = () => {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-neutral-800">
      {/* Header */}
      <header className="border-b bg-neutral-50">
        <div className="container mx-auto px-6 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            حریم خصوصی کاربران
          </h1>
          <p className="mt-4 text-neutral-600 max-w-3xl">
            ما در «رزرو مارکت» متعهد به حفظ و حراست از اطلاعات شخصی کاربران
            هستیم. این صفحه توضیح می‌دهد چه اطلاعاتی جمع‌آوری می‌شود و چگونه از
            آن استفاده می‌کنیم.
          </p>
        </div>
      </header>

      {/* Content */}
      <section className="container mx-auto px-6 py-12 space-y-10 max-w-4xl">
        {/* Section 1 */}
        <div>
          <h2 className="text-xl font-bold mb-3">
            ۱. اطلاعاتی که جمع‌آوری می‌کنیم
          </h2>
          <p className="leading-8 text-neutral-700">
            هنگام استفاده از خدمات سایت، ممکن است اطلاعات زیر از شما دریافت شود:
          </p>
          <ul className="list-disc pr-6 mt-3 space-y-2 text-neutral-700">
            <li>شماره تلفن همراه یا ایمیل جهت احراز هویت</li>
            <li>نام و نام خانوادگی (در صورت ثبت توسط کاربر)</li>
            <li>اطلاعات مربوط به رزروها و نوبت‌ها</li>
            <li>اطلاعات فنی مانند IP و نوع مرورگر</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-xl font-bold mb-3">۲. نحوه استفاده از اطلاعات</h2>
          <p className="leading-8 text-neutral-700">
            اطلاعات کاربران تنها برای ارائه بهتر خدمات استفاده می‌شود، از جمله:
          </p>
          <ul className="list-disc pr-6 mt-3 space-y-2 text-neutral-700">
            <li>مدیریت و ثبت نوبت‌ها</li>
            <li>ارسال اطلاع‌رسانی‌های مربوط به رزرو</li>
            <li>بهبود تجربه کاربری و کیفیت خدمات</li>
            <li>پشتیبانی و پاسخگویی به درخواست‌ها</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-xl font-bold mb-3">۳. حفظ امنیت اطلاعات</h2>
          <p className="leading-8 text-neutral-700">
            ما از روش‌های فنی و امنیتی استاندارد برای محافظت از اطلاعات کاربران
            استفاده می‌کنیم و دسترسی به اطلاعات تنها برای افراد مجاز امکان‌پذیر
            است.
          </p>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-xl font-bold mb-3">
            ۴. اشتراک‌گذاری اطلاعات با اشخاص ثالث
          </h2>
          <p className="leading-8 text-neutral-700">
            اطلاعات کاربران به هیچ عنوان فروخته یا اجاره داده نمی‌شود، مگر در
            مواردی که به موجب قانون یا دستور مراجع قضایی الزام‌آور باشد.
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-xl font-bold mb-3">۵. حقوق کاربران</h2>
          <p className="leading-8 text-neutral-700">
            کاربران می‌توانند در هر زمان درخواست ویرایش یا حذف اطلاعات شخصی خود
            را ثبت کنند. همچنین امکان لغو دریافت پیام‌های اطلاع‌رسانی وجود دارد.
          </p>
        </div>

        {/* Section 6 */}
        <div>
          <h2 className="text-xl font-bold mb-3">
            ۶. تغییرات در سیاست حریم خصوصی
          </h2>
          <p className="leading-8 text-neutral-700">
            ممکن است این سیاست در آینده به‌روزرسانی شود. آخرین نسخه همیشه از
            طریق همین صفحه در دسترس خواهد بود.
          </p>
        </div>

        {/* Footer note */}
        <div className="border-t pt-6 text-sm text-neutral-500">
          <p>
            در صورت داشتن هرگونه سوال درباره حریم خصوصی، می‌توانید از طریق صفحه
            «تماس با ما» با پشتیبانی رزرو مارکت در ارتباط باشید.
          </p>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPage;
