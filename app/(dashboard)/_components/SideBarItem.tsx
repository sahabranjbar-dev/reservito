"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ChartColumnStacked,
  ChevronDown,
  Home,
  Inbox,
  Rss,
  Settings,
  ShieldBan,
  ShoppingCart,
  Store,
  Tag,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SidebarItem = {
  title: string;
  url?: string;
  icon?: React.ElementType;
  children?: SidebarItem[];
};

const secretarySideBarItem: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "کاربران", url: "/users", icon: Home },
  { title: "رزرو‌های کاربران", url: "/users-reservations", icon: Home },
  { title: "تنظیمات", url: "/settings", icon: Settings },
  { title: "خدمات", url: "/services", icon: Users },
];

const customerSideBarItem: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "سفارشات شما", url: "/reservations", icon: Home },
  { title: "تنظیمات", url: "/settings", icon: Settings },
];

const adminSideBarItem: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "کاربران", url: "/users", icon: Users },
  { title: "خدمات", url: "/services", icon: Users },
  { title: "رزرو‌های کاربران", url: "/users-reservations", icon: Home },
  { title: "پیام‌ها", url: "/messages", icon: Inbox },
  { title: "نقش‌ها و دسترسی‌ها", url: "/roles", icon: ShieldBan },
  { title: "تنظیمات", url: "/settings", icon: Settings },
];

interface SidebarItemsProps {
  items: SidebarItem[];
  level?: number;
}

const SidebarItems = ({ items, level = 0 }: SidebarItemsProps) => {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarNode key={item.title} item={item} level={level} />
      ))}
    </SidebarMenu>
  );
};

interface SidebarNodeProps {
  item: SidebarItem;
  level: number;
}

const SidebarNode = ({ item, level }: SidebarNodeProps) => {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;
  const Icon = item.icon;
  const session = useSession();

  const getRole = () => {
    return session.data?.user?.role.trim().toLowerCase() || "customer";
  };
  return (
    <SidebarMenuItem>
      {item.url ? (
        <SidebarMenuButton asChild className="border mt-2">
          <Link href={`/${getRole()}${item.url}`}>
            {Icon && <Icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton
          onClick={() => setOpen((p) => !p)}
          className="border mt-2"
        >
          {hasChildren && (
            <ChevronDown
              className={`transition ${open ? "rotate-180" : ""}`}
              size={16}
            />
          )}
          {Icon && <Icon />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      )}

      {hasChildren && open && (
        <div className="mr-4 border-r pr-4">
          <SidebarItems items={item.children!} level={level + 1} />
        </div>
      )}
    </SidebarMenuItem>
  );
};

export default function SideBarItem() {
  const pathname = usePathname();

  const getItems = () => {
    if (pathname.startsWith("/admin")) {
      return adminSideBarItem;
    }
    if (pathname.startsWith("/secretary")) {
      return secretarySideBarItem;
    }
    if (pathname.startsWith("/customer")) {
      return customerSideBarItem;
    }
    return [];
  };

  const items = getItems();

  return <SidebarItems items={items} />;
}
