"use client";

import React from "react";

const BookingsFilters = () => {
  return (
    <div className="flex gap-3 flex-wrap">
      <select className="border rounded-md px-3 py-2 text-sm">
        <option value="">همه وضعیت‌ها</option>
        <option value="PENDING">در انتظار</option>
        <option value="CONFIRMED">تأیید شده</option>
        <option value="CANCELLED">لغو شده</option>
        <option value="DONE">انجام شده</option>
      </select>

      <input type="date" className="border rounded-md px-3 py-2 text-sm" />

      <input
        placeholder="جستجو نام یا موبایل"
        className="border rounded-md px-3 py-2 text-sm"
      />
    </div>
  );
};

export default BookingsFilters;
