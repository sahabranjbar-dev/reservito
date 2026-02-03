"use client";
import { Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SettingButton = () => {
  const pathname = usePathname();
  const basePath = `/dashboard/${pathname.split("/")[2]}`;

  return (
    <Link
      href={`${basePath}/settings`}
      className="cursor-pointer flex items-center w-full"
    >
      <Settings className="me-2 h-4 w-4" />
      <span>تنظیمات</span>
    </Link>
  );
};

export default SettingButton;
