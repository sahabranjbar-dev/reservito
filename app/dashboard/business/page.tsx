import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Captions,
  TrendingUp,
  Users,
} from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const BusinessOwnerDashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const business = await prisma.business.findFirst({
    where: {
      ownerId: session.user.id,
    },
    select: {
      id: true,
      businessName: true,
      services: {
        where: { isActive: true },
        select: { id: true },
      },
      staffMembers: {
        where: { isActive: true, deletedAt: null },
        select: { id: true },
      },
      bookings: {
        select: {
          id: true,
          status: true,
          startTime: true,
          customer: {
            select: { fullName: true, phone: true, avatar: true },
          },
          service: {
            select: { name: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      },
    },
  });

  if (!business?.services.length) {
    redirect("/dashboard/business/setup");
  }

  const totalServices = business.services.length;
  const totalStaff = business.staffMembers.length;
  const allBookings = business.bookings;

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todaysBookings = allBookings.filter((b) => {
    const bookingDate = new Date(b.startTime);
    return bookingDate >= startOfDay && bookingDate <= endOfDay;
  });

  const upcomingBookings = allBookings
    .filter(
      (b) => new Date(b.startTime) > new Date() && b.status !== "CANCELED",
    )
    .slice(0, 5);

  const revenueData = [20, 45, 30, 60, 50, 75, 40];
  const maxRevenue = Math.max(...revenueData);

  return (
    <div className="space-y-8 p-6 pb-20">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="رزروهای امروز"
          value={todaysBookings.length}
          unit="عدد"
          icon={<Calendar className="h-4 w-4 text-blue-500" />}
          bg="bg-blue-500/10"
        />
        <StatCard
          title="پرسنل فعال"
          value={totalStaff}
          unit="نفر"
          icon={<Users className="h-4 w-4 text-indigo-500" />}
          bg="bg-indigo-500/10"
        />
        <StatCard
          title="خدمات ثبت شده"
          value={totalServices}
          unit="سرویس"
          icon={<Captions className="h-4 w-4 text-orange-500" />}
          bg="bg-orange-500/10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* لیست رزروهای بعدی (بخش بزرگتر) */}
        <Card className="col-span-1 md:col-span-4 border-slate-100 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">رزروهای آینده</CardTitle>
              <Link href="/dashboard/business/bookings">
                <Button variant="ghost" size="sm" className="text-xs">
                  مشاهده همه
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">رزرو آینده‌ای ندارید</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {booking.customer?.fullName?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm text-slate-900">
                          {booking.customer?.fullName}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          {booking.service?.name}
                          <span className="w-1 h-1 bg-slate-300 rounded-full" />
                          {new Date(booking.startTime).toLocaleTimeString(
                            "fa-IR",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          booking.status === "CONFIRMED"
                            ? "default"
                            : "secondary"
                        }
                        className={cn(
                          "text-xs",
                          booking.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                            : "bg-amber-100 text-amber-700 border-amber-200",
                        )}
                      >
                        {booking.status === "CONFIRMED"
                          ? "تایید شده"
                          : "در انتظار"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* نمودار درآمد (بخش باریک) - CSS Only Chart */}
        <Card className="col-span-1 md:col-span-3 border-slate-100 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">گزارش هفتگی درآمد</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end pb-6">
            <div className="flex items-end justify-between h-48 gap-2">
              {revenueData.map((value, index) => (
                <div
                  key={index}
                  className="w-full bg-slate-100 rounded-t-lg relative group hover:bg-indigo-50 transition-colors"
                >
                  {/* بار نمودار */}
                  <div
                    className="absolute bottom-0 w-full bg-indigo-500 rounded-t-lg group-hover:bg-indigo-600 transition-all"
                    style={{
                      height: `${(value / maxRevenue) * 100}%`,
                    }}
                  />
                  {/* تولتیپ ساده هنگام هاور */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity pointer-events-none">
                    {value}M تومان
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-slate-400">
              <span>ش</span>
              <span>ی</span>
              <span>د</span>
              <span>س</span>
              <span>چ</span>
              <span>پ</span>
              <span>ج</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// کامپوننت کمکی کارت آمار
function StatCard({
  title,
  value,
  unit,
  icon,
  bg,
}: {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm text-slate-600">{title}</CardTitle>
        <div className={cn("p-2 rounded-lg", bg)}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900">
            {typeof value === "number"
              ? new Intl.NumberFormat("fa-IR").format(value)
              : value}
            <span className="text-sm font-normal text-slate-500  mr-1">
              {unit}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BusinessOwnerDashboardPage;
