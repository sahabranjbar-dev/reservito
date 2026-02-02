"use server";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";

export async function getStaffList() {
  try {
    const session = await getServerSession(authOptions);

    const businessId = session?.user.business?.id;

    const staff = await prisma.staffMember.findMany({
      where: { businessId, isActive: true },
    });

    const resolvedStaffOption = staff?.map((item: any) => {
      return {
        ...item,
        id: item?.id,
        farsiTitle: item?.name,
      };
    });

    return { success: true, resolvedStaffOption };
  } catch (error) {
    console.error(error);
    return { success: false, message: "خطای سرور" };
  }
}

export async function getStaffExceptions({ staffId }: { staffId: string }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return { success: false, message: "دسترسی ندارید" };
    }

    const StaffExceptions = await prisma.staffException.findMany({
      where: {
        staffId,
      },
    });

    return { success: true, StaffExceptions };
  } catch (error) {
    console.error(error);
    return { success: false, message: "خطای سرور" };
  }
}
