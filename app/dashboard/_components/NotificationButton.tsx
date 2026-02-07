import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils"; // فرض بر اینکه از شید‌سی‌ان یا تیل‌وین این را دارید
import {
  ArrowLeft,
  Bell,
  BellOff,
  Calendar,
  CheckCheck,
  MessageSquare,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { use, useState } from "react";

// یک ساختار دمو برای آیتم اعلان
const NotificationItem = ({
  title,
  description,
  time,
  icon: Icon,
  unread = false,
}: {
  title: string;
  description: string;
  time: string;
  icon: any;
  unread?: boolean;
}) => (
  <DropdownMenuItem
    className={cn(
      "flex flex-col items-start gap-2 p-4 cursor-pointer focus:bg-slate-50 border-b border-slate-100 last:border-0",
      unread && "bg-indigo-50/30",
    )}
    dir="rtl"
  >
    <div className="flex w-full items-start gap-3">
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          unread
            ? "bg-indigo-100 text-indigo-600"
            : "bg-slate-100 text-slate-500",
        )}
      >
        <Icon size={18} />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex justify-between items-start w-full">
          <p
            className={cn(
              "text-sm font-medium leading-none line-clamp-1 truncate overflow-hidden text-ellipsis",
              unread ? "text-slate-900" : "text-slate-600",
            )}
          >
            {title}
          </p>
          {unread && (
            <span className="h-2 w-2 rounded-full bg-indigo-600 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 text-ellipsis overflow-hidden">
          {description}
        </p>
        <span className="text-[10px] text-slate-400 font-medium mt-0.5">
          {time}
        </span>
      </div>
    </div>
  </DropdownMenuItem>
);

type UserRoleType = "admin" | "business" | "staff" | "customer";

function getActiveRoleFromPath(pathname: string): UserRoleType {
  const match = pathname.match(/^\/dashboard\/(admin|business|staff)/);
  return (match?.[1] as UserRoleType) ?? "customer";
}

const NotificationButton = () => {
  const [hasNotifications, setHasNotifications] = useState(false);

  const pathname = usePathname();

  const { push } = useRouter();

  const activeRole = getActiveRoleFromPath(pathname);

  const goToNotificationPage = () => {
    push(`/dashboard/${activeRole}/notifications`);
  };
  return (
    <>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-full hover:bg-slate-100 transition-colors"
          >
            <Bell className="h-5 w-5 text-slate-600 transition-transform group-hover:rotate-12" />

            {hasNotifications && (
              <span className="absolute top-2.5 end-2.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border-2 border-white"></span>
              </span>
            )}
            <span className="sr-only">اعلان‌ها</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-90 p-0 rounded-2xl shadow-xl shadow-slate-200/50 border-slate-100"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white/50 backdrop-blur-sm rounded-t-2xl">
            <DropdownMenuLabel className="text-sm font-bold text-slate-800 px-0 py-0">
              اعلان‌ها
            </DropdownMenuLabel>
            {hasNotifications && (
              <button className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                <CheckCheck size={12} />
                همه خوانده شد
              </button>
            )}
          </div>

          <ScrollArea className="h-75">
            <DropdownMenuGroup>
              {hasNotifications ? (
                <>
                  <NotificationItem
                    title="نوبت جدید ثبت شد"
                    description="کاربر علی رضایی برای خدمت کوتاه کردن مو نوبت علی رضایی برای خدمت کوتاه کردن مو نوبت علی رضایی برای خدمت کوتاه کردن مو نوبت    علی رضایی برای خدمت کوتاه کردن مو نوبت رزرو کرد."
                    time="۱۰ دقیقه پیش"
                    icon={Calendar}
                    unread
                  />
                  <NotificationItem
                    title="پیام جدید از پشتیبانی"
                    description="پاسخ تیکت شماره #۴۰۲۳ توسط کارشناس ارسال شد."
                    time="۲ ساعت پیش"
                    icon={MessageSquare}
                    unread
                  />
                  <NotificationItem
                    title="تایید هویت انجام شد"
                    description="مدارک کسب‌وکار شما با موفقیت تایید شد."
                    time="دیروز"
                    icon={CheckCheck}
                    unread={false}
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center mb-3 text-slate-300">
                    <BellOff size={28} />
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    اعلان جدیدی ندارید
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-50">
                    وقتی چیزی جدید اتفاق بیفتد، اینجا به شما اطلاع می‌دهیم.
                  </p>
                </div>
              )}
            </DropdownMenuGroup>
          </ScrollArea>

          {hasNotifications && (
            <div className="p-2 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
              <DropdownMenuItem
                onClick={goToNotificationPage}
                className="w-full cursor-pointer justify-center text-center text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl h-9 transition-colors"
              >
                مشاهده همه اعلان‌ها
                <ArrowLeft size={14} className="mr-1" />
              </DropdownMenuItem>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default NotificationButton;
