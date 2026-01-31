"use client";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BookingStatus } from "@/constants/enums";
import { cn } from "@/lib/utils";
import {
  Ban,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  CircleCheck,
  Clock,
  UserMinus,
  XCircle,
} from "lucide-react";

interface Props {
  status: BookingStatus;
}

const StatusBadge = ({ status }: Props) => {
  const config: Record<
    BookingStatus,
    {
      label: string;
      className: string;
      icon: any;
      description: string;
      priority: number;
    }
  > = {
    PENDING: {
      label: "در انتظار تأیید",
      className:
        "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-300/70 shadow-[0_2px_8px_-2px_rgba(59,130,246,0.2)]",
      icon: CalendarClock,
      description: "در انتظار تأیید نهایی توسط کسب‌وکار",
      priority: 2,
    },
    CONFIRMED: {
      label: "تأیید شده",
      className:
        "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-300/70 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.2)]",
      icon: CircleCheck,
      description: "رزرو تأیید و آماده ارائه خدمت",
      priority: 3,
    },
    COMPLETED: {
      label: "تکمیل شده",
      className:
        "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-300/70 shadow-[0_2px_8px_-2px_rgba(100,116,139,0.2)]",
      icon: CalendarCheck,
      description: "خدمت با موفقیت ارائه شد",
      priority: 4,
    },
    CANCELED: {
      label: "لغو شده",
      className:
        "bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-300/70 shadow-[0_2px_8px_-2px_rgba(244,63,94,0.2)]",
      icon: Ban,
      description: "رزرو توسط کاربر لغو شد",
      priority: 5,
    },
    REJECTED: {
      label: "رد شده",
      className:
        "bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border-red-300/70 shadow-[0_2px_8px_-2px_rgba(239,68,68,0.2)]",
      icon: XCircle,
      description: "رزرو توسط کسب‌وکار رد شد",
      priority: 6,
    },
    NO_SHOW_CUSTOMER: {
      label: "عدم حضور مشتری",
      className:
        "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border-violet-300/70 shadow-[0_2px_8px_-2px_rgba(139,92,246,0.2)]",
      icon: UserMinus,
      description: "مشتری در زمان مقرر حاضر نشد",
      priority: 7,
    },
    NO_SHOW_STAFF: {
      label: "عدم حضور همکار",
      className:
        "bg-gradient-to-r from-fuchsia-50 to-pink-50 text-fuchsia-700 border-fuchsia-300/70 shadow-[0_2px_8px_-2px_rgba(217,70,239,0.2)]",
      icon: CalendarX,
      description: "همکار در زمان مقرر حاضر نشد",
      priority: 8,
    },
  };

  const { label, className, icon: Icon, description } = config[status];

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          <Badge
            variant="outline"
            className={cn(
              "gap-2 px-3 py-1.5 font-semibold transition-all duration-200 hover:scale-[1.02]",
              "rounded-lg border-2 backdrop-blur-sm",
              "relative overflow-hidden group",
              className,
            )}
          >
            {/* Decorative background effect */}
            <div className="absolute inset-0 bg-linear-to-r from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon with pulse animation for pending states */}
            <Icon
              className={cn(
                "w-3.5 h-3.5 relative z-10",
                status === "PENDING" && "animate-pulse",
              )}
            />

            {/* Text */}
            <span className="relative z-10">{label}</span>

            {/* Dot indicator */}
            <div
              className={cn(
                "absolute -top-1 -right-1 w-2 h-2 rounded-full",
                status === "PENDING" && "bg-blue-500 animate-ping",
                status === "CONFIRMED" && "bg-emerald-500",
                status === "COMPLETED" && "bg-slate-500",
                status === "CANCELED" && "bg-rose-500",
                status === "REJECTED" && "bg-red-500",
                status === "NO_SHOW_CUSTOMER" && "bg-violet-500",
                status === "NO_SHOW_STAFF" && "bg-fuchsia-500",
              )}
            />
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="font-medium text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StatusBadge;
