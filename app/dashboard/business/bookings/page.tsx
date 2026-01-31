import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BusinessBookings from "./_components/BusinessBookings";

const BusinessUserBookingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // دریافت رزروهای بیزنی که این کاربر صاحبش است
  const business = session.user.business;

  if (!business) {
    // اگر بیزنی نیست
    return <div className="p-6">بیزنی پیدا نشد.</div>;
  }

  const bookings = await prisma.booking.findMany({
    where: {
      businessId: business.id,
      deletedAt: null,
    },
    include: {
      customer: true,
      service: true,
      staff: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  return <BusinessBookings bookings={bookings as any} />;
};

export default BusinessUserBookingsPage;
