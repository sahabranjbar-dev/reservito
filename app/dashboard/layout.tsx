import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import DashboardHeader from "./_components/DashboardHeader";
import SidebarDashboard from "./_components/Sidebar";

interface Props {
  children: ReactNode;
}

const DashboardLayout = async ({ children }: Props) => {
  return (
    <SidebarProvider>
      <SidebarDashboard />
      <main className="flex-1 min-h-screen overflow-scroll">
        <DashboardHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
