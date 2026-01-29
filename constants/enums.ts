export enum BusinessType {
  SALON = "SALON",
  GYM = "GYM",
  CLINIC = "CLINIC",
  BEAUTY = "BEAUTY",
  EDUCATION = "EDUCATION",
  SPORTS = "SPORTS",
  CAFE = "CAFE",
  RESTAURANT = "RESTAURANT",
  LAW = "LAW",
  DENTAL = "DENTAL",
  VETERINARY = "VETERINARY",
  CONSULTING = "CONSULTING",
  OTHER = "OTHER",
}

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  CUSTOMER = "CUSTOMER",
}

export enum BusinessRole {
  OWNER = "OWNER",
  STAFF = "STAFF",
}

export enum BookingStatus {
  AWAITING_PAYMENT = "AWAITING_PAYMENT", //هنوز پرداخت نشده

  AWAITING_CONFIRMATION = "AWAITING_CONFIRMATION", // پرداخت انجام شده، نیاز به تایید

  CONFIRMED = "CONFIRMED", //تایید شد، خدمت اجرا می‌شود

  REJECTED = "REJECTED", //مدیر تایید نکرد

  CANCELED = "CANCELED", //لغو شد

  COMPLETED = "COMPLETED", // انجام شد

  NO_SHOW_CUSTOMER = "NO_SHOW_CUSTOMER", // مشتری نیامد

  NO_SHOW_STAFF = "NO_SHOW_STAFF",
}

export enum PaymentMethod {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum WalletType {
  PLATFORM = "PLATFORM",
  BUSINESS = "BUSINESS",
}

export enum LedgerEntryType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

export enum SettlementStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export enum BusinessRegistrationStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT",
}

export enum DiscountScope {
  PLATFORM = "PLATFORM", // کد عمومی پلتفرم
  BUSINESS = "BUSINESS", // مخصوص یک بیزنس
}

export enum DiscountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED",
}
