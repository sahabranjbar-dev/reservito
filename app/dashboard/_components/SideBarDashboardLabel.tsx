"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { getFarsiLabel } from "../_meta/utils";

const SideBarDashboardLabel = () => {
  const pathname = usePathname();

  const sideBarLabel = getFarsiLabel(pathname);
  return <div>پنل {sideBarLabel}</div>;
};

export default SideBarDashboardLabel;
