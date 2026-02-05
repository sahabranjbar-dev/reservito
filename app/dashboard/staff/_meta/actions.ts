"use server";

import { getServerSession } from "next-auth";
import { startOfDay, endOfDay } from "date-fns";
import prisma from "@/utils/prisma";
import { authOptions } from "@/utils/authOptions";

export async function getStaffDashboardData() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const staff = await prisma.staffMember.findFirst({
    where: {
      userId: session.user.id,
      isActive: true,
    },
    include: {
      business: true,
    },
  });

  if (!staff) {
    throw new Error("Staff not found");
  }

  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const todayBookings = await prisma.booking.findMany({
    where: {
      staffId: staff.id,
      startTime: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
    orderBy: { startTime: "asc" },
    include: {
      service: true,
      customer: true,
    },
  });

  const confirmedCount = todayBookings.filter(
    (b) => b.status === "CONFIRMED",
  ).length;

  const nextBooking = todayBookings.find((b) => b.startTime > new Date());

  return {
    staff,
    todayBookings,
    stats: {
      total: todayBookings.length,
      confirmed: confirmedCount,
    },
    nextBooking,
  };
}
