"use client";

import { Form } from "@/components";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { outParser } from "../meta/utils";

import { StepAccount } from "./steps/StepAccount";
import { StepBusiness } from "./steps/StepBusiness";
import { StepLocation } from "./steps/StepLocation";
import { StepProgress } from "./steps/StepProgress";
import {
  registerSchema,
  stepAccountSchema,
  stepBusinessSchema,
  stepLocationSchema,
} from "../meta/schema";
import { RegisterFormValues } from "../meta/types";
import { BusinessType } from "@/constants/enums";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

const steps = [StepAccount, StepBusiness, StepLocation];
const stepSchemas = [stepAccountSchema, stepBusinessSchema, stepLocationSchema];

export default function RegisterStepForm() {
  const { push } = useRouter();
  const [step, setStep] = useState(1);

  const { mutateAsync } = useMutation({
    mutationFn: (data: RegisterFormValues) =>
      api.post("/business/register", outParser(data)),
    onSuccess: () => {
      toast.success("ثبت‌نام با موفقیت انجام شد");
      push("/business/login");
    },
  });

  const onSubmit = async (
    data: RegisterFormValues,
    e: any,
    methods: UseFormReturn<any, any, any>
  ) => {
    try {
      // اعتبارسنجی فقط مرحله جاری
      stepSchemas[step - 1].parse(data);

      if (step < 3) {
        setStep((s) => s + 1);
      } else {
        // اعتبارسنجی نهایی برای همه فیلدها قبل از ارسال (اختیاری ولی توصیه می‌شود)
        registerSchema.parse(data);
        await mutateAsync(data);
      }
    } catch (e: any) {
      // نمایش خطا اگر فیلدهای مرحله جاری معتبر نباشند
      const errors: any[] = JSON.parse(e);

      errors.forEach((item: any) => {
        methods.setError(item?.path[0], {
          message: item?.message,
        });
      });
      return;
    }
  };

  const CurrentStep = steps[step - 1];

  return (
    <Form
      onSubmit={onSubmit}
      defaultValues={{
        businessName: "",
        ownerFullname: "",
        password: "",
        phone: "",
        address: "",
        businessType: BusinessType.OTHER,
        username: "",
      }}
      className="p-10"
    >
      <StepProgress step={step} />
      <CurrentStep />

      <div className="flex gap-4 mt-6">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="btn-secondary"
          >
            بازگشت
          </button>
        )}
        <Button type="submit" className="btn-primary flex-1 p-6 text-lg">
          {step === 3 ? "ثبت نهایی" : "مرحله بعد"}
        </Button>
      </div>
    </Form>
  );
}
