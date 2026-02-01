"use client";

import {
  BookOpenCheck,
  Building2,
  CalendarCheck,
  Headset,
  Home,
  HomeIcon,
  LayoutDashboard,
  LogIn,
  Menu,
  MessageCircleMore,
  ScanText,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginButton from "../LoginButton/LoginButton";
import clsx from "clsx";
import HeaderMenu from "../HeaderMenu/HeaderMenu";

const hiddenRoutes = [
  "/auth",
  "/dashboard",
  "/business/register",
  "/business/login",
];

const menuItems = [
  { title: "خانه", href: "/", icon: <HomeIcon size={20} /> },
  { title: "داشبورد", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { title: "درباره ما", href: "/about-us", icon: <BookOpenCheck size={20} /> },
  {
    title: "تماس با ما",
    href: "/contact-us",
    icon: <MessageCircleMore size={20} />,
  },
  { title: "رزرو نوبت", href: "/business", icon: <Building2 size={20} /> },
];

const Header = () => {
  const pathname = usePathname();

  if (hiddenRoutes.some((r) => pathname.startsWith(r))) return null;

  return (
    <header>
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4">
        <div className="flex items-center justify-between container mx-auto">
          {/* Logo */}
          <Link href={"/"} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              رزرویتو
            </span>
          </Link>

          <nav className="hidden md:block">
            <ul className="flex justify-center items-center lg:gap-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className="relative md:px-4 md:py-2.5 rounded-xl md:min-w-28 flex justify-center items-center font-medium text-gray-700 bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 active:bg-blue-100 transition-all duration-300 ease-out overflow-hidden group"
                    href={item.href}
                  >
                    {/* افکت زمینه هنگام هاور */}
                    <span className=" absolute inset-0  bg-linear-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                    {/* متن */}
                    <span
                      className={clsx(
                        "relative z-10 flex items-center gap-2 md:text-xs lg:text-sm",
                        {
                          "text-indigo-500":
                            item.href === "/"
                              ? pathname === "/"
                              : pathname.startsWith(item.href),
                        },
                      )}
                    >
                      {item.title}
                      {item?.icon}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <LoginButton />
          </div>

          {/* Mobile Menu Button (Placeholder) */}
          <div className="md:hidden text-slate-600">
            <HeaderMenu />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
