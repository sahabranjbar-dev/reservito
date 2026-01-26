import { UserRole } from "@/types/common";

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
