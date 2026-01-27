"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  BookmarkCheck,
  CalendarCheck,
  CalendarRange,
  ChevronRight,
  Home,
  Inbox,
  ShieldBan,
  SquareMousePointer,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Role } from "@/constants/enums";

// ==========================================
// Types
// ==========================================

type SidebarItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  children?: SidebarItem[];
};

// ==========================================
// Sidebar Config
// ==========================================

const businessSideBarItems: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "پرسنل", url: "/staff", icon: Users },
  { title: "خدمات و سرویس‌ها", url: "/services", icon: Workflow },
  { title: "شیفت‌های پرسنل", url: "/staff-shifts", icon: CalendarRange },
  {
    title: "رزروهای کاربران",
    url: "/users-reservations",
    icon: SquareMousePointer,
  },
  {
    title: "پرداخت‌ها و فاکتورها",
    url: "/payments-invoices",
    icon: BookmarkCheck,
  },
];

const customerSideBarItems: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "رزروهای من", url: "/reservations", icon: CalendarCheck },
  { title: "علاقه‌مندی‌ها", url: "/bookmarks", icon: BookmarkCheck },
  { title: "پیام‌ها", url: "/inbox", icon: Inbox },
];

const staffSideBarItems: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "خدمات من", url: "/services", icon: Workflow },
  { title: "شیفت‌های من", url: "/shifts", icon: CalendarRange },
  { title: "پیام‌ها", url: "/inbox", icon: Inbox },
];

const adminSideBarItems: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "کاربران", url: "/users", icon: Users },
  { title: "کسب‌وکارها", url: "/businesses", icon: Users },
  { title: "خدمات", url: "/services", icon: Workflow },
  { title: "رزروهای کاربران", url: "/users-reservations", icon: Inbox },
  { title: "پیام‌ها", url: "/messages", icon: Inbox },
  { title: "نقش‌ها و دسترسی‌ها", url: "/roles", icon: ShieldBan },
];

// ==========================================
// Hooks
// ==========================================

function useSidebarItems() {
  const { data: session, status } = useSession();

  return useMemo(() => {
    if (status === "loading") return [];

    if (session?.user.roles?.includes(Role.SUPER_ADMIN)) {
      return adminSideBarItems;
    }

    if (session?.user.business?.businessRole === "OWNER") {
      return businessSideBarItems;
    }

    if (session?.user.business?.businessRole === "STAFF") {
      return staffSideBarItems;
    }

    return customerSideBarItems;
  }, [session, status]);
}

// ==========================================
// Components
// ==========================================

interface SidebarItemProps {
  item: SidebarItem;
  pathname: string;
}

function SidebarItemComponent({ item, pathname }: SidebarItemProps) {
  const Icon = item.icon;
  const hasChildren = !!item.children?.length;
  const session = useSession();

  const isActive =
    item.url === "/" ? pathname === "/" : pathname.startsWith(item.url ?? "");

  const isOpen =
    hasChildren &&
    item.children?.some((child) => pathname.startsWith(child.url ?? ""));

  const getRole = () => {
    if (session?.data?.user.roles?.includes(Role.SUPER_ADMIN)) {
      return "admin";
    }

    if (session?.data?.user.business?.businessRole === "OWNER") {
      return "business";
    }

    if (session?.data?.user.business?.businessRole === "STAFF") {
      return "staff";
    }

    return "customer";
  };

  const role = getRole();

  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <Collapsible open={isOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              {Icon && <Icon />}
              <span>{item.title}</span>
              <ChevronRight
                className={cn(
                  "ml-auto transition-transform",
                  isOpen && "rotate-90"
                )}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children!.map((sub) => (
                <SidebarMenuSubItem key={sub.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname.startsWith(sub.url ?? "")}
                  >
                    <Link href={sub.url!}>
                      <span>{sub.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={isActive}
        disabled={item.disabled}
        className={cn(item.disabled && "opacity-50 pointer-events-none")}
      >
        <Link href={`/dashboard/${role}${item.url}`}>
          {Icon && <Icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// ==========================================
// Main Sidebar
// ==========================================

export default function AppSidebar() {
  const pathname = usePathname();
  const items = useSidebarItems();

  if (!items.length) return null;

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarItemComponent
          key={item.title}
          item={item}
          pathname={pathname}
        />
      ))}
    </SidebarMenu>
  );
}
