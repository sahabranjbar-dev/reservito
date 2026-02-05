import { StatusBadge } from "@/components";
import { BookingStatus } from "@/constants/enums";
import { Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Activity } from "react";

interface UpcomingBookingsProps {
  bookings: Array<{
    id: string;
    business: {
      id: string;
      businessName: string;
      logo?: string;
    };
    service: {
      name: string;
      duration: number;
    };
    staff: {
      name: string;
    };
    startTime: Date;
    endTime: Date;
    status: BookingStatus;
  }>;
}

export default function UpcomingBookings({ bookings }: UpcomingBookingsProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fa-IR", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">نوبت‌های پیش رو</h2>
        <Link
          href="/dashboard/customer/bookings/active"
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3 space-x-reverse">
                  {booking.business.logo ? (
                    <Image
                      width={100}
                      height={100}
                      src={booking.business.logo}
                      alt={booking.business.businessName}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium text-gray-900">
                      {booking.service.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {booking.business.businessName}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 ml-1" />
                        {booking.service.duration} دقیقه
                      </span>
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 ml-1" />
                        {booking.staff.name}
                      </span>
                    </div>
                  </div>
                </div>

                <StatusBadge status={booking.status} />
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 ml-1" />
                  {formatDate(booking.startTime)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 ml-1" />
                  {formatTime(booking.startTime)} -{" "}
                  {formatTime(booking.endTime)}
                </div>
              </div>

              <div className="mt-4 flex space-x-2 space-x-reverse gap-4">
                <Link
                  href={`/dashboard/customer/bookings/receipt/${booking.id}`}
                  className="flex-1 text-center py-2 text-sm font-medium text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  جزئیات
                </Link>
                <Activity
                  mode={
                    booking.status === BookingStatus.PENDING
                      ? "visible"
                      : "hidden"
                  }
                >
                  <Link
                    href={`/dashboard/customer/bookings/active/${booking.id}`}
                    className="flex-1 text-center py-2 text-sm font-medium text-rose-600 border border-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    لغو نوبت
                  </Link>
                </Activity>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">هیچ نوبت پیش رو ندارید</p>
            <Link
              href="/business"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
            >
              رزرو نوبت جدید
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
