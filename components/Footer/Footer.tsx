"use client";

import { CalendarCheck, Clock, MapPin, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const hiddenRoutes = [
  "/auth",
  "/dashboard",
  "/business/register",
  "/business/login",
];

const Footer = () => {
  const pathname = usePathname();
  if (hiddenRoutes.some((r) => pathname.startsWith(r))) return null;

  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <CalendarCheck className="w-6 h-6" />
              <span className="text-xl font-bold">رزرویتو</span>
            </div>
            <p className="text-sm leading-relaxed">
              پلتفرم جامع رزرو آنلاین برای تمام کسب‌وکارهای خدماتی. مدیریت نوبت،
              افزایش فروش و رضایت مشتری.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/business" className="hover:text-indigo-400">
                  جستجوی خدمات
                </Link>
              </li>
              <li>
                <Link
                  href="/business/register"
                  className="hover:text-indigo-400"
                >
                  ثبت کسب‌وکار
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-indigo-400">
                  درباره ما
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">پشتیبانی</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-indigo-400">
                  سوالات متداول
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-400">
                  قوانین و مقررات
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-400">
                  حریم خصوصی
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">تماس با ما</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> مازندران، بابل
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> شنبه تا پنج‌شنبه ۹ تا ۱۸
              </li>
              <li>
                <Link
                  href={"mailto:info@reservito.com"}
                  className="flex items-center gap-2"
                >
                  <Store className="w-4 h-4" /> info@reservito.com
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          © {new Date().getFullYear()} رزرویتو. تمامی حقوق محفوظ است.
          <p className="text-xs">طراحی و توسعه تیم رزرویتو</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
