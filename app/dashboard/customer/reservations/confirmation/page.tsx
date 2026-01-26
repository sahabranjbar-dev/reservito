import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ReservationReceipt from "./_components/ReservationReceipt";

const ReservationConfirmationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ bookingId: string }>;
}) => {
  const { bookingId } = await searchParams;
  const session = await getServerSession(authOptions);

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

  // امنیت: بررسی که آیا این رزرو متعلق به کاربر است؟ (اختیاری، پیشنهاد می‌شود)
  if (!booking || session?.user?.id !== booking.customerId) {
    redirect("/dashboard/customer");
  }

  return <ReservationReceipt booking={booking as any} />;
};

export default ReservationConfirmationPage;
