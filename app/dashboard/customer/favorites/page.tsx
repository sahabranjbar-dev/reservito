// app/dashboard/favorites/page.tsx
import React from "react";
import FavoritesFilter from "./_components//FavoritesFilter";
import { Building, MessageCircle, Scissors, Users } from "lucide-react";
import FavoriteBusinessesGrid from "./_components/FavoriteBusinessesGrid";
import FavoriteServicesList from "./_components/FavoriteServicesList";
import FavoriteStaffList from "./_components/FavoriteStaffList";
import { getFavoritesData } from "./_meta/actions";

export const metadata = {
  title: "علاقه‌مندی‌های من - رزرو مارکت",
};

export default async function CustomerDashboardFavorites() {
  const [favoritesData] = await Promise.all([getFavoritesData()]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">کسب‌وکارها</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {favoritesData.stats.businesses.toLocaleString("fa-IR")}
                </p>
              </div>
              <div className="p-3 rounded-full bg-indigo-100">
                <Building className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">خدمات</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {favoritesData.stats.services.toLocaleString("fa-IR")}
                </p>
              </div>
              <div className="p-3 rounded-full bg-emerald-100">
                <Scissors className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">کارکنان</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {favoritesData.stats.staff.toLocaleString("fa-IR")}
                </p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">نظرات</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {favoritesData.stats.comments.toLocaleString("fa-IR")}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <FavoritesFilter />

        {/* Content based on active filter */}
        <div className="mt-8">
          {/* Businesses Grid */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                کسب‌وکارهای مورد علاقه
              </h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                مشاهده همه
              </button>
            </div>
            <FavoriteBusinessesGrid
              businesses={favoritesData.businesses as any}
            />
          </section>

          {/* Services List */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                خدمات مورد علاقه
              </h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                مشاهده همه
              </button>
            </div>
            <FavoriteServicesList services={favoritesData.services as any} />
          </section>

          {/* Staff List */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                کارکنان مورد علاقه
              </h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                مشاهده همه
              </button>
            </div>
            <FavoriteStaffList staff={favoritesData.staff as any} />
          </section>
        </div>
      </div>
    </div>
  );
}
