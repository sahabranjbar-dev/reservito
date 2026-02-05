import { BusinessType } from "@/constants/enums";
import { convertToEnglishDigits } from "@/utils/common";
import { z } from "zod";

/* =======================
   Password
======================= */
const passwordSchema = z
  .string()
  .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
  .regex(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ داشته باشد")
  .regex(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک داشته باشد")
  .regex(/[0-9]/, "رمز عبور باید حداقل یک عدد داشته باشد")
  .regex(/[^A-Za-z0-9]/, "رمز عبور باید حداقل یک کاراکتر خاص داشته باشد");

/* =======================
   Step 1: Account
======================= */
export const stepAccountSchema = z.object({
  ownerFullname: z
    .string()
    .min(3, "نام و نام خانوادگی حداقل باید ۳ کاراکتر باشد")
    .max(80, "نام و نام خانوادگی نمی‌تواند بیشتر از ۸۰ کاراکتر باشد"),

  phone: z
    .string({ error: "شماره موبایل الزامی است." })
    .min(1, "شماره موبایل الزامی است.")
    // تبدیل و پاکسازی قبل از اعتبارسنجی
    .transform((val) => {
      // حذف تمام فاصله‌ها و کاراکترهای اضافی
      const cleaned = val.replace(/\s+/g, "");
      // تبدیل اعداد فارسی به انگلیسی
      return convertToEnglishDigits(cleaned);
    })
    // اعتبارسنجی روی مقدار تبدیل شده
    .refine((val) => val.length === 11, {
      message: "شماره موبایل باید دقیقاً ۱۱ رقم باشد.",
    })
    .refine((val) => /^09\d{9}$/.test(val), {
      message: "شماره موبایل باید با ۰۹ شروع باشد و معتبر باشد.",
    }),

  password: passwordSchema,

  username: z
    .string()
    .min(3, "نام کاربری حداقل باید ۳ کاراکتر باشد")
    .max(80, "نام کاربری نمی‌تواند بیشتر از ۸۰ کاراکتر باشد"),
});

/* =======================
   Step 2: Business
======================= */
export const stepBusinessSchema = z.object({
  businessName: z
    .string()
    .min(3, "نام کسب‌وکار حداقل باید ۳ کاراکتر باشد")
    .max(120, "نام کسب‌وکار نمی‌تواند بیشتر از ۱۲۰ کاراکتر باشد"),

  businessType: z.enum(BusinessType, {
    error: "لطفاً نوع کسب‌وکار را انتخاب کنید",
  }),
});

/* =======================
   Step 3: Location
======================= */
export const stepLocationSchema = z.object({
  address: z
    .string()
    .min(10, "آدرس حداقل باید ۱۰ کاراکتر باشد")
    .max(500, "آدرس نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد"),
});

/* =======================
   Full Register Schema
======================= */
export const registerSchema = stepAccountSchema
  .merge(stepBusinessSchema)
  .merge(stepLocationSchema);
