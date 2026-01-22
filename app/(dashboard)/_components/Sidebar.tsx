import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronUp, User2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { SignoutButton } from "@/components";
import SideBarItem from "./SideBarItem";
import { getRoleFarsiLabel } from "@/utils/common";
import { UserRole } from "@/types/common";

const SidebarDashboard = async () => {
  const session = await getServerSession(authOptions);

  const role = getRoleFarsiLabel(session?.user?.role as UserRole);

  return (
    <Sidebar side="right">
      <SidebarHeader className="bg-primary text-gray-100" />
      <SidebarContent className="bg-primary text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="bg-sidebar-primary text-white font-semibold text-lg m-4">
            داشبورد {role}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SideBarItem />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 />{" "}
                  {session?.user?.name ||
                    session?.user?.phone ||
                    session?.user?.email ||
                    "کاربر میهمان"}
                  <ChevronUp className="mr-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] bg-white p-4"
              >
                <DropdownMenuItem asChild>
                  <SignoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarDashboard;
