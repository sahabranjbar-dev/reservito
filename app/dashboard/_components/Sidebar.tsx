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
import { ChevronUp, Headset, Settings, User2 } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import SideBarDashboardLabel from "./SideBarDashboardLabel";
import SideBarHeaderContent from "./SideBarHeaderContent";
import SideBarItem from "./SideBarItem";

const items = [
  { id: 1, title: "تنظیمات پروفایل", href: "settings", icon: <Settings /> },
  { id: 2, title: "پشتیبانی و راهنما", href: "supports", icon: <Headset /> },
];

const SidebarDashboard = async () => {
  const session = await getServerSession(authOptions);

  const displayName = session?.user.name || "کاربر";

  return (
    <Sidebar side="right" className="border-l border-r-0 border-slate-200/50">
      <SidebarHeader className="bg-slate-50 p-4">
        <SideBarHeaderContent />
      </SidebarHeader>
      <Separator className="bg-slate-200" />

      <SidebarContent className="bg-slate-50/50">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <SideBarDashboardLabel />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SideBarItem />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-slate-50 border-t border-slate-200 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-slate-100 text-slate-600"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <User2 className="size-4" />
                  </div>
                  <div className="grid flex-1 text-center text-sm leading-tight">
                    <span className="truncate font-semibold">حساب کاربری</span>
                    <span className="truncate text-xs text-muted-foreground">
                      خروج
                    </span>
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
                    <span className="text-sm font-medium text-foreground">
                      {displayName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {session?.user.email || session?.user.phone}
                    </span>
                  </div>
                </DropdownMenuItem>

                <Separator />

                {items.map(({ href, icon, id, title }) => {
                  return (
                    <DropdownMenuItem key={id} className="w-full">
                      <Link
                        href={href}
                        className="flex justify-end items-center gap-2 w-full p-2"
                      >
                        {title}
                        {icon}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}

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
