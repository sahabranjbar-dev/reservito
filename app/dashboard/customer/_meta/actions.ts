import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";

export async function getDashboardData() {
  const authUser = await getServerSession(authOptions);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [upcomingBookings, recentBookings, favorites, stats] =
    await Promise.all([
      // Upcoming bookings (next 7 days)
      prisma.booking.findMany({
        where: {
          customerId: authUser?.user.id,
          startTime: {
            gte: new Date(),
            lte: new Date(new Date().setDate(new Date().getDate() + 7)),
          },
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
        include: {
          business: {
            select: {
              id: true,
              businessName: true,
              logo: true,
            },
          },
          service: {
            select: {
              name: true,
              duration: true,
            },
          },
          staff: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          startTime: "asc",
        },
        take: 3,
      }),

      // Recent bookings (last 30 days)
      prisma.booking.findMany({
        where: {
          customerId: authUser?.user.id,
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        include: {
          business: {
            select: {
              id: true,
              businessName: true,
              logo: true,
            },
          },
          service: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),

      // Favorite businesses
      prisma.favorite.findMany({
        where: {
          userId: authUser?.user.id,
        },
        include: {
          business: {
            select: {
              id: true,
              businessName: true,
              logo: true,
              businessType: true,
              address: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 4,
      }),

      // Stats
      prisma.$transaction([
        prisma.booking.count({
          where: { customerId: authUser?.user.id },
        }),
        prisma.booking.count({
          where: {
            customerId: authUser?.user.id,
            startTime: { gte: new Date() },
            status: { in: ["PENDING", "CONFIRMED"] },
          },
        }),
        prisma.booking.count({
          where: {
            customerId: authUser?.user.id,
            status: "COMPLETED",
          },
        }),
        prisma.booking.count({
          where: {
            customerId: authUser?.user.id,
            status: { in: ["CANCELED", "REJECTED"] },
          },
        }),
      ]),
    ]);

  return {
    upcomingBookings,
    recentBookings,
    favorites: favorites.map((f) => f.business),
    stats: {
      totalBookings: stats[0],
      upcomingBookings: stats[1],
      completedBookings: stats[2],
      canceledBookings: stats[3],
    },
  };
}
