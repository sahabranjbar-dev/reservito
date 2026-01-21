import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

const DashboardHeader = () => {
  return (
    <header className="h-16 border-b flex items-center justify-between px-4 bg-gray-200 sticky top-0 z-50">
      <SidebarTrigger />
    </header>
  );
};

export default DashboardHeader;
