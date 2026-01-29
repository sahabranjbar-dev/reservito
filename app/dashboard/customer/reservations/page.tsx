import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UserReservations from "./_components/UserReservations";

const UserReservationsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // دریافت لیست رزروهای کاربر
  const bookings = await prisma.booking.findMany({
    where: {
      customerId: session.user.id,
      deletedAt: null,
    },
    include: {
      business: {
        select: {
          id: true,
          businessName: true,
          address: true,
          slug: true,
        },
      },
      payments: true,
      discountUsages: true,
      service: {
        select: {
          name: true,
          duration: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <UserReservations bookings={bookings as any} />;
};

export default UserReservationsPage;
