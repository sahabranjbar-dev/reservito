"use client";

import { useState, useEffect, useMemo } from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { getRole } from "@/utils/common";
import { cn } from "@/lib/utils"; // مطمئن شوید فایل lib/utils دارید
import {
  BookmarkCheck,
  CalendarCheck,
  CalendarRange,
  ChevronRight,
  Home,
  Inbox,
  Settings,
  ShieldBan,
  SquareMousePointer,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types/common";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
// Data Config
// ==========================================

const businessSideBarItems: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "پرسنل", url: "/staff", icon: Users },
  { title: "خدمات و سرویس‌ها", url: "/services", icon: Workflow },
  { title: "شیفت‌های پرسنل", url: "/staff-shifts", icon: CalendarRange },
  {
    title: "رزرو‌های کاربران",
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

const adminSideBarItems: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "کاربران", url: "/users", icon: Users },
  { title: "کسب‌وکار", url: "/businesses", icon: Users },
  { title: "خدمات", url: "/services", icon: Workflow },
  { title: "رزرو‌های کاربران", url: "/users-reservations", icon: Inbox },
  { title: "پیام‌ها", url: "/messages", icon: Inbox },
  { title: "نقش‌ها و دسترسی‌ها", url: "/roles", icon: ShieldBan },
];

// ==========================================
// Components
// ==========================================

interface SidebarItemProps {
  item: SidebarItem;
  basePath: string;
  pathname: string;
}

const SidebarItemComponent = ({
  item,
  basePath,
  pathname,
}: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;

  const href = `${basePath}${item.url || "#"}`;

  const isActive = pathname === href;

  useEffect(() => {
    if (hasChildren && item.children) {
      const isChildActive = item.children.some(
        (child) => `${basePath}${child.url}` === pathname
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (isChildActive) setIsOpen(true);
    }
  }, [pathname, item.children, basePath, hasChildren]);

  return (
    <SidebarMenuItem>
      {hasChildren ? (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
          <>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip={item.title}>
                {Icon && <Icon />}
                <span>{item.title}</span>
                <ChevronRight
                  className={cn(
                    "ml-auto transition-transform duration-200",
                    isOpen && "rotate-90"
                  )}
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children!.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={pathname === `${basePath}${subItem.url}`}
                    >
                      <Link href={`${basePath}${subItem.url}`}>
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </>
        </Collapsible>
      ) : (
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={isActive}
          className={cn(
            "group transition-all duration-200",
            isActive &&
              "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          )}
        >
          <Link href={href}>
            {Icon && (
              <Icon
                className={cn(
                  "text-muted-foreground transition-colors",
                  isActive && "text-primary"
                )}
              />
            )}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
};

export default function SideBarItem() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const role = getRole(session?.user?.roles as UserRole[]);

  const items = useMemo(() => {
    if (status === "loading") return [];

    switch (role) {
      case "business":
        return businessSideBarItems;
      case "admin":
        return adminSideBarItems;
      case "customer":
        return customerSideBarItems;
      default:
        return [];
    }
  }, [role, status]);

  const basePath = useMemo(() => {
    return `/dashboard/${role}`;
  }, [role]);

  if (items.length === 0) return null;

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarItemComponent
          key={item.title}
          item={item}
          basePath={basePath}
          pathname={pathname}
        />
      ))}
    </SidebarMenu>
  );
}
