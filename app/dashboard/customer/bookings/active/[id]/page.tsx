import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import React from "react";
import BookingReceipt from "../_components/BookingReceipt";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const BookingReceiptPage = async ({ params }: Props) => {
  const { id: bookingId } = await params;
  const session = await getServerSession(authOptions);

  console.log({ bookingId });

  // دریافت دیتای کامل رزرو
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId, deletedAt: null },
    include: {
      service: true,
      business: {
        include: {
          owner: {
            omit: {
              passwordHash: true,
            },
          },
        },
      },
      staff: true,
      customer: true,
      payments: true,
    },
  });
  if (!booking || session?.user?.id !== booking.customerId) {
    redirect("/dashboard/customer");
  }

  return <BookingReceipt booking={booking as any} />;
};

export default BookingReceiptPage;
