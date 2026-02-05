import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import { authOptions } from "@/utils/authOptions";
import { getFullDateTime } from "@/utils/common";
import prisma from "@/utils/prisma";

import { Calendar, Clock, MapPin, NotebookText, Phone } from "lucide-react";

import { StatusBadge } from "@/components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import GoBackButton from "@/components/GoBackButton/GoBackButton";
import { BookingStatus } from "@/constants/enums";
import AddNote from "./_components/AddNote";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomerProfilePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.business?.id) notFound();

  const businessId = session.user.business.id;
  const customerId = (await params).id;

  const customer = await prisma.user.findFirst({
    where: {
      id: customerId,
      bookings: {
        some: { businessId },
      },
    },
    select: {
      id: true,
      fullName: true,
      phone: true,
      avatar: true,
      createdAt: true,
      isActive: true,
      bookings: {
        where: { businessId },
        orderBy: { createdAt: "desc" },
        include: {
          service: { select: { name: true, duration: true } },
          business: {
            select: {
              businessName: true,
            },
          },
        },
      },
    },
  });

  if (!customer) notFound();

  const totalBookings = customer.bookings.length;
  const completedBookings = customer.bookings.filter(
    (b) => b.status === BookingStatus.COMPLETED,
  ).length;

  const noShowCount = customer.bookings.filter(
    (b) =>
      b.status === BookingStatus.NO_SHOW_CUSTOMER ||
      b.status === BookingStatus.NO_SHOW_STAFF,
  ).length;

  const lastBooking = customer.bookings[0];

  const getInternalNote = () => {
    const notesArray = [];

    for (let index = 0; index < customer.bookings.length; index++) {
      const element = customer.bookings[index];
      if (!element.internalNotes) continue;
      notesArray.push({ id: element.id, note: element.internalNotes });
    }

    return notesArray;
  };

  const internalNotes = getInternalNote();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <GoBackButton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= Right Column ================= */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={customer.avatar || undefined} />
                <AvatarFallback>{customer.fullName?.[0] || "م"}</AvatarFallback>
              </Avatar>

              <h2 className="text-xl font-bold">
                {customer.fullName || "مشتری بدون نام"}
              </h2>

              <div className="flex items-center gap-1 text-sm text-slate-500 mt-2 underline">
                <Phone className="w-3 h-3" />
                <Link href={`tel:${customer.phone}`} dir="ltr">
                  {customer.phone}
                </Link>
              </div>

              <Separator className="my-4" />

              <div className="w-full space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>عضو از</span>
                  <span>{getFullDateTime(customer.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>وضعیت</span>
                  <Badge variant={customer.isActive ? "default" : "secondary"}>
                    {customer.isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">
                خلاصه تعامل با این کسب‌وکار
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>تعداد نوبت‌ها</span>
                <span className="font-bold">{totalBookings}</span>
              </div>
              <div className="flex justify-between">
                <span>نوبت‌های انجام‌شده</span>
                <span>{completedBookings}</span>
              </div>
              <div className="flex justify-between">
                <span>عدم حضور</span>
                <span>{noShowCount}</span>
              </div>
              {lastBooking && (
                <div className="flex justify-between">
                  <span>آخرین مراجعه</span>
                  <span>{getFullDateTime(lastBooking.createdAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ================= Left Column ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking History */}
          <Card>
            <CardHeader>
              <CardTitle>تاریخچه نوبت‌ها (همین کسب‌وکار)</CardTitle>
            </CardHeader>
            <CardContent>
              {customer.bookings.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">
                  نوبتی ثبت نشده است
                </p>
              ) : (
                <div className="space-y-4">
                  {customer.bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 border rounded-lg flex justify-between"
                    >
                      <div>
                        <p className="font-medium">{booking.service.name}</p>
                        <div className="flex gap-4 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {booking.service.duration} دقیقه
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {getFullDateTime(booking.startTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {booking.business.businessName}
                          </span>
                        </div>
                      </div>

                      <StatusBadge status={booking.status as BookingStatus} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <CardTitle>یادداشت داخلی مدیر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded">
                این یادداشت‌ها فقط برای بهبود ارائه خدمات هستند و نباید شامل
                اطلاعات شخصی یا قضاوت غیرحرفه‌ای باشند.
              </div>
              {/* Placeholder */}
              {internalNotes.length ? (
                <div>
                  {internalNotes.map((item) => (
                    <div
                      key={item?.id}
                      className="p-4 bg-yellow-50 border border-yellow-100 rounded text-sm"
                    >
                      {item?.note}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center gap-2 text-gray-500 border p-4 bg-yellow-50 rounded-2xl">
                  یادداشتی وجود ندارد
                  <NotebookText size={20} />
                </div>
              )}

              <AddNote />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
