"use server";

import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";

export async function getTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return { success: true, data: tickets };
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return { success: false, message: "خطا در دریافت لیست تیکت‌ها." };
  }
}

export async function getTicket(id: string) {
  try {
    if (!id) {
      return { success: false, message: "آیدی تیکت یافت نشد." };
    }

    // فرض: مدل TicketMessage وجود دارد که مربوط به این تیکت است
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            fullName: true,
            phone: true,
            email: true,
            avatar: true,
          },
        },
        messages: {
          include: {
            ticket: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return { success: false, message: "تیکت وجود ندارد." };
    }

    return { success: true, data: ticket };
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return { success: false, message: "خطا در دریافت اطلاعات تیکت." };
  }
}

export async function replyToTicket(
  ticketId: string,
  content: string,
  senderId: string,
) {
  try {
    if (!ticketId || !content.trim()) {
      return { success: false, message: "لطفاً متن پاسخ را وارد کنید." };
    }

    // ایجاد پاسخ جدید در جدول TicketMessage
    await prisma.ticketMessage.create({
      data: {
        ticketId,
        content,
        senderId, // آیدی کاربری که لاگین است
        isAdmin: true, // فرض اینکه کاربر لاگین شده ادمین است
      },
    });

    // تغییر وضعیت تیکت اگر CLOSED بود -> OPEN شود، اگر PENDING بود -> REPLIED (یا بماند)
    // در اینجا ما اگر بسته بود بازش میکنیم، اگر باز بود بقا نمیشود.
    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
    if (ticket?.status === "CLOSED") {
      await prisma.ticket.update({
        where: { id: ticketId },
        data: { status: "OPEN" },
      });
    }

    revalidatePath("/dashboard/admin/support-tickets");
    revalidatePath(`/dashboard/admin/support-tickets/${ticketId}`);

    return { success: true, message: "پاسخ ثبت شد." };
  } catch (error) {
    console.error("Error replying to ticket:", error);
    return { success: false, message: "خطا در ثبت پاسخ." };
  }
}

export async function updateTicketStatus(
  ticketId: string,
  status: "OPEN" | "PENDING" | "CLOSED",
) {
  try {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status, closedAt: status === "CLOSED" ? new Date() : null },
    });

    revalidatePath("/dashboard/admin/support-tickets");

    return { success: true, message: "وضعیت تیکت تغییر کرد." };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { success: false, message: "خطا در تغییر وضعیت." };
  }
}
