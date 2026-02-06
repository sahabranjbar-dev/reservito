import { StatusBadge } from "@/components";
import { cn } from "@/lib/utils";
import { getHour } from "@/utils/common";
import { AlertCircle, Calendar, Clock1, FileText, User } from "lucide-react";
import React from "react";

const StaffBookingCard = ({ item }: { item: any }) => {
  const startDate = new Date(item.startTime);
  const timeString = getHour(item?.startTime) + " - " + getHour(item?.endTime);

  const dateString = new Intl.DateTimeFormat("fa-IR", {
    month: "long",
    day: "numeric",
  }).format(startDate);

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
      <div
        className={cn(
          "absolute right-0 top-0 bottom-0 w-1.5",
          item.status === "CONFIRMED"
            ? "bg-emerald-500"
            : item.status === "PENDING"
              ? "bg-amber-500"
              : "bg-slate-300",
        )}
      />

      <div className="flex items-start justify-between gap-4 mr-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <span>{item.service.name}</span>
            <StatusBadge status={item?.status} />
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
              <Clock1 className="w-4 h-4 text-slate-400" />
              <span className="font-mono tracking-wide">{timeString}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{dateString}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-end text-sm min-w-35">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="font-medium">
              {item.customer.fullName || "نامشخص"}
            </span>
            <User className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-slate-500 text-xs">{item.customer.phone}</div>
          <div className="text-xs text-slate-400 mt-1">
            توسط {item?.staff.name}
          </div>
        </div>
      </div>

      {(item.customerNotes || item.cancelReason) && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          {item.status === "CANCELED" && item.cancelReason ? (
            <div className="flex items-start gap-2 text-red-600 bg-red-50 p-2 rounded-lg text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>دلیل لغو: {item.cancelReason}</span>
            </div>
          ) : item.customerNotes ? (
            <div className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg text-xs">
              <FileText className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <span className="leading-relaxed">{item.customerNotes}</span>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default StaffBookingCard;
