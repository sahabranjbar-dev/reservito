// components/dashboard/StatsOverview.tsx
import React from "react";
import { CalendarCheck, Clock, CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";

interface StatsOverviewProps {
  stats: {
    totalBookings: number;
    upcomingBookings: number;
    completedBookings: number;
    canceledBookings: number;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: "کل نوبت‌ها",
      value: stats.totalBookings,
      icon: CalendarCheck,
      color: "bg-blue-200",
    },
    {
      title: "پیش رو",
      value: stats.upcomingBookings,
      icon: Clock,
      color: "bg-amber-200",
    },
    {
      title: "تکمیل شده",
      value: stats.completedBookings,
      icon: CheckCircle,
      color: "bg-emerald-200",
    },
    {
      title: "لغو شده",
      value: stats.canceledBookings,
      icon: XCircle,
      color: "bg-rose-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stat.value.toLocaleString("fa-IR")}
              </p>
            </div>
            <div className={clsx("p-3 rounded-full", stat.color)}>
              <stat.icon
                className={stat.color
                  .replace("bg-", "text-")
                  .replace("-200", "-500")}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
