import React from "react";
import BookingsTable from "./_components/BookingsTable";
import BookingsFilters from "./_components/BookingsFilters";
import prisma from "@/utils/prisma";

const BookingsPage = async () => {
  const data = await prisma.booking.findMany({
    orderBy: {
      createdAt: "asc",
    },
    include: {
      customer: true,
      service: true,
      business: true,
    },
    take: 100,
  });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">نوبت‌ها</h1>
      </div>

      {/* Filters */}
      <BookingsFilters />

      {/* Table */}
      <BookingsTable data={data} />
    </div>
  );
};

export default BookingsPage;
