// components/favorites/FavoritesFilter.tsx
"use client";

import React, { useState } from "react";
import { Building, Scissors, Users, MessageCircle, Filter } from "lucide-react";

const filterOptions = [
  {
    id: "all",
    label: "همه",
    count: 24,
    icon: Filter,
    color: "gray",
  },
  {
    id: "businesses",
    label: "کسب‌وکارها",
    count: 12,
    icon: Building,
    color: "indigo",
  },
  {
    id: "services",
    label: "خدمات",
    count: 8,
    icon: Scissors,
    color: "emerald",
  },
  {
    id: "staff",
    label: "کارکنان",
    count: 3,
    icon: Users,
    color: "amber",
  },
  {
    id: "comments",
    label: "نظرات",
    count: 1,
    icon: MessageCircle,
    color: "blue",
  },
];

export default function FavoritesFilter() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const getColorClasses = (color: string, isActive: boolean) => {
    const baseClasses = "p-3 rounded-full";
    if (!isActive) return `${baseClasses} bg-gray-100 text-gray-500`;

    const colorMap: Record<string, string> = {
      indigo: "bg-indigo-100 text-indigo-600",
      emerald: "bg-emerald-100 text-emerald-600",
      amber: "bg-amber-100 text-amber-600",
      blue: "bg-blue-100 text-blue-600",
      gray: "bg-gray-100 text-gray-600",
    };

    return `${baseClasses} ${colorMap[color] || colorMap.gray}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Filter Tabs */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-4">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center px-4 py-3 rounded-lg border transition-all ${
                  activeFilter === filter.id
                    ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div
                  className={getColorClasses(
                    filter.color,
                    activeFilter === filter.id,
                  )}
                >
                  <filter.icon className="h-5 w-5" />
                </div>
                <span className="mr-3 font-medium">{filter.label}</span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    activeFilter === filter.id
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <label className="text-sm font-medium text-gray-700">
            مرتب‌سازی:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="recent">اضافه شده اخیر</option>
            <option value="name">نام (الف-ی)</option>
            <option value="popular">محبوب‌ترین</option>
            <option value="rating">بالاترین امتیاز</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6 relative">
        <input
          type="search"
          placeholder="جستجو در علاقه‌مندی‌ها..."
          className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-right"
        />
        <div className="absolute left-3 top-3">
          <Filter className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
