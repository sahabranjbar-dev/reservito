import z from "zod";
import { registerSchema } from "./schema";
import { BusinessType } from "@/constants/enums";

export type RegisterFormValues = z.infer<typeof registerSchema>;

export interface IBusinessValues {
  ownerFullname: string;
  phone: string;
  password: string;
  businessName: string;
  businessType: BusinessType;
  address: string;
  username: string;
}
