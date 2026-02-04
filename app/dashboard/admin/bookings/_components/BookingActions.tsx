"use client";

import React from "react";

interface Props {
  bookingId: string;
}

const BookingActions = ({ bookingId }: Props) => {
  return (
    <div className="flex justify-center gap-2">
      <button className="text-blue-600 text-xs">مشاهده</button>
      <button className="text-green-600 text-xs">تأیید</button>
      <button className="text-red-600 text-xs">لغو</button>
    </div>
  );
};

export default BookingActions;
