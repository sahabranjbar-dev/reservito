"use client";
import PersianCalendar from "@/app/business/[...slug]/_components/PersianCalendar";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { getBookingByDate } from "../_meta/actions";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const BookingCalender = () => {
  const session = useSession();

  const [date, setDate] = useState<string>("");

  const { data, isPending, mutateAsync } = useMutation({
    mutationFn: async (date: string) => {
      const result = await getBookingByDate(date);
      if (!result.success) {
        toast.error(result.error);
        return result.success;
      }
      return result.data;
    },
  });

  return (
    <div>
      <PersianCalendar
        onDateSelect={(date) => {
          setDate(date);
          mutateAsync(date);
        }}
        selectedDate={date}
      />

      {isPending ? (
        <div>
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        date
      )}
    </div>
  );
};

export default BookingCalender;
