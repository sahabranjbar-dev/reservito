"use server";

import prisma from "@/utils/prisma";
import { revalidatePath } from "next/cache";

export async function getMessage(id: string) {
  try {
    if (!id) {
      return { success: false, message: "آیدی پیام یافت نشد." };
    }
    const message = await prisma.contactMessage.findUnique({
      where: { id },
      include: {
        ContactMessageReply: {
          include: {
            user: {
              select: { fullName: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!message) {
      return { success: false, message: "پیام وجود ندارد." };
    }

    return { success: true, data: message };
  } catch (error) {
    console.error("Error fetching message:", error);
    return { success: false, message: "خطا در دریافت اطلاعات پیام." };
  }
}

export async function replyToMessage(
  messageId: string,
  replyText: string,
  userId: string,
) {
  try {
    if (!messageId || !replyText.trim()) {
      return { success: false, message: "لطفاً متن پاسخ را وارد کنید." };
    }

    // ایجاد پاسخ جدید
    await prisma.contactMessageReply.create({
      data: {
        messageId,
        reply: replyText,
        repliedBy: userId, // آیدی کاربری که در حال حاضر لاگین است (باید از سشن گرفته شود)
      },
    });

    // تغییر وضعیت پیام اصلی به REPLIED اگر NEW بود
    await prisma.contactMessage.update({
      where: { id: messageId },
      data: { status: "REPLIED" },
    });

    // بازسازی کش صفحه لیست پیام‌ها
    revalidatePath("/dashboard/admin/contact-messages");

    return { success: true, message: "پاسخ با موفقیت ارسال شد." };
  } catch (error) {
    console.error("Error replying to message:", error);
    return { success: false, message: "خطا در ارسال پاسخ." };
  }
}

export async function updateMessageStatus(
  messageId: string,
  status: "NEW" | "REPLIED" | "CLOSED",
) {
  try {
    await prisma.contactMessage.update({
      where: { id: messageId },
      data: { status },
    });

    revalidatePath("/dashboard/admin/contact-messages");

    return { success: true, message: "وضعیت پیام تغییر کرد." };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false, message: "خطا در تغییر وضعیت." };
  }
}
