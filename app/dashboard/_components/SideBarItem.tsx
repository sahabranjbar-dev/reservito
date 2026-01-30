"use client";

import { useEffect, useMemo, useState } from "react";
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
  Banknote,
  BarChart3,
  Bell,
  BookmarkCheck,
  Calendar,
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Globe,
  HelpCircle,
  Home,
  Inbox,
  LayoutDashboard,
  ListChecks,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Settings,
  Shield,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  UserRound,
  Wallet,
  Wrench,
  type LucideIcon,
  FileText,
  Percent,
  Image,
} from "lucide-react";
import { Role } from "@/constants/enums";

// ==========================================
// Types
// ==========================================

type SidebarItem = {
  title: string;
  url?: string;
  icon: LucideIcon;
  disabled?: boolean;
  children?: SidebarItem[];
};

type UserRoleType = "admin" | "business" | "staff" | "customer";

// ==========================================
// Sidebar Configuration (Refined & Professional)
// ==========================================

// --- 1. Business Owner (مدیر کسب‌وکار) ---
const businessSideBarItems: SidebarItem[] = [
  { title: "داشبورد مدیریتی", url: "/", icon: LayoutDashboard },

  {
    title: "نوبت‌دهی و تقویم",
    icon: Calendar,
    children: [
      { title: "تقویم رزروها", url: "/bookings/calendar", icon: Calendar },
      { title: "لیست رزروها", url: "/bookings/list", icon: ClipboardList },
      { title: "لیست انتظار", url: "/bookings/waiting", icon: CalendarClock },
    ],
  },
  {
    title: "مدیریت مشتریان",
    icon: Users,
    children: [
      { title: "لیست مشتریان", url: "/customers", icon: Users },
      { title: "نظرات و امتیازات", url: "/customers/reviews", icon: Star },
      {
        title: "پیام‌های مشتریان",
        url: "/customers/messages",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "منابع و خدمات",
    icon: Package,
    children: [
      {
        title: "خدمات و قیمت‌ها",
        url: "/resources/services",
        icon: ListChecks,
      },
      { title: "مدیریت پرسنل", url: "/resources/staff", icon: UserRound },
      { title: "شیفت‌بندی", url: "/resources/shifts", icon: CalendarClock },
    ],
  },
  {
    title: "مالی و حسابداری",
    icon: Wallet,
    children: [
      { title: "تراکنش‌ها", url: "/finance/transactions", icon: CreditCard },
      { title: "صورتحساب‌ها", url: "/finance/invoices", icon: FileText }, // Assuming FileText is imported or use ClipboardList
      { title: "کدهای تخفیف", url: "/finance/discounts", icon: Banknote },
      { title: "تسویه حساب‌ها", url: "/finance/settlements", icon: Wallet },
    ],
  },
  {
    title: "گزارشات",
    icon: BarChart3,
    children: [
      { title: "گزارش فروش", url: "/reports/sales", icon: BarChart3 },
      { title: "گزارش عملکرد", url: "/reports/performance", icon: Trophy },
    ],
  },
];

// --- 2. Customer (مشتری) ---
const customerSideBarItems: SidebarItem[] = [
  { title: "داشبورد", url: "/", icon: Home },
  { title: "رزروهای فعال", url: "/bookings/active", icon: CalendarCheck },
  { title: "تاریخچه رزروها", url: "/bookings/history", icon: CalendarClock },
  { title: "علاقه‌مندی‌ها", url: "/favorites", icon: BookmarkCheck },
  {
    title: "کیف پول و پرداخت",
    icon: Wallet,
    children: [
      { title: "تراکنش‌ها", url: "/wallet/transactions", icon: CreditCard },
      { title: "کارت‌ها", url: "/wallet/cards", icon: CreditCard },
    ],
  },
  { title: "پیام‌ها", url: "/messages", icon: Inbox },
  { title: "پشتیبانی", url: "/support", icon: HelpCircle },
  { title: "تنظیمات پروفایل", url: "/settings", icon: Settings },
];

// --- 3. Staff (پرسنل) ---
const staffSideBarItems: SidebarItem[] = [
  { title: "داشبورد پرسنلی", url: "/", icon: Home },
  { title: "تقویم کاری من", url: "/schedule", icon: Calendar },
  { title: "نوبت‌های من", url: "/appointments", icon: CalendarCheck },
  {
    title: "خدمات من",
    icon: ListChecks,
    children: [
      { title: "لیست خدمات", url: "/services", icon: ListChecks },
      { title: "تاریخچه شیفت‌ها", url: "/shifts-history", icon: CalendarClock },
    ],
  },
  {
    title: "درآمدها",
    icon: Wallet,
    children: [
      { title: "کیف پول", url: "/finance/wallet", icon: Wallet },
      { title: "عملکرد من", url: "/finance/performance", icon: Trophy },
    ],
  },
  { title: "پیام‌ها", url: "/messages", icon: Inbox },
  { title: "تنظیمات حساب", url: "/settings", icon: Settings },
];

// --- 4. Admin (مدیر سیستم) ---
const adminSideBarItems: SidebarItem[] = [
  { title: "داشبورد مدیریت", url: "/", icon: LayoutDashboard },
  {
    title: "مدیریت کاربران",
    icon: Users,
    children: [
      { title: "همه کاربران", url: "/users/all", icon: Users },
      { title: "مدیران سیستم", url: "/users/admins", icon: Shield },
    ],
  },
  {
    title: "مدیریت کسب‌وکارها",
    icon: Globe,
    children: [
      { title: "لیست کسب‌وکارها", url: "/businesses", icon: Globe },
      {
        title: "تایید صلاحیت",
        url: "/businesses/approvals",
        icon: ShieldCheck,
      },
      {
        title: "دسته‌بندی‌ها",
        url: "/businesses/categories",
        icon: ListChecks,
      },
    ],
  },
  {
    title: "مالی و کمیسیون",
    icon: Banknote,
    children: [
      {
        title: "تراکنش‌های سیستم",
        url: "/finance/transactions",
        icon: CreditCard,
      },
      { title: "کمیسیون‌ها", url: "/finance/commissions", icon: Percent }, // Need to import Percent if needed, or use Banknote
      { title: "تسویه با بیزنس‌ها", url: "/finance/settlements", icon: Wallet },
    ],
  },
  {
    title: "مدیریت محتوا",
    icon: FileText, // Assuming FileText, or use ClipboardList
    children: [
      { title: "بنرها و اسلایدرها", url: "/content/banners", icon: Image }, // Need Image icon
      { title: "وبلاگ و اخبار", url: "/content/blog", icon: FileText },
    ],
  },
  { title: "تیکت‌های پشتیبانی", url: "/support-tickets", icon: HelpCircle },
  { title: "تنظیمات سیستمی", url: "/settings", icon: Settings },
];

// Fix for missing icons in admin
// I will map generic icons if specific ones aren't there to prevent build errors,
// but usually you just add them to imports.
// For this response, I will assume standard lucide icons or add them to imports above.

// ==========================================
// Helper Functions
// ==========================================

function getUserRole(session: any): UserRoleType {
  if (session?.user?.roles?.includes(Role.SUPER_ADMIN)) {
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

// ==========================================
// Hooks
// ==========================================

function useSidebarConfig() {
  const { data: session, status } = useSession();

  return useMemo(() => {
    if (status === "loading")
      return { items: [], role: "customer" as UserRoleType };

    const role = getUserRole(session);

    let items: SidebarItem[] = [];
    switch (role) {
      case "admin":
        items = adminSideBarItems;
        break;
      case "business":
        items = businessSideBarItems;
        break;
      case "staff":
        items = staffSideBarItems;
        break;
      default:
        items = customerSideBarItems;
        break;
    }

    return { items, role };
  }, [session, status]);
}

// ==========================================
// Sub-Components
// ==========================================

interface SidebarItemProps {
  item: SidebarItem;
  pathname: string;
  role: UserRoleType;
}

function SidebarItemComponent({ item, pathname, role }: SidebarItemProps) {
  const Icon = item.icon;
  const hasChildren = !!item.children?.length;
  const basePath = `/dashboard/${role}`;

  // Helper to check URL activity
  const isUrlActive = (url: string) => {
    if (url === "/") return pathname === basePath;
    return pathname.startsWith(`${basePath}${url}`);
  };

  // Determine if the parent item is active
  const isParentActive = useMemo(() => {
    if (hasChildren) {
      return item.children!.some(
        (child) => child.url && isUrlActive(child.url),
      );
    }
    return !!item.url && isUrlActive(item.url);
  }, [item, pathname, role, basePath, hasChildren, isUrlActive]);

  // Collapsible state
  const defaultOpen = hasChildren && isParentActive;
  const [open, setOpen] = useState<boolean>(() => defaultOpen);

  // Render Parent with Children
  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title} isActive={isParentActive}>
              <Icon />
              <div className="flex flex-1 justify-between items-center">
                <span className="truncate">{item.title}</span>
                <ChevronRight
                  className={cn(
                    "ml-2 h-4 w-4 transition-transform duration-200 ltr:rotate-0 rtl:-rotate-180",
                    open && "ltr:rotate-90 rtl:rotate-90",
                  )}
                />
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children!.map((sub) => {
                const subUrl = sub.url;
                const isSubActive = subUrl ? isUrlActive(subUrl) : false;
                const SubIcon = sub.icon;

                return (
                  <SidebarMenuSubItem key={`${item.title}-${sub.title}`}>
                    <SidebarMenuSubButton asChild isActive={isSubActive}>
                      <Link
                        href={`${basePath}${subUrl}`}
                        className="flex justify-start items-center gap-2"
                      >
                        {SubIcon && <SubIcon className="h-4 w-4" />}
                        <span>{sub.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    );
  }

  // Render Simple Item
  const itemUrl = `${basePath}${item.url}`;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        isActive={isParentActive}
        disabled={item.disabled}
        className={cn(item.disabled && "opacity-50 pointer-events-none")}
      >
        <Link href={itemUrl} className="flex items-center gap-2">
          {Icon && <Icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

// ==========================================
// Main Sidebar Component
// ==========================================

export default function AppSidebar() {
  const pathname = usePathname();
  const { items, role } = useSidebarConfig();

  if (!items.length) return null;

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarItemComponent
          key={item.title}
          item={item}
          pathname={pathname}
          role={role}
        />
      ))}
    </SidebarMenu>
  );
}
