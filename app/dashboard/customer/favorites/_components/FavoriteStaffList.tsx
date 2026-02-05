import React from "react";
import {
  Star,
  Award,
  Clock,
  Mail,
  Phone,
  Heart,
  Building,
  Users,
} from "lucide-react";
import Image from "next/image";

interface FavoriteStaffListProps {
  staff: Array<{
    id: string;
    name: string;
    avatar?: string;
    specialty: string;
    experience: string;
    rating: number;
    business: {
      id: string;
      businessName: string;
    };
    isAvailable: boolean;
    nextAvailableSlot?: Date;
  }>;
}

export default function FavoriteStaffList({ staff }: FavoriteStaffListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {staff.map((staffMember) => (
          <div
            key={staffMember.id}
            className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors"
          >
            {/* Staff Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                {staffMember.avatar ? (
                  <Image
                    width={100}
                    height={100}
                    src={staffMember.avatar || "/images/placeholder.png"}
                    alt={staffMember.name}
                    className="h-16 w-16 rounded-full border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl">
                    {staffMember.name.charAt(0)}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-gray-900">
                    {staffMember.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {staffMember.specialty}
                  </p>

                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(staffMember.rating)
                              ? "text-amber-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="mr-1 text-xs font-medium">
                      {staffMember.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Heart className="h-5 w-5 text-rose-600 fill-current" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-4 w-4 ml-2" />
                <span>{staffMember.experience} سال سابقه</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Building className="h-4 w-4 ml-2" />
                <span>{staffMember.business.businessName}</span>
              </div>

              {staffMember.nextAvailableSlot && (
                <div className="flex items-center text-sm text-emerald-600">
                  <Clock className="h-4 w-4 ml-2" />
                  <span>
                    نوبت بعدی:{" "}
                    {new Date(staffMember.nextAvailableSlot).toLocaleDateString(
                      "fa-IR",
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Status & Actions */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${
                      staffMember.isAvailable ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  />
                  <span className="text-sm">
                    {staffMember.isAvailable ? "آماده خدمت‌رسانی" : "مشغول"}
                  </span>
                </div>

                <div className="flex space-x-2 space-x-reverse">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Phone className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <button
                  className={`flex-1 py-2 rounded-lg font-medium text-sm ${
                    staffMember.isAvailable
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!staffMember.isAvailable}
                >
                  رزرو نوبت
                </button>
                <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50">
                  پروفایل
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {staff.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">کاربر مورد علاقه‌ای اضافه نکرده‌اید</p>
          <button className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium">
            جستجوی کارکنان
          </button>
        </div>
      )}
    </div>
  );
}
