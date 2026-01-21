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
  { title: "سفارشات کاربران", url: "/users-reservations", icon: Home },
  { title: "تنظیمات", url: "/settings", icon: Settings },
];

const customerSideBarItem: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "سفارشات شما", url: "/reservations", icon: Home },
  { title: "تنظیمات", url: "/settings", icon: Settings },
];

const adminSideBarItem: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "کاربران", url: "/users", icon: Users },
  { title: "پیام‌ها", url: "/message", icon: Inbox },
  { title: "محصولات", url: "/products", icon: Store },
  {
    title: "مقالات",
    icon: Rss,
    children: [
      { title: "لیست مقالات", url: "/articles" },
      { title: "دسته‌بندی مقاله", url: "/articles/categories" },
      { title: "تگ‌های مقاله", url: "/articles/tags" },
    ],
  },
  { title: "برند‌ها", url: "/brands", icon: Tag },
  { title: "کد تخفیف", url: "/coupon-code", icon: Tag },
  { title: "دسته‌بندی‌ها", url: "/categories", icon: ChartColumnStacked },
  { title: "سفارش‌ها", url: "/orders", icon: ShoppingCart },
  { title: "نقش‌ها و دسترسی‌ها", url: "/roles", icon: ShieldBan },
  { title: "جشنواره‌ها و کمپین‌ها", url: "/campaign", icon: ShieldBan },
  {
    title: "خودرو",
    icon: ShieldBan,
    children: [
      { title: "برند خودرو", url: "/car/brands" },
      { title: "مدل خودرو", url: "/car/models" },
      { title: "سال خودرو", url: "/car/years" },
    ],
  },
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
        <SidebarMenuButton asChild>
          <Link href={`/${getRole()}${item.url}`}>
            {Icon && <Icon />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      ) : (
        <SidebarMenuButton onClick={() => setOpen((p) => !p)}>
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
    switch (pathname) {
      case "/admin":
        return adminSideBarItem;
      case "/secretary":
        return secretarySideBarItem;
      case "/customer":
        return customerSideBarItem;
      default:
        return [];
    }
  };

  const items = getItems();

  return <SidebarItems items={items} />;
}
