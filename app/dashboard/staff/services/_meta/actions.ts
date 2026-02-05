"use server";

import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";

export async function getStaffServices() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const staff = await prisma.staffMember.findFirst({
    where: { userId: session.user.id },
  });

  if (!staff) throw new Error("Staff not found");

  const services = await prisma.serviceStaff.findMany({
    where: { staffId: staff.id },
    include: {
      service: true,
    },
  });

  const pendingRequests = await prisma.staffServiceChangeRequest.findMany({
    where: {
      staffId: staff.id,
      status: "PENDING",
    },
  });

  return { services, pendingRequests };
}

type RequestServiceChangeInput = {
  serviceId: string;
  requestedActive: boolean;
  requestedDuration: number;
  requestedPrice: number;
  requestedName: string;
  requestedDescription: string;
  rejectionReason: string;
};

export async function requestServiceChangeAction(
  input: RequestServiceChangeInput,
) {
  try {
    const session = await getServerSession(authOptions);

    // change authorization
    if (!session?.user?.id) {
      return { success: false, message: "دسترسی ندارید" };
    }

    // پیدا کردن استاف
    const staff = await prisma.staffMember.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
    });

    if (!staff) {
      return { success: false, message: "همکار یافت نشد" };
    }

    const {
      requestedActive,
      requestedDuration,
      requestedName,
      requestedPrice,
      serviceId,
      rejectionReason,
      requestedDescription,
    } = input;

    const existingRequest = await prisma.staffServiceChangeRequest.findFirst({
      where: {
        staffId: staff.id,
        serviceId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      return { success: false, message: "درخواست قبلاً ثبت شده است" };
    }

    // ثبت درخواست
    await prisma.staffServiceChangeRequest.create({
      data: {
        staffId: staff.id,
        serviceId: input.serviceId,
        status: "PENDING",
        rejectionReason,
        requestedActive,
        requestedDescription,
        requestedDuration,
        requestedName,
        requestedPrice,
      },
    });

    return { success: true, message: "درخواست با موفقیت ثبت شده است" };
  } catch (error) {
    console.error(error);

    return { success: false, message: "خطای سرور" };
  }
}

export async function getServiceDetails(serviceId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        message: "دسترسی ندارید",
      };
    }

    // پیدا کردن استاف یا مالک بیزنس
    const staff = await prisma.staffMember.findFirst({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      select: {
        businessId: true,
      },
    });

    const businessOwner = await prisma.business.findFirst({
      where: {
        ownerId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    const businessId = staff?.businessId || businessOwner?.id;

    if (!businessId) {
      return {
        success: false,
        message: "شما به این سرویس دسترسی ندارید",
      };
    }

    const serviceDetail = await prisma.service.findFirst({
      where: {
        id: serviceId,
        businessId,
      },
    });

    if (!serviceDetail) {
      return {
        success: false,
        message: "سرویس یافت نشد",
      };
    }

    return {
      success: true,
      serviceDetail,
    };
  } catch (error) {
    console.error("getServiceDetails error:", error);
    return {
      success: false,
      message: "دریافت اطلاعات سرویس با خطا مواجه شد",
    };
  }
}
