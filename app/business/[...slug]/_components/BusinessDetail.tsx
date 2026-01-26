"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  Star,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { getAvailableSlotsAction } from "../../_meta/actions";
import { getBusinessTypeOptions } from "../../_meta/utils";
import PersianCalendar from "./PersianCalendar"; // ایمپورت کامپوننت جدید
import { useRouter, useSearchParams } from "next/navigation";
import FavoriteButton from "@/app/dashboard/customer/bookmarks/_components/FavoriteButton";
import { useSession } from "next-auth/react";

// تایپ‌ها (بدون تغییر)
type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  depositRequired: boolean;
};

type Staff = {
  id: string;
  name: string;
  avatar: string | null;
};

type IFavorites = {
  businessId: string;
  userId: string;
  id: string;
};

type Business = {
  id: string;
  businessName: string;
  description: string | null;
  address: string | null;
  banner: string | null;
  logo: string | null;
  businessType: string;
  services: Service[];
  staffMembers: Staff[];
  slug: string;
  favorites: IFavorites[];
};

interface Props {
  business: Business;
}

const BusinessDetail = ({ business }: Props) => {
  const session = useSession();
  const userId = session.data?.user.id;

  const searchParams = useSearchParams();
  const { push } = useRouter();

  const serviceId = searchParams.get("serviceId") || "";
  const date = searchParams.get("date") || "";
  const time = searchParams.get("time") || "";

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    serviceId
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(date); // حالت فرمت YYYY-MM-DD
  const [selectedSlot, setSelectedSlot] = useState<string | null>(time);

  // دریافت اسلات‌ها (بدون تغییر)
  const { data: availableSlots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ["availableSlots", business.id, selectedDate, selectedServiceId],
    queryFn: async () => {
      if (!selectedDate || !selectedServiceId) return [];
      const response = await getAvailableSlotsAction({
        businessId: business.id,
        date: selectedDate,
        serviceId: selectedServiceId,
      });
      if (!response.success) return [];
      return response.slots;
    },
    enabled: !!selectedDate && !!selectedServiceId,
  });

  // هندل تغییر تاریخ از تقویم
  const handleDateSelect = (isoDate: string) => {
    setSelectedDate(isoDate);
    setSelectedSlot(null); // ریست زمان‌ها وقتی تاریخ عوض شد
  };

  const selectedService = business.services.find(
    (s) => s.id === selectedServiceId
  );
  const totalPrice = selectedService ? selectedService.price : 0;

  const handleBook = () => {
    if (!selectedServiceId || !selectedDate || !selectedSlot) return;

    const params = new URLSearchParams({
      businessId: business.id,
      serviceId: selectedServiceId,
      date: selectedDate,
      time: selectedSlot,
    });

    push(`/checkout?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 md:pb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ستون سمت چپ: اطلاعات و سرویس‌ها (بدون تغییر) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Hero & Info Sections (بدون تغییر از کد قبلی) */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <div className="relative h-64 md:h-80 w-full bg-slate-100">
              <Image
                src={business.banner || "/images/placeholder.png"}
                alt={business.businessName}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
              <div className="absolute top-4 right-4 md:hidden">
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/80 backdrop-blur rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 md:p-8 relative z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center gap-2 my-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-slate-700 border-slate-200"
                    >
                      {getBusinessTypeOptions().find(
                        (t) => t.id === business.businessType
                      )?.titleFa || business.businessType}
                    </Badge>
                    <div className="flex justify-end items-center gap-2">
                      {/* <div className="flex items-center text-yellow-500 text-sm font-bold">
                        <Star className="w-4 h-4 fill-yellow-500 mr-1" />
                        4.8
                      </div> */}
                      <div>
                        <FavoriteButton
                          businessId={business.id}
                          initialIsFavorite={business?.favorites?.some(
                            (item) => item.userId === userId
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                    {business.businessName}
                  </h1>
                  <p className="text-slate-500 flex items-center gap-1 mt-4">
                    <MapPin className="w-4 h-4 shrink-0" />
                    {business.address}
                  </p>
                  <div className="my-4">
                    <Button
                      variant={"link"}
                      className="underline"
                      rightIcon={<ExternalLink />}
                    >
                      مسیر یابی از روی نقشه
                    </Button>
                  </div>
                </div>

                {business.logo && (
                  <div className="hidden md:block w-28 h-28 rounded-2xl border-4 border-white shadow-lg bg-white overflow-hidden">
                    <Image
                      src={business.logo}
                      alt="Logo"
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              <div className="prose prose-slate max-w-none">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  درباره ما
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {business.description ||
                    "توضیحی برای این کسب‌وکار ثبت نشده است."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 px-2">
              انتخاب خدمت
              <span className="m-2 text-red-400">*</span>
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {business.services.length > 0 ? (
                business.services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={cn(
                      "bg-white p-5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer transition-all hover:border-indigo-100 hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4",
                      selectedServiceId === service.id &&
                        "border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/30"
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900">
                          {service.name}
                        </h3>
                        {service.depositRequired && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1 py-0 text-amber-600 border-amber-200"
                          >
                            بیعانه لازم است
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {service.duration} دقیقه
                        </span>
                        {service.description && (
                          <span className="hidden md:inline text-slate-300">
                            |
                          </span>
                        )}
                        {service.description && (
                          <span className="line-clamp-1">
                            {service.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-left font-bold text-slate-900 text-lg">
                      {new Intl.NumberFormat("fa-IR").format(service.price)}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        تومان
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 bg-white rounded-2xl border border-slate-100">
                  خدمتی ثبت نشده است
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ستون سمت راست: کارت رزرو */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-6 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-indigo-50/20 border border-slate-100 overflow-hidden">
              <div className="p-6 bg-slate-50 border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900">
                  جزئیات رزرو
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* 1. انتخاب تاریخ (جایگزین شده با تقویم شمسی) */}
                <div className="space-y-3">
                  <label className="text-slate-500 text-lg font-semibold tracking-wider">
                    ۱. انتخاب تاریخ
                  </label>
                  {/* اینجا کامپوننت تقویم جایگزین می‌شود */}
                  <div className="p-4">
                    <PersianCalendar
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                    />
                  </div>
                </div>

                {/* 2. انتخاب زمان */}
                {selectedDate && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex justify-between items-end">
                      <label className="text-slate-500 text-lg font-semibold tracking-wider">
                        ۲. انتخاب زمان
                      </label>
                      <span className="text-xs text-slate-400">
                        زمان به ساعت محلی تهران
                      </span>
                    </div>

                    {isLoadingSlots ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
                      </div>
                    ) : availableSlots && availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map(({ status, staffCount, time }) => (
                          <button
                            key={time}
                            disabled={status !== "available" || staffCount < 1}
                            onClick={() =>
                              status === "available" && setSelectedSlot(time)
                            }
                            className={cn(
                              "h-10 rounded-lg text-sm font-medium transition-all border relative overflow-hidden group",
                              status === "available"
                                ? "bg-white border-slate-200 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50"
                                : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed line-through select-none"
                            )}
                          >
                            <span
                              className={cn("relative z-10", {
                                "text-white":
                                  status === "available" &&
                                  selectedSlot === time,
                              })}
                            >
                              {time}
                            </span>
                            {status !== "available" && (
                              <XCircle className="absolute inset-0 m-auto w-4 h-4 text-slate-200 opacity-0 group-hover:opacity-100" />
                            )}
                            {status === "available" &&
                              selectedSlot === time && (
                                <div className="absolute inset-0 bg-indigo-600 text-white flex items-center justify-center">
                                  {time}
                                </div>
                              )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-sm text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
                        زمان خالی در این تاریخ یافت نشد.
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* 3. خلاصه و دکمه (بدون تغییر) */}
                <div className="space-y-4 sticky bottom-2 left-0">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">خدمت انتخابی:</span>
                    <span className="font-bold text-slate-900">
                      {selectedService ? selectedService.name : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-slate-900">
                      مبلغ قابل پرداخت:
                    </span>
                    <span className="font-extrabold text-indigo-600">
                      {new Intl.NumberFormat("fa-IR").format(totalPrice)}
                    </span>
                  </div>

                  <Button
                    className="w-full h-12 text-base rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      !selectedServiceId || !selectedDate || !selectedSlot
                    }
                    onClick={handleBook}
                  >
                    ادامه فرآیند رزرو
                  </Button>
                  <p className="text-center text-[10px] text-slate-400 mt-2">
                    با ثبت رزرو، قوانین کسب‌وکار را می‌پذیرید.
                  </p>
                </div>
              </div>
            </div>

            {/* Information Card (بدون تغییر) */}
            <div className="bg-indigo-900 rounded-2xl p-6 text-indigo-100 shadow-lg hidden lg:block">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                پشتیبانی
              </h4>
              <p className="text-sm opacity-80 mb-4">
                اگر سوالی دارید می‌توانید مستقیماً با واحد پشتیبانی این مرکز
                تماس بگیرید.
              </p>
              <Button
                variant="secondary"
                className="w-full bg-white text-indigo-900 hover:bg-indigo-50 font-bold"
              >
                تماس با مرکز
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetail;
