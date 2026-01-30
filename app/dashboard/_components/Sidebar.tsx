import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SideBarDashboardLabel from "./SideBarDashboardLabel";
import SideBarHeaderContent from "./SideBarHeaderContent";
import SideBarItem from "./SideBarItem";

const SidebarDashboard = async () => {
  return (
    <Sidebar side="right" className="border-l border-r-0 border-slate-200">
      <SidebarHeader className="bg-primary-50 p-4">
        <SideBarHeaderContent />
      </SidebarHeader>
      <Separator className="bg-primary" />

      <SidebarContent className="bg-primary-50">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <SideBarDashboardLabel />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SideBarItem />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarDashboard;
