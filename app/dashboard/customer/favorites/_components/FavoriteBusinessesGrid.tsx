import { BusinessType } from "@/constants/enums";
import { Building, Heart, MapPin, MoreVertical, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface FavoriteBusinessesGridProps {
  businesses: Array<{
    id: string;
    businessName: string;
    businessType: BusinessType;
    description?: string;
    logo?: string;
    banner?: string;
    address?: string;
    rating: number;
    reviewCount: number;
    isOpen: boolean;
  }>;
}

const businessTypeLabels: Record<BusinessType, string> = {
  SALON: "آرایشگاه",
  GYM: "باشگاه",
  CLINIC: "کلینیک",
  BEAUTY: "زیبایی",
  EDUCATION: "آموزشی",
  SPORTS: "ورزشی",
  CAFE: "کافه",
  RESTAURANT: "رستوران",
  LAW: "حقوقی",
  DENTAL: "دندانپزشکی",
  VETERINARY: "دامپزشکی",
  CONSULTING: "مشاوره",
  OTHER: "سایر",
};

export default function FavoriteBusinessesGrid({
  businesses,
}: FavoriteBusinessesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {businesses.map((business) => (
        <div
          key={business.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Business Image */}
          <div className="relative h-48">
            {business.banner ? (
              <Image
                width={100}
                height={100}
                src={business.banner || "/images/placeholder.png"}
                alt={business.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-r from-indigo-500 to-purple-600" />
            )}

            {/* Logo */}
            <div className="absolute -bottom-6 right-6">
              {business.logo ? (
                <Image
                  width={100}
                  height={100}
                  src={business.logo || "/images/placeholder.png"}
                  alt={business.businessName}
                  className="h-16 w-16 rounded-xl border-4 border-white shadow-sm"
                />
              ) : (
                <div className="h-16 w-16 rounded-xl border-4 border-white shadow-sm bg-white flex items-center justify-center">
                  <Building className="h-8 w-8 text-indigo-600" />
                </div>
              )}
            </div>

            {/* Favorite Button */}
            <button className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50">
              <Heart className="h-5 w-5 text-rose-600 fill-current" />
            </button>
          </div>

          {/* Business Info */}
          <div className="p-6 pt-8">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {business.businessName}
                </h3>
                <span className="inline-block mt-1 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
                  {businessTypeLabels[business.businessType]}
                </span>
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(business.rating)
                        ? "text-amber-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="mr-2 text-sm font-medium text-gray-900">
                  {business.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({business.reviewCount} نظر)
              </span>
            </div>

            {/* Description */}
            {business.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {business.description}
              </p>
            )}

            {/* Address */}
            {business.address && (
              <div className="flex items-start text-sm text-gray-500 mb-4">
                <MapPin className="h-4 w-4 ml-1 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{business.address}</span>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center">
                <div
                  className={`h-2 w-2 rounded-full mr-2 ${
                    business.isOpen ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                <span className="text-sm">
                  {business.isOpen ? "باز است" : "بسته"}
                </span>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Link
                  href={`/business/${business.id}`}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  مشاهده
                </Link>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  رزرو
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
