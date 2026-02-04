"use server";
import { BusinessRole } from "@/constants/enums";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function getStaffServiceChangeRequestDetails(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      session.user.business?.businessRole !== BusinessRole.OWNER
    ) {
      return { success: false, message: "دسترسی ندارید" };
    }

    if (!id) {
      return { success: false, message: "شناسه الزامی است" };
    }

    const changeRequests = await prisma.staffServiceChangeRequest.findUnique({
      where: {
        id,
      },
      include: {
        service: true,
        staff: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    if (!changeRequests) {
      return { success: false, message: "اطلاعاتی یافت نشد" };
    }

    return { success: true, changeRequests };
  } catch (error) {
    console.error(error);
    return { success: false, message: "خطای سرور" };
  }
}

export async function approveStaffServiceChangeRequest(id: string) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      session.user.business?.businessRole !== BusinessRole.OWNER
    ) {
      return { success: false, message: "دسترسی ندارید" };
    }

    if (!id) {
      return { success: false, message: "شناسه الزامی است" };
    }

    const changeRequest = await prisma.staffServiceChangeRequest.findUnique({
      where: { id },
    });

    if (!changeRequest) {
      return { success: false, message: "درخواست یافت نشد" };
    }

    if (changeRequest.status !== "PENDING") {
      return {
        success: false,
        message: "این درخواست قبلاً بررسی شده است",
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      const updateChangeRequest = await tx.staffServiceChangeRequest.update({
        where: { id },
        data: {
          status: "APPROVED",
          reviewedAt: new Date(),
          rejectionReason: null,
        },
      });

      const updateService = await tx.service.update({
        where: { id: changeRequest.serviceId },
        data: {
          ...(changeRequest.requestedPrice !== null && {
            price: changeRequest.requestedPrice,
          }),
          ...(changeRequest.requestedDuration !== null && {
            duration: changeRequest.requestedDuration,
          }),
          ...(changeRequest.requestedDescription !== null && {
            description: changeRequest.requestedDescription,
          }),
          ...(changeRequest.requestedName && {
            name: changeRequest.requestedName,
          }),
          ...(changeRequest.requestedActive !== null && {
            isActive: changeRequest.requestedActive,
          }),
        },
      });

      return { updateChangeRequest, updateService };
    });

    revalidatePath("/dashboard/business/resources/change-requests");

    return { success: true, result };
  } catch (error) {
    console.error(error);
    return { success: false, message: "خطای سرور" };
  }
}

export async function rejectStaffServiceChangeRequest(
  id: string,
  reason?: string,
) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      session.user.business?.businessRole !== BusinessRole.OWNER
    ) {
      return { success: false, message: "دسترسی ندارید" };
    }

    if (!id) {
      return { success: false, message: "شناسه الزامی است" };
    }

    const changeRequest = await prisma.staffServiceChangeRequest.findUnique({
      where: { id },
    });

    if (!changeRequest) {
      return { success: false, message: "درخواست یافت نشد" };
    }

    if (changeRequest.status !== "PENDING") {
      return {
        success: false,
        message: "این درخواست قبلاً بررسی شده است",
      };
    }

    await prisma.staffServiceChangeRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        rejectionReason: reason ?? "بدون توضیح",
        reviewedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/business/resources/change-requests");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "خطای سرور" };
  }
}
