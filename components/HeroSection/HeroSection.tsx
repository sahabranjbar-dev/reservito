import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const heroSlides = [
  {
    id: 1,
    title: "زمان خود را مدیریت کنید",
    subtitle: "با رزرو آنلاین، وقت خود را ذخیره و بهینه کنید",
    image: "/images/slides/slide1.jpeg",
    buttonText: "شروع کنید",
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: 2,
    title: "بهترین خدمات در دسترس شما",
    subtitle: "صدها سرویس با کیفیت برای انتخاب شما",
    image: "/images/slides/slide2.jpeg",
    buttonText: "مشاهده سرویس‌ها",
    color: "from-purple-600 to-pink-500",
  },
  {
    id: 3,
    title: "تجربه‌ای بی‌نظیر",
    subtitle: "سیستم رزرو آنلاین با جدیدترین تکنولوژی‌ها",
    image: "/images/slides/slide3.jpeg",
    buttonText: "درباره ما",
    color: "from-green-600 to-emerald-500",
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // اتوماتیک کردن اسلاید
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* اسلایدها */}
      <div className="relative h-150 md:h-175">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* تصویر پس‌زمینه */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                width={10000}
                height={1000}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-2 bg-linear-to-r from-black/60 via-black/40 to-transparent" />
            </div>

            {/* محتوا */}
            <div className="container mx-auto px-4 h-full flex items-center relative z-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span className="text-white text-sm">
                    پیشرو در رزرو آنلاین
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {slide.title}
                </h1>

                <p className="text-xl text-gray-200 mb-8 max-w-xl">
                  {slide.subtitle}
                </p>

                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-3.5 bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 font-semibold flex items-center space-x-2">
                    <span>{slide.buttonText}</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <button className="px-8 py-3.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all font-semibold">
                    مشاهده دمو
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* کنترل‌های اسلاید */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* دکمه‌های قبلی/بعدی */}
        <button
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
            )
          }
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
          }
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* فرم جستجو */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* جستجو */}
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="چه سرویسی نیاز دارید؟"
                className="w-full pr-12 pl-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>

            {/* دسته‌بندی */}
            <select className="border border-gray-200 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg">
              <option>همه دسته‌بندی‌ها</option>
              <option>آرایشگاه</option>
              <option>پزشکی</option>
              <option>مشاوره</option>
              <option>ماساژ</option>
            </select>

            {/* تاریخ */}
            <div className="relative">
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                className="w-full pr-12 pl-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>

            {/* دکمه جستجو */}
            <button className="bg-linear-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-xl transition-all hover:scale-105 font-semibold text-lg flex items-center justify-center space-x-2">
              <Search className="h-5 w-5" />
              <span>جستجوی سرویس</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
