import React from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  MoreVertical,
  Calendar,
  CreditCard,
  MessageSquare,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// دیتای نمونه برای نمایش
const mockData = {
  today: [
    {
      id: 1,
      type: "booking",
      title: "رزرو نوبت جدید",
      desc: "سارا احمدی برای خدمت «مشاوره تخصصی پوست» در ساعت ۱۶:۰۰ نوبت رزرو کرد.",
      time: "۱۰ دقیقه پیش",
      read: false,
      icon: Calendar,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: 2,
      type: "payment",
      title: "پرداخت موفق",
      desc: "مبلغ ۴۵۰,۰۰۰ تومان برای فاکتور #۴۰۲ با موفقیت دریافت شد.",
      time: "۲ ساعت پیش",
      read: false,
      icon: CreditCard,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: 3,
      type: "message",
      title: "پیام جدید از پشتیبانی",
      desc: "کارشناس پشتیبانی به تیکت شما پاسخ داده است.",
      time: "۳ ساعت پیش",
      read: true,
      icon: MessageSquare,
      color: "text-indigo-600 bg-indigo-50",
    },
  ],
  yesterday: [
    {
      id: 4,
      type: "alert",
      title: "هشدار: ظرفیت تکمیل شده",
      desc: "ظرفیت رزرو روز سه‌شنبه برای خدمات «کوتاه کردن مو» به اتمام رسیده است.",
      time: "دیروز، ۱۸:۳۰",
      read: true,
      icon: AlertCircle,
      color: "text-amber-600 bg-amber-50",
    },
  ],
  older: [
    {
      id: 5,
      type: "system",
      title: "بروزرسانی سیستم",
      desc: "سیستم رزرو مارکت به نسخه ۲.۴.۰ ارتقا یافت.",
      time: "۳ روز پیش",
      read: true,
      icon: Bell,
      color: "text-slate-600 bg-slate-100",
    },
  ],
};

const NotificationsPage = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">اعلان‌ها</h1>
          <p className="text-sm text-slate-500">
            شما <span className="font-semibold text-slate-800">۲</span> اعلان
            خوانده نشده دارید.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <CheckCheck size={16} />
            علامت‌گذاری همه خوانده شد
          </Button>
          {/* Settings icon placeholder */}
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <MoreVertical size={18} />
          </Button>
        </div>
      </div>

      {/* Tabs / Filter */}
      <div className="flex items-center gap-6 border-b border-slate-200 mb-6">
        <button className="pb-3 border-b-2 border-indigo-600 text-indigo-600 font-medium text-sm transition-colors">
          همه اعلان‌ها
        </button>
        <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors">
          خوانده نشده
        </button>
        <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors">
          آرشیو شده
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-8">
        {/* Group: Today */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            امروز
          </h3>
          <div className="space-y-3">
            {mockData.today.map((item) => (
              <NotificationCard key={item.id} {...item} />
            ))}
          </div>
        </div>

        {/* Group: Yesterday */}
        {mockData.yesterday.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              دیروز
            </h3>
            <div className="space-y-3">
              {mockData.yesterday.map((item) => (
                <NotificationCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}

        {/* Group: Older */}
        {mockData.older.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              قدیمی‌تر
            </h3>
            <div className="space-y-3">
              {mockData.older.map((item) => (
                <NotificationCard key={item.id} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination / Load More Placeholder */}
      <div className="mt-10 flex justify-center">
        <Button variant="ghost" className="text-slate-500 hover:text-slate-900">
          مشاهده تاریخچه قدیمی‌تر
          <ChevronLeft size={16} className="me-1" />
        </Button>
      </div>
    </div>
  );
};

// Sub-component for individual notification card
interface NotificationCardProps {
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: any;
  color: string;
}

const NotificationCard = ({
  title,
  desc,
  time,
  read,
  icon: Icon,
  color,
}: NotificationCardProps) => {
  return (
    <div
      className={`
        relative group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200
        ${read ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm" : "bg-indigo-50/40 border-indigo-100 shadow-sm hover:shadow-md"}
      `}
    >
      {/* Unread Indicator Line */}
      {!read && (
        <div className="absolute right-0 top-4 bottom-4 w-1 bg-indigo-500 rounded-l-full" />
      )}

      {/* Icon */}
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex justify-between items-start mb-1">
          <h4
            className={`text-sm font-semibold truncate ${read ? "text-slate-700" : "text-slate-900"}`}
          >
            {title}
          </h4>
          <span className="text-xs text-slate-400 whitespace-nowrap me-2">
            {time}
          </span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-2">
          {desc}
        </p>

        {/* Action Buttons (Visible on Hover) */}
        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
            مشاهده جزئیات
          </button>
          <span className="text-slate-300">•</span>
          <button className="text-xs font-medium text-slate-400 hover:text-red-600 flex items-center gap-1">
            <Trash2 size={12} />
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
