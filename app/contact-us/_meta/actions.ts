"use server";

import { convertToEnglishDigits } from "@/utils/common";
import prisma from "@/utils/prisma";
import z from "zod";

interface IData {
  fullName: string;
  phone: string;
  message: string;
  email?: string;
}

const schema = z.object({
  fullName: z.string({ error: "نام و نام‌خانوادگی الزامی است" }),
  message: z.string({ error: "پیام الزامی است" }),
  phone: z
    .string()
    .min(1, { error: "شماره موبایل الزامی است." })
    .length(11, { error: "شماره موبایل باید دقیقاً ۱۱ رقم باشد." })
    .trim()
    .transform(convertToEnglishDigits)
    .pipe(
      z
        .string()
        .regex(/^09\d{9}$/, { error: "شماره موبایل باید با ۰۹ شروع شود." }),
    ),
  email: z.string().nullable().optional(),
});

export async function sendContactMessage(data: IData) {
  try {
    const {
      success,
      data: parsedData,
      error,
    } = schema.safeParse({
      ...data,
      phone: convertToEnglishDigits(data?.phone),
    });

    if (!success) {
      return { success: false, message: error.message };
    }

    const { fullName, message, email, phone } = parsedData;

    const resolvedPhone = convertToEnglishDigits(phone);

    const contactMessage = await prisma.contactMessage.create({
      data: {
        fullName,
        message,
        phone: resolvedPhone,
        status: "NEW",
        email,
      },
    });

    if (!contactMessage) {
      return { success: false, message: "خطا در ایجاد پیام" };
    }

    return {
      success: true,
      message:
        "پیام شما با موفقیت ثبت شد، همکاران ما به زودی با شما تماس خواهند گرفت",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "خطای سرور" };
  }
}
