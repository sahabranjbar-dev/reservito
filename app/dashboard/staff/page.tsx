// app/dashboard/staff/page.tsx
import React from "react";
import { format } from "date-fns";
import { faIR } from "date-fns/locale";
import { getStaffDashboardData } from "./_meta/actions";

const StatCard = ({ title, value }: { title: string; value: number }) => (
  <div className="rounded-xl border p-4">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const StaffDashboardPage = async () => {
  const { staff, todayBookings, stats, nextBooking } =
    await getStaffDashboardData();

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">سلام {staff.name} 👋</h1>
        <p className="text-sm text-muted-foreground">
          {staff.business.businessName}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="نوبت‌های امروز" value={stats.total} />
        <StatCard title="تایید شده" value={stats.confirmed} />
        <StatCard title="در انتظار" value={stats.total - stats.confirmed} />
      </div>

      {/* Next Booking */}
      {nextBooking && (
        <div className="rounded-xl border p-4 bg-muted/30">
          <h3 className="font-semibold mb-2">نوبت بعدی</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{nextBooking.customer.fullName}</p>
              <p className="text-sm text-muted-foreground">
                {nextBooking.service.name} •{" "}
                {format(nextBooking.startTime, "HH:mm", {
                  locale: faIR,
                })}
              </p>
            </div>
            <span className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
              {nextBooking.status}
            </span>
          </div>
        </div>
      )}

      {/* Today Bookings */}
      <div className="rounded-xl border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">نوبت‌های امروز</h3>
        </div>

        <div className="divide-y">
          {todayBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{booking.customer.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.service.name} • {format(booking.startTime, "HH:mm")}
                </p>
              </div>

              <span className="text-xs px-2 py-1 rounded bg-muted">
                {booking.status}
              </span>
            </div>
          ))}

          {todayBookings.length === 0 && (
            <p className="p-4 text-sm text-muted-foreground text-center">
              امروز نوبتی ثبت نشده 🌱
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
