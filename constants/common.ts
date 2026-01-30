import { UserRole } from "@/types/common";
import { BusinessType } from "./enums";

export const ROLE_LABELS_FA: Record<UserRole, string> = {
  SUPER_ADMIN: "ادمین",
  BUSINESS_OWNER: "مدیر کسب‌و‌کار",
  CUSTOMER: "مشتری",
  STAFF: "کارمند",
};

export const ROLE_LABELS_EN: Record<UserRole, string> = {
  SUPER_ADMIN: "admin",
  BUSINESS_OWNER: "business_owner",
  CUSTOMER: "customer",
  STAFF: "staff",
};

export const BUSINESS_TYPE: Record<BusinessType, string> = {
  [BusinessType.SALON]: "سالن آرایش",
  [BusinessType.BEAUTY]: "خدمات زیبایی پوست و مو",
  [BusinessType.GYM]: "باشگاه ورزشی",
  [BusinessType.SPORTS]: "مجموعه ورزشی",
  [BusinessType.CLINIC]: "کلینیک پزشکی",
  [BusinessType.DENTAL]: "کلینیک دندانپزشکی",
  [BusinessType.VETERINARY]: "کلینیک دامپزشکی",
  [BusinessType.EDUCATION]: "آموزشگاه",
  [BusinessType.CAFE]: "کافه",
  [BusinessType.RESTAURANT]: "رستوران",
  [BusinessType.LAW]: "دفتر حقوقی",
  [BusinessType.CONSULTING]: "دفتر مشاوره",
  [BusinessType.OTHER]: "سایر",
};
