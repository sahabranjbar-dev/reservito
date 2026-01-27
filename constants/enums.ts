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
  PENDING_CONFIRMATION = "PENDING_CONFIRMATION",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
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
