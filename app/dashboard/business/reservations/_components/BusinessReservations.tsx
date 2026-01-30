"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  MoreVertical,
  Phone,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { updateBookingStatusAction } from "../_meta/actions";
import Image from "next/image";
import { BookingStatus } from "@/constants/enums";
import { StatusBadge } from "@/components";

// تایپ‌ها
type Booking = {
  id: string;
  status: BookingStatus;
  startTime: Date;
  customer: { name: string | null; phone: string; avatar: string | null };
  service: { name: string };
  staff: { name: string };
  totalPrice: number;
};

interface Props {
  bookings: Booking[];
}

const BusinessReservations = ({ bookings }: Props) => {
  const [filter, setFilter] = useState<
    "all" | "upcoming" | "completed" | "cancelled"
  >("all");
  const [search, setSearch] = useState("");

  // فیلتر کردن لیست
  const filteredBookings = bookings.filter((booking: any) => {
    // 1. فیلتر وضعیت
    const isUpcoming = new Date(booking.startTime) > new Date();
    const isCompleted = booking.status === "COMPLETED";
    const isCancelled = booking.status === "CANCELLED";

    let statusMatch = true;
    if (filter === "upcoming") statusMatch = isUpcoming;
    else if (filter === "completed") statusMatch = isCompleted;
    else if (filter === "cancelled") statusMatch = isCancelled;

    // 2. فیلتر سرچ
    const searchLower = search.toLowerCase();
    const searchMatch =
      booking.customer.name?.toLowerCase().includes(searchLower) ||
      booking.customer.phone.includes(search);

    return statusMatch && searchMatch;
  });

  // تغییر وضعیت (Action)
  const handleStatusChange = async (id: string, newStatus: any) => {
    // محافظت در برابر کلیک اشتباهی
    if (
      newStatus === "CANCELLED" &&
      !confirm("آیا مطمئن هستید که می‌خواهید رزرو را کنسل کنید؟")
    ) {
      return;
    }

    const res = await updateBookingStatusAction({
      bookingId: id,
      status: newStatus,
    });

    if (res.success) {
      toast.success(res.message);
      // در اینجا برای سادگی، دوباره صفحه ریلود نمی‌کنیم، در واقعیت باید invalidatePath زنید
      window.location.reload();
    } else {
      toast.error(res.error);
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const config: Record<
      string,
      { label: string; className: string; icon: any }
    > = {
      AWAITING_PAYMENT: {
        label: "در انتظار پرداخت",
        className: "bg-amber-100 text-amber-700 border-amber-200",
        icon: Clock,
      },
      AWAITING_CONFIRMATION: {
        label: "در انتظار تائید",
        className: "bg-amber-100 text-amber-700 border-amber-200",
        icon: Clock,
      },
      CONFIRMED: {
        label: "تایید شده",
        className: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle2,
      },
      COMPLETED: {
        label: "تکمیل شده",
        className: "bg-slate-100 text-slate-600 border-slate-200",
        icon: CheckCircle2,
      },
      CANCELLED: {
        label: "لغو شده",
        className: "bg-red-50 text-red-600 border-red-100",
        icon: XCircle,
      },
      NO_SHOW_CUSTOMER: {
        label: "عدم مراجعه مشتری",
        className: "bg-red-100 text-red-700 border-red-200",
        icon: X,
      },
      NO_SHOW_STAFF: {
        label: "عدم حضور همکار",
        className: "bg-red-100 text-red-700 border-red-200",
        icon: X,
      },
    };
    const {
      label,
      className,
      icon: Icon,
    } = config[status] || config["PENDING_CONFIRMATION"];
    return (
      <Badge variant="outline" className={cn("gap-1.5 font-bold", className)}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* هدر و فیلترها */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">مدیریت رزروها</h1>
          <p className="text-slate-500 text-sm">لیست تمامی رزروهای مشتریان</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="جستجوی نام یا شماره..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-64"
          />
          <Button variant="outline" className="whitespace-nowrap">
            فیلتر پیشرفته
          </Button>
        </div>
      </div>

      {/* تب‌ها */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: "all", label: "همه" },
          { id: "upcoming", label: "آینده" },
          { id: "completed", label: "تکمیل شده" },
          { id: "cancelled", label: "لغو شده" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={cn(
              "pb-3 px-2 text-sm font-medium transition-colors border-b-2",
              filter === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* لیست رزروها */}
      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">رزروی یافت نشد</h3>
          <p className="text-slate-500 text-sm">
            با تغییر فیلترها یا جستجو، دوباره تلاش کنید.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <Card
              key={booking.id}
              className="border-slate-100 hover:shadow-md transition-all overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4">
                  {/* اطلاعات مشتری و زمان */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold border border-indigo-100 shrink-0">
                      {booking.customer.avatar ? (
                        // تصویر پروفایل اگر باشد
                        <Image
                          width={100}
                          height={100}
                          src={
                            booking.customer.avatar || "/images/placeholder.png"
                          }
                          alt={booking.customer.name || "User"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        booking.customer.name?.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-base">
                          {booking.customer.name}
                        </h3>
                        <div className="flex items-center text-xs text-slate-500 gap-1">
                          <Phone className="w-3 h-3" />
                          {booking.customer.phone}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(booking.startTime).toLocaleDateString(
                            "fa-IR",
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(booking.startTime).toLocaleTimeString(
                            "fa-IR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0 border-slate-200"
                        >
                          {booking.service.name}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          با {booking.staff.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* وضعیت، قیمت و اکشن */}
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-lg">
                        {new Intl.NumberFormat("fa-IR").format(
                          booking.totalPrice,
                        )}
                        <span className="text-xs font-normal text-slate-500 mr-1">
                          تومان
                        </span>
                      </div>
                      <div className="mb-2">
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 hover:bg-slate-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center">
                        {booking.status === "AWAITING_CONFIRMATION" && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(booking.id, "CONFIRMED")
                              }
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                              تایید رزرو
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(booking.id, "CANCELLED")
                              }
                              className="text-red-600 focus:text-red-700"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              لغو رزرو
                            </DropdownMenuItem>
                          </>
                        )}
                        {booking.status === "CONFIRMED" && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(booking.id, "COMPLETED")
                              }
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2 text-slate-600" />
                              تکمیل شد
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(booking.id, "CANCELLED")
                              }
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              لغو رزرو
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem className="text-muted-foreground">
                          مشاهده جزئیات
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessReservations;
