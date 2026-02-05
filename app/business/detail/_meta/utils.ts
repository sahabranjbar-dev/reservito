import { BusinessType } from "@/constants/enums";
import {
  Briefcase,
  Coffee,
  Dumbbell,
  GraduationCap,
  PawPrint,
  Scale,
  Scissors,
  Sprout,
  Stethoscope,
  Store,
  Syringe,
  Trophy,
  UtensilsCrossed,
} from "lucide-react";
import { ElementType } from "react";

export type BusinessTypeOption = {
  id: BusinessType;
  titleFa: string;
  titleEn: string;
  icon: ElementType;
};

export const businessTypeLabelsFa: Record<BusinessType, string> = {
  SALON: "سالن آرایش",
  GYM: "باشگاه ورزشی",
  CLINIC: "کلینیک پزشکی",
  BEAUTY: "خدمات زیبایی پوست و مو",
  EDUCATION: "آموزشگاه",
  SPORTS: "مجموعه ورزشی",
  CAFE: "کافه",
  RESTAURANT: "رستوران",
  LAW: "دفتر حقوقی",
  DENTAL: "کلینیک دندانپزشکی",
  VETERINARY: "کلینیک دامپزشکی",
  CONSULTING: "دفتر مشاوره",
  OTHER: "سایر",
};

export const businessTypeLabelsEn: Record<BusinessType, string> = {
  SALON: "Salon",
  GYM: "Gym",
  CLINIC: "Clinic",
  BEAUTY: "Beauty",
  EDUCATION: "Education",
  SPORTS: "Sports",
  CAFE: "Cafe",
  RESTAURANT: "Restaurant",
  LAW: "Law",
  DENTAL: "Dental",
  VETERINARY: "Veterinary",
  CONSULTING: "Consulting",
  OTHER: "Other",
};

export const businessTypeLabelIcon = {
  SALON: Scissors, // آرایشگاه
  GYM: Dumbbell, // باشگاه
  CLINIC: Stethoscope, // کلینیک
  BEAUTY: Sprout, // زیبایی
  EDUCATION: GraduationCap, // آموزش
  SPORTS: Trophy, // ورزش
  CAFE: Coffee, // کافه
  RESTAURANT: UtensilsCrossed, // رستوران
  LAW: Scale, // حقوقی
  DENTAL: Syringe, // دندانپزشکی
  VETERINARY: PawPrint, // دامپزشکی
  CONSULTING: Briefcase, // مشاوره
  OTHER: Store, // سایر
} as const;

export function getBusinessTypeOptions(): BusinessTypeOption[] {
  return Object.values(BusinessType).map((type) => ({
    id: type,
    titleFa: businessTypeLabelsFa[type],
    titleEn: businessTypeLabelsEn[type],
    icon: businessTypeLabelIcon[type],
  }));
}
