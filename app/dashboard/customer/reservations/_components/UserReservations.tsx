"use client";

import { StatusBadge } from "@/components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookingStatus } from "@/constants/enums";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/common";
import { Calendar, Clock, MapPin, MoreVertical, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// تایپ‌ها
type Booking = {
  id: string;
  status: BookingStatus;
  totalPrice: number;
  startTime: Date;
  business: {
    businessName: string;
    address: string | null;
    slug: string;
  };
  service: {
    name: string;
    duration: number;
  };
  payments: {
    amount: number;
    bookingId: string;
  }[];
};

interface Props {
  bookings: Booking[];
}

const UserReservations = ({ bookings }: Props) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );

  const handleCancel = (bookingId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این رزرو را کنسل کنید؟")) {
      return;
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const config: Record<BookingStatus, { label: string; color: string }> = {
      CONFIRMED: {
        label: "تایید شده",
        color: "bg-green-100 text-green-700 border-green-200",
      },
      AWAITING_CONFIRMATION: {
        label: "در انتظار تائید",
        color: "bg-amber-100 text-amber-700 border-amber-200",
      },
      AWAITING_PAYMENT: {
        label: "در انتظار پرداخت",
        color: "bg-amber-100 text-amber-700 border-amber-200",
      },
      COMPLETED: {
        label: "تکمیل شده",
        color: "bg-slate-100 text-slate-600 border-slate-200",
      },
      CANCELED: {
        label: "لغو شده",
        color: "bg-red-50 text-red-600 border-red-100",
      },
      REJECTED: {
        label: "لغو شده",
        color: "bg-red-50 text-red-600 border-red-100",
      },
      NO_SHOW_CUSTOMER: {
        label: "لغو شده",
        color: "bg-red-50 text-red-600 border-red-100",
      },
      NO_SHOW_STAFF: {
        label: "لغو شده",
        color: "bg-red-50 text-red-600 border-red-100",
      },
    };
    const { label, color } =
      config[status as keyof typeof config] || config["CANCELED"];
    return (
      <Badge variant="outline" className={cn("font-bold", color)}>
        {label}
      </Badge>
    );
  };

  return (
    <Card className="m-4">
      {/* هدر و تب‌ها */}
      <CardTitle>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">رزروهای من</h2>
            <p className="text-slate-500 text-sm">
              لیست تمامی قرارهای ثبت شده شما
            </p>
          </div>

          {/* تب‌ها */}
          <div className="bg-slate-100 p-1 rounded-xl inline-flex">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === "upcoming"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              آینده ({activeTab === "upcoming" ? bookings.length : 0})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === "history"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              تاریخچه ({activeTab === "history" ? bookings.length : 0})
            </button>
          </div>
        </div>
      </CardTitle>

      <CardContent>
        {/* لیست رزروها */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {activeTab === "upcoming"
                ? "رزرو آینده‌ای ندارید"
                : "تاریخچه خالی است"}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {activeTab === "upcoming"
                ? "برای خدمات زیبایی یا پزشکی رزرو کنید."
                : "فعلاً رزروی انجام نشده است."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => {
              const payedAmount = booking.payments.find(
                (item) => item.bookingId === booking.id,
              )?.amount as number;
              return (
                <Card
                  key={booking.id}
                  className={cn(
                    "border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden",
                    booking.status === BookingStatus.CANCELED &&
                      "bg-slate-50 opacity-75",
                  )}
                >
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5">
                      {/* اطلاعات بیزنس و سرویس */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-lg">
                            {booking.business.businessName}
                          </h3>
                          <StatusBadge status={booking.status} />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Intl.DateTimeFormat("fa-IR", {
                              dateStyle: "long",
                            }).format(new Date(booking.startTime))}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Intl.DateTimeFormat("fa-IR", {
                              timeStyle: "short",
                            }).format(new Date(booking.startTime))}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            {booking.service.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="w-3 h-3" />
                          <span className="line-clamp-1 max-w-75">
                            {booking.business.address}
                          </span>
                        </div>
                      </div>

                      {/* قیمت و اکشن */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 w-full md:w-auto">
                        <div className="text-right">
                          <p className="text-xs text-slate-400 mb-1">
                            مبلغ پرداختی
                          </p>
                          {payedAmount !== booking.totalPrice && (
                            <span className="line-through">
                              {formatCurrency(booking.totalPrice)}
                            </span>
                          )}
                          <p className="font-bold text-slate-900 text-lg">
                            {formatCurrency(payedAmount)}{" "}
                            <span className="text-sm font-normal text-slate-500">
                              تومان
                            </span>
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 hover:bg-slate-50"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/dashboard/customer/reservations/confirmation?bookingId=${booking.id}`,
                                )
                              }
                            >
                              مشاهده رسید
                            </DropdownMenuItem>
                            {(booking.status === BookingStatus.CONFIRMED ||
                              booking.status ===
                                BookingStatus.AWAITING_CONFIRMATION) && (
                              <DropdownMenuItem
                                onClick={() => handleCancel(booking.id)}
                                className="text-red-600 focus:text-red-700"
                              >
                                <X className="w-4 h-4 mr-2" />
                                لغو رزرو
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserReservations;
