import {
  ArrowRight,
  Check,
  Clock,
  CreditCard,
  Lock,
  Search,
  ShieldCheck,
  Star,
  Store,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Ambient Background Gradients */}
        <div className="absolute top-0 right-0 w-200 h-200 bg-indigo-500 rounded-full blur-3xl mix-blend-multiply opacity-20 -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-150 h-150 bg-purple-500 rounded-full blur-3xl mix-blend-multiply opacity-20 translate-y-1/3 -translate-x-1/3"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-right space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold border border-indigo-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span>سامانه هوشمند رزرواسیون کسب‌وکارها</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] text-slate-900">
                مدیریت نوبت‌دهی
                <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 p-4">
                  آنلاین و بی‌نهایت
                </span>
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
                سالن زیبایی هستی؟ باشگاه ورزشی یا کلینیک؟ ما به شما کمک می‌کنیم
                تماس‌های تلفنی را حذف کنید و مشتریانتان در هر ساعت از شبانه‌روز،
                نوبت خود را رزرو کنند.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  target="_blank"
                  href="/business/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white text-lg font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <ArrowRight className="w-5 h-5" />
                  <span>ثبت‌نام کسب‌وکار</span>
                </Link>
                <Link
                  href="/business"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-700 text-lg font-bold border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-slate-50 transition-all duration-300 shadow-sm"
                >
                  <Search className="w-5 h-5 text-slate-400" />
                  <span>جستجوی خدمات</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-slate-500 text-sm font-medium border-t border-slate-200 pt-6">
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  بدون نیاز به کارت اعتباری
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  راه‌اندازی ۲۴ ساعته
                </span>
              </div>
            </div>

            {/* Right: Visual Element (Advanced CSS Mockup) */}
            <div className="relative hidden lg:block h-162.5 w-full">
              {/* Main Booking Interface Card */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-120 bg-white rounded-4xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.25)]">
                {/* Mockup Header */}
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-slate-100 rounded"></div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-linear-to-tr from-indigo-100 to-purple-100"></div>
                </div>

                {/* Mockup Body */}
                <div className="p-6 space-y-6">
                  {/* Calendar Strip */}
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 py-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                          i === 3
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                            : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-[10px] font-medium mb-1 opacity-80">
                          مهر
                        </span>
                        <span className="text-lg font-bold">{20 + i}</span>
                      </div>
                    ))}
                  </div>

                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {["10:00", "11:30", "13:15", "16:00", "17:30", "19:00"].map(
                      (time, i) => (
                        <div
                          key={i}
                          className={`py-3 rounded-xl text-center text-sm font-medium border transition-all duration-300 ${
                            i === 1
                              ? "border-indigo-200 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                              : "border-slate-100 text-slate-400 hover:border-indigo-100 hover:text-slate-600"
                          }`}
                        >
                          {time}
                        </div>
                      )
                    )}
                  </div>

                  {/* Checkout Button Mockup */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-slate-500 text-sm">
                        مبلغ قابل پرداخت
                      </span>
                      <span className="font-extrabold text-slate-900 text-lg">
                        ۱۵۰,۰۰۰{" "}
                        <span className="text-xs font-normal text-slate-400">
                          تومان
                        </span>
                      </span>
                    </div>
                    <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2">
                      <Lock className="w-4 h-4" />
                      پرداخت امن
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Success Notification */}
              <div
                className="absolute top-16 -right-12 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shadow-sm">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    رزرو ثبت شد!
                  </div>
                  <div className="text-xs text-slate-500">
                    کد پیگیری: NB-8921
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {[
              {
                val: "۱,۲۰۰+",
                label: "کسب‌وکار فعال",
                icon: <Store className="w-5 h-5" />,
              },
              {
                val: "۵۰,۰۰۰+",
                label: "رزرو ماهانه",
                icon: <Users className="w-5 h-5" />,
              },
              {
                val: "۹۸٪",
                label: "رضایت مشتریان",
                icon: <Star className="w-5 h-5" />,
              },
              {
                val: "۲۴/۷",
                label: "پشتیبانی آنلاین",
                icon: <Zap className="w-5 h-5" />,
              },
            ].map((stat, i) => (
              <div key={i} className="py-6 md:py-0 px-4 group">
                <div className="flex items-center justify-center gap-2 text-indigo-500 mb-2 group-hover:scale-110 transition-transform">
                  {React.cloneElement(stat.icon, { className: "w-6 h-6" })}
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
                  {stat.val}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features for Customers */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        {/* Subtle Pattern  bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]*/}
        <div className="absolute inset-0 opacity-[0.03] "></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              چرا مشتریان نوبت‌یار رو انتخاب می‌کنن؟
            </h2>
            <div className="h-1 w-20 bg-indigo-600 mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600">
              بدون تماس تلفنی، در هر ساعت از شبانه‌روز نوبت خود را رزرو کنید.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="w-7 h-7" />,
                title: "جستجوی سریع و هوشمند",
                desc: "نوع سرویس و موقعیت مکانی خود را جستجو کنید و بهترین گزینه‌ها را بر اساس امتیاز و قیمت ببینید.",
                bg: "bg-indigo-50",
                border: "group-hover:border-indigo-200",
              },
              {
                icon: <Clock className="w-7 h-7" />,
                title: "انتخاب زمان دقیق",
                desc: "از بین ساعات خالی پرسنل مورد نظر خود، زمان مناسب را انتخاب کنید و نگران تداخل زمانی نباشید.",
                bg: "bg-purple-50",
                border: "group-hover:border-purple-200",
              },
              {
                icon: <ShieldCheck className="w-7 h-7" />,
                title: "پرداخت امن و ضمانت شده",
                desc: "پرداخت آنلاین امن با درگاه‌های بانکی معتبر و ضمانت بازگشت وجه در صورت عدم ارائه خدمات.",
                bg: "bg-blue-50",
                border: "group-hover:border-blue-200",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 ${feature.border}`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner`}
                >
                  <div className="text-indigo-600">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features for Businesses */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Dashboard Mockup (Left) */}
            <div className="order-2 lg:order-1 relative">
              <div className="bg-slate-900 rounded-[2.5rem] p-2 shadow-2xl text-white relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                {/* Glass/Glow Effect */}
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600 via-purple-600 to-slate-900 opacity-20 mix-blend-overlay"></div>

                <div className="relative z-10 bg-slate-800/50 backdrop-blur-xl rounded-4xl p-8 min-h-112.5 flex flex-col">
                  {/* Mockup Top Bar */}
                  <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900/50 px-3 py-1 rounded-lg">
                      dashboard.app
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-3 text-slate-400">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-xs">رزروهای امروز</span>
                      </div>
                      <div className="text-3xl font-bold text-white tracking-tight">
                        ۱۴
                      </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                      <div className="flex items-center gap-3 mb-3 text-slate-400">
                        <CreditCard className="w-5 h-5 text-green-400" />
                        <span className="text-xs">درآمد خالص</span>
                      </div>
                      <div className="text-2xl font-bold text-green-400 tracking-tight">
                        ۳.۴
                        <span className="text-sm text-slate-500 font-normal">
                          M
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="flex-1 flex items-end justify-between gap-2 px-2">
                    {[35, 45, 30, 60, 80, 50, 65].map((h, i) => (
                      <div
                        key={i}
                        className="w-full bg-indigo-500/30 hover:bg-indigo-400 rounded-t-lg transition-all duration-500 relative group"
                        style={{ height: `${h}%` }}
                      >
                        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white/0 group-hover:text-white transition-all">
                          {["S", "M", "T", "W", "T", "F", "S"][i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Text Content (Right) */}
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                  مدیریت کسب‌وکارت رو <br />
                  <span className="text-indigo-600">حرفه‌ای و اتوماتیک</span> کن
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  سیستم نوبت‌یار به شما کمک می‌کند تا دفترچه کاغذی و حافظه
                  فرسایشی را دور بریزید. داشبورد مدیریتی قوی به شما دسترسی کامل
                  به مشتریان، کارمندان و درآمدها می‌دهد.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  "کاهش تماس‌های تلفنی تا ۸۰٪ با سیستم رزرو آنلاین",
                  "مدیریت نامحدود پرسنل و سرویس‌ها در یک پنل",
                  "گزارش‌گیری مالی و آمار دقیق عملکرد روزانه",
                  "ارسال خودکار پیامک یادآوری به مشتریان جهت کاهش No-Show",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 group cursor-default"
                  >
                    <div className="shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center border border-green-200 group-hover:bg-green-500 transition-colors duration-300">
                      <Check className="w-3.5 h-3.5 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-slate-700 font-medium text-lg group-hover:text-slate-900 transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/providers/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-indigo-900 transition-all duration-300 shadow-lg shadow-slate-300 hover:shadow-indigo-200"
                >
                  <span>شروع رایگان ۱۴ روزه</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]*/}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-indigo-600 via-purple-700 to-indigo-800"></div>
        <div className="absolute inset-0  opacity-10"></div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            همین امروز به خانواده بزرگ نوبت‌یار بپیوندید
          </h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            فرقی نمی‌کنه تازه کار هستی یا صاحب یک زنجیره بزرگ؛ ما ابزار مدیریت
            هوشمندی داریم که به درآمدت اضافه کنه.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/business/register"
              className="px-10 py-5 rounded-2xl bg-white text-indigo-700 font-bold text-lg hover:bg-indigo-50 transition-colors shadow-2xl hover:scale-105 transform duration-300"
            >
              ثبت‌نام کسب‌وکار جدید
            </Link>
            <Link
              href="/business/login"
              className="px-10 py-5 rounded-2xl border-2 border-white/30 text-white font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
            >
              ورود به پنل مدیریت
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
