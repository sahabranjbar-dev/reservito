"use client"; // لازم است چون از استیت استفاده می‌کنیم

import { CheckCircle, Filter, XCircle } from "lucide-react";
import React, { useState } from "react";
import { HistoryBookingCard, HistoryCardProps } from "./HistoryBookingCard";

type FilterType = "ALL" | "COMPLETED" | "CANCELED";

export const HistoryListWrapper = ({
  bookings,
}: {
  bookings: HistoryCardProps[];
}) => {
  const [filter, setFilter] = useState<FilterType>("ALL");

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "ALL") return true;
    if (filter === "COMPLETED") return booking.status === "COMPLETED";
    if (filter === "CANCELED")
      return [
        "CANCELED",
        "REJECTED",
        "NO_SHOW_CUSTOMER",
        "NO_SHOW_STAFF",
      ].includes(booking.status);
    return true;
  });

  return (
    <div>
      {/* تب‌های فیلتر */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <Filter className="w-4 h-4 text-slate-400 mr-2" />

        <FilterButton
          label="همه"
          isActive={filter === "ALL"}
          onClick={() => setFilter("ALL")}
          count={bookings.length}
        />

        <FilterButton
          label="موفق"
          isActive={filter === "COMPLETED"}
          onClick={() => setFilter("COMPLETED")}
          icon={<CheckCircle size={14} />}
        />

        <FilterButton
          label="لغو شده / ناموفق"
          isActive={filter === "CANCELED"}
          onClick={() => setFilter("CANCELED")}
          icon={<XCircle size={14} />}
        />
      </div>

      {/* لیست نوبت‌ها */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm">
              هیچ رزروی در این دسته پیدا نشد.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <HistoryBookingCard
              key={booking.id}
              business={booking.business}
              endTime={booking.endTime}
              id={booking.id}
              service={booking.service}
              staff={booking.staff}
              startTime={booking.startTime}
              status={booking.status}
            />
          ))
        )}
      </div>
    </div>
  );
};

// کامپوننت کوچک برای دکمه فیلتر
const FilterButton = ({
  label,
  isActive,
  onClick,
  count,
  icon,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
  icon?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap
      ${
        isActive
          ? "bg-slate-800 text-white shadow-md"
          : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
      }
    `}
  >
    {icon}
    {label}
    {count !== undefined && (
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}
      >
        {count}
      </span>
    )}
  </button>
);
