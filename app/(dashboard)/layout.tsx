import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import Sidebar from "./_components/Sidebar";
import DashboardHeader from "./_components/DashboardHeader";

interface Props {
  children: ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <Sidebar />
      <main className="flex-1 min-h-screen overflow-scroll">
        <DashboardHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
