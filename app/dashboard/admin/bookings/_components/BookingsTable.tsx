"use client";

import React from "react";
import BookingActions from "./BookingActions";
import { StatusBadge } from "@/components";
import { getFullDateTime } from "@/utils/common";

interface Props {
  data: any[];
}

const BookingsTable = ({ data }: Props) => {
  return (
    <div className="border rounded-lg overflow-hidden p-4">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-2 text-center">مشتری</th>
            <th className="p-2 text-center">سرویس</th>
            <th className="p-2 text-center">کسب‌وکار</th>
            <th className="p-2 text-center">تاریخ</th>
            <th className="p-2 text-center">وضعیت</th>
            <th className="p-2 text-center">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2 text-center">
                {item.customer?.fullName}
                <div className="text-xs text-muted-foreground">
                  {item?.customer?.phone}
                </div>
              </td>
              <td className="p-2 text-center">{item.service?.name}</td>
              <td className="p-2 text-center">{item.business?.businessName}</td>
              <td className="p-2 text-center">
                {getFullDateTime(item?.startTime)}
              </td>
              <td className="p-2 text-center">
                <StatusBadge status={item?.status} />
              </td>
              <td className="p-2 text-center">
                <BookingActions bookingId={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
