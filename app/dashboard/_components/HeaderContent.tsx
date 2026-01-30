"use client";

import { SignoutButton } from "@/components"; // فرض بر اینکه این کامپوننت وجود دارد
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Building,
  CreditCard,
  HelpCircle,
  Search,
  Settings,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { CustomTrigger } from "./CustomTrigger";

type UserRoleType = "admin" | "business" | "staff" | "customer";

interface HeaderContentProps {
  user: any;
  role: UserRoleType;
  roleName: string;
  initials: string;
}

export default function HeaderContent({
  user,
  role,
  roleName,
  initials,
}: HeaderContentProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <CustomTrigger />

          <Link
            href={`/dashboard/${role}`}
            className="items-center gap-2 font-semibold transition-colors hover:text-primary hidden md:flex"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <span className="text-sm font-bold">R</span>
            </div>
            <span className="hidden lg:inline-block">رزرویتو</span>
          </Link>

          <Separator
            orientation="vertical"
            className="mx-2 h-6 hidden md:block"
          />

          <div className="w-full max-w-sm hidden md:block">
            <div className="relative">
              <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="جستجو..."
                className="h-9 w-full rounded-md border border-input bg-transparent pe-10 ps-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* سمت چپ (در RTL) */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* دکمه جستجو موبایل */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">جستجو</span>
          </Button>

          {/* نوتیفیکیشن */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 end-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="sr-only">اعلان‌ها</span>
          </Button>

          {/* منوی کاربر (Dropdown) */}
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 rounded-full gap-2 px-2"
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage
                    src={user?.image || ""}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-col items-start text-sm hidden md:flex">
                  <span className="font-medium text-foreground">
                    {user?.name?.split(" ")[0] || "کاربر"}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {roleName}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 ml-10"
              forceMount
              sideOffset={7}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/${role}/profile`}
                    className="cursor-pointer"
                  >
                    <span>پروفایل من</span>
                    <User className="me-2 h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                {role === "business" && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/${role}/business`}
                      className="cursor-pointer"
                    >
                      <span>کسب‌وکار من</span>
                      <Building className="me-2 h-4 w-4" />
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/${role}/billing`}
                    className="cursor-pointer"
                  >
                    <span>صورتحساب</span>
                    <CreditCard className="me-2 h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/${role}/settings`}
                    className="cursor-pointer"
                  >
                    <span>تنظیمات</span>
                    <Settings className="me-2 h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/${role}/help`}
                    className="cursor-pointer"
                  >
                    <span>راهنما و پشتیبانی</span>
                    <HelpCircle className="me-2 h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                {role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <Shield className="me-2 h-4 w-4" />
                      <span>مدیریت سیستم</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                asChild
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-900/20"
              >
                <div className="w-full">
                  {/* فرض بر اینکه SignoutButton استایل خود را دارد، اما اینجا آن را در یک منوی استاندارد قرار می‌دهیم */}
                  {/* اگر SignoutButton کاملاً استایل اختصاصی دارد، ممکن است نیاز به asChild داشته باشد */}
                  <SignoutButton />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
