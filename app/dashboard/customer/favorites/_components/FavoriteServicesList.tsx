// components/favorites/FavoriteServicesList.tsx
import React from "react";
import {
  Clock,
  DollarSign,
  Star,
  Heart,
  Calendar,
  Building,
  Scissors,
} from "lucide-react";
import Image from "next/image";

interface FavoriteServicesListProps {
  services: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    business: {
      id: string;
      businessName: string;
      logo?: string;
    };
    rating: number;
    isAvailable: boolean;
  }>;
}

export default function FavoriteServicesList({
  services,
}: FavoriteServicesListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="divide-y divide-gray-200">
        {services.map((service) => (
          <div
            key={service.id}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Service Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {service.name}
                    </h3>

                    {service.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {service.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 ml-1" />
                        <span>{service.duration} دقیقه</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 ml-1" />
                        <span>
                          {service.price.toLocaleString("fa-IR")} تومان
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-4 w-4 ml-1 text-amber-400 fill-current" />
                        <span>{service.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Heart className="h-5 w-5 text-rose-600 fill-current" />
                  </button>
                </div>

                {/* Business Info */}
                <div className="flex items-center mt-4">
                  {service.business.logo ? (
                    <Image
                      width={100}
                      height={100}
                      src={service.business.logo || "/images/placeholder.png"}
                      alt={service.business.businessName}
                      className="h-8 w-8 rounded-lg ml-3"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center ml-3">
                      <Building className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {service.business.businessName}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className={`px-6 py-3 rounded-lg font-medium text-sm flex items-center justify-center ${
                    service.isAvailable
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!service.isAvailable}
                >
                  <Calendar className="h-4 w-4 ml-2" />
                  {service.isAvailable ? "رزرو نوبت" : "موجود نیست"}
                </button>

                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50">
                  مشاهده جزئیات
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {services.length === 0 && (
        <div className="text-center py-12">
          <Scissors className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">خدمت مورد علاقه‌ای اضافه نکرده‌اید</p>
          <button className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">
            جستجوی خدمات
          </button>
        </div>
      )}
    </div>
  );
}
