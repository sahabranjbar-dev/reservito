"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import Link from "next/link";
import { CustomTrigger } from "./CustomTrigger";
import dynamic from "next/dynamic";
import NotificationButton from "./NotificationButton";

const LiveClock = dynamic(() => import("@/components/LiveClock/LiveClock"), {
  ssr: false,
});
type UserRoleType = "admin" | "business" | "staff" | "customer";

interface HeaderContentProps {
  role: UserRoleType;
}

export default function HeaderContent({ role }: HeaderContentProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/20 bg-primary-100/95 backdrop-blur supports-backdrop-filter:bg-primary-100/60 ">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-4">
          <CustomTrigger />

          <Link
            href={`/dashboard/${role}`}
            className="items-center gap-2 font-semibold transition-colors hover:text-primary hidden md:flex"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <span className="text-sm font-bold">R</span>
            </div>
            <span className="hidden lg:inline-block">رزرو مارکت</span>
          </Link>

          <Separator
            orientation="vertical"
            className="mx-2 h-6 hidden md:block"
          />
        </div>

        {/* سمت چپ (در RTL) */}
        <div className="flex flex-1 items-center justify-end gap-8">
          <LiveClock />
          <Separator orientation="vertical" className="h-full min-h-10" />

          {/* نوتیفیکیشن */}
          <NotificationButton />
        </div>
      </div>
    </header>
  );
}
