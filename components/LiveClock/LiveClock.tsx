"use client";

import { convertToFarsiDigits, getFullDate } from "@/utils/common";
import { CalendarFold, Clock8 } from "lucide-react";
import React, { useEffect, useState } from "react";
import DynamicClockIcon from "../DynamicClockIcon/DynamicClockIcon";

interface LiveClockProps {
  format24h?: boolean; // 24 ساعته یا 12 ساعته
  showSeconds?: boolean; // نمایش ثانیه
  className?: string;
}

const LiveClock: React.FC<LiveClockProps> = ({
  format24h = true,
  showSeconds = true,
  className,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // آپدیت هر ثانیه

    return () => clearInterval(interval);
  }, []);

  const pad = (num: number) => String(num).padStart(2, "0");

  const hours = format24h
    ? pad(currentTime.getHours())
    : pad(currentTime.getHours() % 12 || 12);
  const minutes = pad(currentTime.getMinutes());
  const seconds = pad(currentTime.getSeconds());

  const ampm = !format24h ? (currentTime.getHours() >= 12 ? "PM" : "AM") : "";

  // تاریخ شمسی (فارسی)
  const date = getFullDate(currentTime);

  return (
    <div className="grid grid-cols-1 justify-items-center p-1.5  rounded-md text-nowrap">
      <div className="flex justify-between w-1/2 items-start font-semibold">
        <DynamicClockIcon
          currentTime={currentTime}
          size={16}
          className="mt-0.75"
        />
        {convertToFarsiDigits(hours)}:{convertToFarsiDigits(minutes)}
        {showSeconds && `:${convertToFarsiDigits(seconds)}`} {ampm}
      </div>
      <div className="text-sm text-gray-600 mt-1 flex justify-center items-center gap-2">
        <CalendarFold size={16} />
        {date}
      </div>
    </div>
  );
};

export default LiveClock;
