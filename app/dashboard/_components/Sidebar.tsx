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
import SideBarDashboardLabel from "./SideBarDashboardLabel";
import SideBarHeaderContent from "./SideBarHeaderContent";
import SideBarItem from "./SideBarItem";
import { ChevronUp, HelpCircle, Settings, User2 } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

type UserRoleType = "admin" | "business" | "staff" | "customer";

function getRoleDisplayName(role: UserRoleType): string {
  const roleNames: Record<UserRoleType, string> = {
    admin: "مدیر سیستم",
    business: "صاحب کسب‌وکار",
    staff: "کارمند",
    customer: "مشتری",
  };
  return roleNames[role];
}

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getUserRole(session: any): UserRoleType {
  // لازم است Role را ایمپورت کنید یا از جایی دیگر دریافت کنید
  // اینجا برای جلوگیری از خطا فرض می‌کنیم Role موجود است
  // import { Role } from "@/constants/enums";
  if (session?.user?.roles?.includes("SUPER_ADMIN")) {
    // Placeholder for Role enum
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
  const user = session?.user;
  const roleName = getRoleDisplayName(role);
  const initials = getInitials(user?.name);

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

      <SidebarFooter className="m-0 p-0">
        <SidebarMenu className="bg-primary-50 m-0 p-0">
          <SidebarMenuItem className="flex items-center gap-2 p-1 hover:bg-primary mx-2 rounded-lg hover:text-white"></SidebarMenuItem>
          <SidebarMenuItem className="flex items-center gap-2 p-1 hover:bg-primary mx-2 rounded-lg hover:text-white">
            <Link
              href={`/dashboard/${role}/settings`}
              className="cursor-pointer flex items-center w-full"
            >
              <Settings className="me-2 h-4 w-4" />
              <span>تنظیمات</span>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem className="border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-slate-100 text-slate-600"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <User2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-center text-sm hover:text-primary">
                    <span className="truncate font-semibold">حساب کاربری</span>
                    <span className="truncate text-xs">خروج</span>
                  </div>
                  <ChevronUp className="text-primary" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg shadow-lg"
                sideOffset={4}
              >
                <DropdownMenuItem className="gap-2 p-2 group cursor-pointer">
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium text-foreground">
                      {roleName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session?.user?.phone}
                    </span>
                  </div>
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
