import React from "react";
import StaffServicesList from "./_components/StaffServiceList";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

const StaffDashboardServices = async () => {
  const session = await getServerSession(authOptions);

  const staffId = session?.user?.id;
  if (!staffId) throw new Error("Unauthorized");
  const staff = await prisma.staffMember.findFirst({
    where: { isActive: true, userId: staffId },
    include: {
      services: {
        include: {
          service: true,
        },
      },
      bookings: true,
      exceptions: true,
      serviceChangeRequests: true,
      schedules: true,
    },
  });

  return <StaffServicesList staff={staff as any} />;
};

export default StaffDashboardServices;
