"use client";

import { BaseField, TextCore } from "@/components";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/hooks/useTimer";
import { authApi } from "@/lib/axios";
import { convertToEnglishDigits, mobileValidation } from "@/utils/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { otCodeValidate } from "../_meta/actions";
import { useSession } from "next-auth/react";
import { MessageSquareText } from "lucide-react";

const OtpCodeInput = () => {
  const { data: userData } = useSession();
  const { minutes, seconds, isRunning, restart } = useTimer({
    autoStart: false,
    initialSeconds: 5,
  });

  const { watch, setValue } = useFormContext();

  const phone = watch("phone");
  const otpCode = watch("otpCode");

  const { success } = mobileValidation().safeParse({ phone });
  const isPhoneValid = success;

  const sendOtpMutation = useMutation({
    mutationFn: async (phone: string) => {
      const res = await authApi.post("/send-otp", { phone });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "کد ارسال شد");
      restart();
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data.error || "خطا در ارسال کد");
    },
  });

  const optValidation = useMutation({
    mutationFn: async ({ code, phone }: { code: string; phone: string }) => {
      const result = await otCodeValidate({ code, phone });

      if (!result.success) {
        toast.error(result.message);
        return result;
      }

      toast.success(result.message);
      setValue("validPhone", result.phone);
      return result;
    },
  });

  const handleSendOtp = async () => {
    if (!isPhoneValid) return;
    await sendOtpMutation.mutateAsync(phone);
  };

  const canSubmitOtp = otpCode?.toString().length === 6;

  const onApprovedCodeHandler = async () => {
    await optValidation
      .mutateAsync({
        code: convertToEnglishDigits(otpCode),
        phone: convertToEnglishDigits(phone),
      })
      .then((data) => {
        if (!data.success) return;

        setValue("otpCode", null);
      });
  };

  return (
    <div className="space-y-2">
      <BaseField
        name="otpCode"
        component={TextCore}
        maxLength={6}
        disabled={!isPhoneValid}
        icon={
          <div className="flex items-center justify-between">
            {!isRunning ? (
              <Button
                type="button"
                variant="link"
                onClick={handleSendOtp}
                disabled={
                  !isPhoneValid ||
                  sendOtpMutation.isPending ||
                  phone === userData?.user.phone
                }
                className="text-blue-500 text-sm underline"
                rightIcon={<MessageSquareText />}
              >
                دریافت کد تایید
              </Button>
            ) : (
              <span className="text-xs text-neutral-600" dir="ltr">
                ارسال مجدد تا ({minutes}:{seconds})
              </span>
            )}

            {false && (
              <Button
                type="button"
                onClick={onApprovedCodeHandler}
                disabled={!canSubmitOtp || optValidation.isPending}
              >
                تایید کد
              </Button>
            )}
          </div>
        }
      />
    </div>
  );
};

export default OtpCodeInput;
