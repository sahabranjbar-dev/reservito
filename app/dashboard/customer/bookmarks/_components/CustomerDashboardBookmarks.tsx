"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  Star,
  Trash2,
  Clock,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// تایپ‌ها (فرض بر اساس دیتای بیزنس شما)
type Business = {
  id: string;
  slug: string;
  businessName: string;
  businessType: string;
  banner: string | null;
  address: string | null;
  rating?: number;
};

interface Props {
  favorites: Business[];
  onRemove?: (id: string) => void; // تابع حذف از علاقه‌مندی‌ها
}

const CustomerDashboardBookmarks = ({ favorites, onRemove }: Props) => {
  const [removingId, setRemovingId] = useState<string | null>(null);

  // هندل کردن حذف (شبیه‌سازی)
  const handleRemove = (id: string) => {
    if (
      !confirm("آیا مطمئن هستید که این مرکز را از لیست علاقه‌مندی‌ها حذف کنید؟")
    ) {
      setRemovingId(id);
      setTimeout(() => {
        // در اینجا اکشن واقعی را صدا بزنید
        if (onRemove) onRemove(id);
        toast.success("از علاقه‌مندی‌ها حذف شد");
        setRemovingId(null);
      }, 500); // تاخیر مصنوعی برای انیمیشن
    }
  };

  // اگر لیست خالی است
  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4">
        <div className="w-24 h-24 bg-rose-50/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Heart className="w-10 h-10 text-rose-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          لیست علاقه‌مندی‌ها خالی است
        </h3>
        <p className="text-slate-500 max-w-sm text-center mb-8">
          مرکز خدمات مورد علاقه خود را جستجو کنید و با زدن دکمه قلب، به این لیست
          اضافه کنید.
        </p>
        <Link href="/businesses">
          <Button
            size="lg"
            className="shadow-xl shadow-rose-200 hover:shadow-rose-300 hover:bg-rose-600 hover:border-rose-600 text-rose-600 hover:text-white border-rose-200"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            جستجوی مراکز جدید
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* هدر */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            علاقه‌مندی‌های من
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            مراکزی که به سرعت دسترسی دارید
          </p>
        </div>
        <div className="hidden md:block">
          <Button variant="outline" size="sm" className="rounded-full">
            مدیریت سریع
          </Button>
        </div>
      </div>

      {/* گرید کارت‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((business) => {
          // رنگ‌بندی نرم دسته‌بندی‌ها (اختیاری برای زیبایی بیشتر)
          const categoryColors: Record<string, string> = {
            SALON: "bg-pink-50 text-pink-700 border-pink-100",
            GYM: "bg-blue-50 text-blue-700 border-blue-100",
            CLINIC: "bg-emerald-50 text-emerald-700 border-emerald-100",
            DEFAULT: "bg-slate-50 text-slate-700 border-slate-100",
          };
          const categoryColor =
            categoryColors[business.businessType] || categoryColors.DEFAULT;

          return (
            <Card
              key={business.id}
              className={cn(
                "group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-3xl",
                removingId === business.id && "opacity-50 scale-95 grayscale"
              )}
            >
              {/* دکمه حذف (شناور در هور - Clean Look) */}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault(); // جلوگیری از کلیک روی لینک کارت
                  handleRemove(business.id);
                }}
                className={cn(
                  "absolute top-3 left-2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur text-slate-400 hover:text-rose-600 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all",
                  removingId === business.id && "opacity-100"
                )}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>

              {/* بخش تصویر */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={business.banner || "/images/placeholder.png"}
                  alt={business.businessName}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* گریینت ملایم روی عکس برای خوانایی بهتر متن */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* دسته‌بندی */}
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className={categoryColor}>
                    {business.businessType}
                  </Badge>
                </div>
              </div>

              {/* بدنه کارت */}
              <div className="p-5 relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-bold text-lg truncate transition-colors">
                      {business.businessName}
                    </h3>
                    <div className="flex justify-between flex-row-reverse items-center gap-2 text-sm w-full mt-1">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3 h-3 fill-yellow-500" />
                        <span className="font-medium">
                          {business.rating || 4.5}
                        </span>
                      </div>
                      <span className="w-1 h-1 rounded-full" />
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3" />
                        {business.address}
                      </span>
                    </div>
                  </div>
                </div>

                {/* دکمه لینک به بیزنس */}
                <Link
                  href={`/business/${business.id}/${business.slug}`}
                  className="w-full block"
                  target="_blank"
                >
                  <Button
                    className="w-full"
                    leftIcon={
                      <ArrowLeft className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    }
                  >
                    مشاهده و رزرو
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerDashboardBookmarks;
