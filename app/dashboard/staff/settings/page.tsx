import React from "react";
import StaffSettingForm from "./_components/StaffSettingForm";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

const StaffDashboardSetting = async () => {
  const session = await getServerSession(authOptions);

  const staffId = session?.user.id;

  const staffData = await prisma.user.findUnique({
    where: {
      id: staffId,
    },
    include: {
      bookings: {
        where: {
          status: "COMPLETED",
        },
      },
    },
  });

  return <StaffSettingForm staffData={staffData} />;
};

export default StaffDashboardSetting;
