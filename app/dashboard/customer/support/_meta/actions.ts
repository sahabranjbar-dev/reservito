"use server";

import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";

// ایجاد تیکت جدید توسط مشتری
export async function createCustomerTicket(
  userId: string,
  subject: string,
  description: string,
  priority: "LOW" | "MEDIUM" | "HIGH",
) {
  try {
    if (!userId || !subject || !description) {
      return { success: false, message: "لطفاً تمام فیلدها را پر کنید." };
    }

    await prisma.ticket.create({
      data: {
        userId,
        subject,
        description,
        priority,
        status: "OPEN",
      },
    });

    revalidatePath("/dashboard/customer/support");
    return { success: true, message: "تیکت با موفقیت ثبت شد." };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { success: false, message: "خطا در ثبت تیکت." };
  }
}

// دریافت تیکت‌های اختصاصی مشتری
export async function getCustomerTickets(userId: string) {
  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // فقط آخرین پیام را برای پیش‌نمایش می‌گیریم
          include: {
            ticket: true,
          },
        },
      },
    });
    return { success: true, data: tickets };
  } catch (error) {
    return { success: false, message: "خطا در دریافت تیکت‌ها." };
  }
}

// ارسال پاسخ توسط مشتری (ادمین نیست پس isAdmin: false)
export async function replyTicket(
  ticketId: string,
  content: string,
  senderId: string,
) {
  try {
    if (!content.trim())
      return { success: false, message: "پیام نمی‌تواند خالی باشد." };

    await prisma.ticketMessage.create({
      data: {
        ticketId,
        content,
        senderId,
        isAdmin: false, // مهم: این کاربر است نه ادمین
      },
    });

    // اگر تیکت بسته بود، بازش می‌کنیم
    await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: "OPEN" },
    });

    revalidatePath("/dashboard/customer/support");
    return { success: true, message: "پاسخ ارسال شد." };
  } catch (error) {
    console.error("Error replying:", error);
    return { success: false, message: "خطا در ارسال پیام." };
  }
}

// دریافت جزئیات یک تیکت خاص برای مشتری
export async function getTicket(ticketId: string, userId: string) {
  try {
    if (!ticketId || !userId) {
      return { success: false, message: "دسترسی غیرمجاز یا اطلاعات ناقص است." };
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
        userId: userId, // امنیت: مطمئن شویم این تیکت متعلق به همین کاربر است
      },
      include: {
        user: {
          select: { fullName: true, phone: true },
        },
        messages: {
          include: {
            ticket: true,
          },
          orderBy: { createdAt: "asc" }, // مرتب‌سازی زمانی برای نمایش درست چت
        },
      },
    });

    if (!ticket) {
      return { success: false, message: "تیکت یافت نشد." };
    }

    return { success: true, data: ticket };
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    return { success: false, message: "خطا در دریافت اطلاعات تیکت." };
  }
}
