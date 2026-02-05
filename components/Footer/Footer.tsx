"use client";

import { Clock, MapPin, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const hiddenRoutes = [
  "/auth",
  "/dashboard",
  "/business/auth/register",
  "/business/auth/login",
];

const Footer = () => {
  const pathname = usePathname();
  if (hiddenRoutes.some((r) => pathname.startsWith(r))) return null;

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-6 py-16">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-12 mb-12 place-items-start">
          <div>
            <div className="flex items-center gap-2 mb-4 text-white">
              <Image
                src={"/images/reserv-logo-removebg.png"}
                alt="logo"
                width={48}
                height={48}
                className="rounded-xl"
              />
              <span className="text-xl font-bold">رزرو مارکت</span>
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
                  href="/business/auth/register"
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
                  href="mailto:info@reservmarket.com"
                  className="flex items-center gap-2"
                >
                  <Store className="w-4 h-4" /> info@reservmarket.com
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center w-full h-full">
            {/* Trust logos */}
            <div className="flex items-center gap-4">
              <Image
                src="/images/trust/e-namad.png"
                alt="enamad"
                width={80}
                height={80}
                className="bg-white rounded-md p-1"
              />
              <Image
                src="/images/trust/samandehi.png"
                alt="samandehi"
                width={120}
                height={120}
                className="bg-white rounded-md object-center"
              />
            </div>
          </div>
        </div>

        {/* Trust & Payment */}

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm">
          © {new Date().getFullYear()} رزرو مارکت. تمامی حقوق محفوظ است.
          <p className="text-xs text-slate-400 mt-1">
            طراحی و توسعه تیم رزرو مارکت
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
