import { Metadata } from "next";
import CustomerSettingForm from "./_components/CustomerSettingForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";

export const metadata: Metadata = {
  title: "تنظیمات پروفایل | رزرویتو",
};

const CustomerDashboardSettings = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { success: false, message: "دسترسی ندارید" };
  }

  const userId = session.user.id;

  const userInfo = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      roles: {
        select: {
          role: true,
        },
      },
    },
    omit: {
      passwordHash: true,
    },
  });
  return <CustomerSettingForm userInfo={userInfo} />;
};

export default CustomerDashboardSettings;
