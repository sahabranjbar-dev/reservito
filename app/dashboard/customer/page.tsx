import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CustomerDashboard from "./_components/CustomerDashboard";

const CustomerDashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // 1. دریافت رزروهای کاربر (برای تاریخچه و بعدی)
  const bookings = await prisma.booking.findMany({
    where: {
      customerId: session.user.id,
      deletedAt: null,
    },
    include: {
      business: true,
      service: true,
      staff: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  // 2. محاسبه آمار
  const now = new Date();
  const upcomingBookings = bookings.filter((b) => new Date(b.startTime) > now);
  const pastBookings = bookings.filter((b) => new Date(b.startTime) <= now);

  // کل پول خرج شده (فقط رزروهای تکمیل شده یا کنسل نشده)
  const totalSpent = bookings
    .filter((b) => b.financialStatus !== "UNPAID")
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // رزرو بعدی که زودترین است
  const nextBooking = upcomingBookings.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  )[0];

  return (
    <CustomerDashboard
      nextBooking={nextBooking}
      pastBookings={pastBookings}
      totalSpent={totalSpent}
      totalBookings={bookings.length}
    />
  );
};

export default CustomerDashboardPage;
