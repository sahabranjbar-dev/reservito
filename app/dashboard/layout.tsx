import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import DashboardHeader from "./_components/DashboardHeader";
import SidebarDashboard from "./_components/Sidebar";
import { cookies } from "next/headers";

interface Props {
  children: ReactNode;
}

const DashboardLayout = async ({ children }: Props) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SidebarDashboard />
      <main className="flex-1 min-h-screen relative">
        <DashboardHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
