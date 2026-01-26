"use client";

import {
  Building2,
  CalendarCheck,
  Headset,
  Home,
  LogIn,
  Menu,
  ScanText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginButton from "../LoginButton/LoginButton";
import clsx from "clsx";

const hiddenRoutes = [
  "/auth",
  "/dashboard",
  "/business/register",
  "/business/login",
];

const Header = () => {
  const pathname = usePathname();

  if (hiddenRoutes.some((r) => pathname.startsWith(r))) return null;

  return (
    <header>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              نوبت‌یار
            </span>
          </Link>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <LoginButton />
          </div>

          {/* Mobile Menu Button (Placeholder) */}
          <div className="md:hidden text-slate-600">
            <Menu className="w-6 h-6" />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
