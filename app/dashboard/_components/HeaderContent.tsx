"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Search } from "lucide-react";
import Link from "next/link";
import { CustomTrigger } from "./CustomTrigger";

type UserRoleType = "admin" | "business" | "staff" | "customer";

interface HeaderContentProps {
  role: UserRoleType;
}

export default function HeaderContent({ role }: HeaderContentProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
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

          <div className="w-full hidden md:block">
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
        </div>
      </div>
    </header>
  );
}
