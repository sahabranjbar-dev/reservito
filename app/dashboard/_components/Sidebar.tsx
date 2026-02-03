import { SignoutButton } from "@/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
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
import { authOptions } from "@/utils/authOptions";
import { ChevronUp, User2 } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import SettingButton from "./SettingButton";
import SideBarDashboardLabel from "./SideBarDashboardLabel";
import SideBarHeaderContent from "./SideBarHeaderContent";
import SideBarItem from "./SideBarItem";

type UserRoleType = "admin" | "business" | "staff" | "customer";

function getUserRole(session: any): UserRoleType {
  if (session?.user?.roles?.includes("SUPER_ADMIN")) {
    return "admin";
  }
  if (session?.user?.business?.businessRole === "OWNER") {
    return "business";
  }
  if (session?.user?.business?.businessRole === "STAFF") {
    return "staff";
  }
  return "customer";
}

const SidebarDashboard = async () => {
  const session = await getServerSession(authOptions);

  const role = getUserRole(session);

  return (
    <Sidebar side="right" className="border-l border-r-0 border-slate-200 z-50">
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

      <SidebarFooter className="m-0 p-0">
        <SidebarMenu className="bg-primary-50 m-0 p-0">
          <SidebarMenuItem className="flex items-center gap-2 p-1 hover:bg-primary mx-2 rounded-lg hover:text-white">
            <SettingButton />
          </SidebarMenuItem>
          <SidebarMenuItem className="border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="">
                    <User2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-center text-sm">
                    <span className="truncate font-semibold">حساب کاربری</span>
                    <span className="truncate text-xs">خروج</span>
                  </div>
                  <ChevronUp />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-lg"
                sideOffset={4}
              >
                <DropdownMenuItem className="gap-2 p-2 group cursor-pointer">
                  <div className="flex flex-col flex-1">
                    <span className="text-xs text-muted-foreground">
                      {session?.user?.name || session?.user.phone}
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer flex justify-start items-center">
                  <Link href={"/auth/choose-dashboard"} className="w-full p-2">
                    انتخاب داشبورد کاربری
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  asChild
                  className="gap-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                >
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
