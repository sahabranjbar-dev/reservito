"use client";

import { BaseField, Form } from "@/components";
import PasswordField from "@/components/PasswordField/PasswordField";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Ban, CheckCircle } from "lucide-react";
import { useRef } from "react";
import { UseFormReset } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
  changeBusinessOwnerPassword,
  ChangePasswordInput,
} from "../_meta/actions";

interface IForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const changePasswordSchema = z
  .object({
    currentPassword: z
      .string({ error: "رمز عبور فعلی الزامی است" })
      .min(6, "رمز عبور فعلی باید حداقل ۶ کاراکتر باشد"),
    newPassword: z
      .string({ error: "رمز جدید الزامی است" })
      .min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
        "رمز جدید باید شامل حداقل یک حرف، یک عدد و یک کاراکتر خاص باشد",
      ),
    confirmPassword: z.string({ error: "تکرار رمز عبور جدید الزامی است" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "رمز جدید و تکرار آن یکسان نیست",
    path: ["confirmPassword"],
  });

const ChangePasswordForm = () => {
  const resetFormRef = useRef<UseFormReset<IForm> | null>(null);

  const { mutateAsync, isPending, error, isSuccess, data } = useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      const result = await changeBusinessOwnerPassword(data);

      if (!result.success && result.error) {
        if (typeof result.error === "object") {
          result.error?.forEach(({ message }: { message: string }) => {
            toast.error(message);
            throw new Error(message);
          });
        } else {
          toast.error(result.error);
          throw new Error(result.error);
        }
      }

      toast.success(result.message ?? "رمز با موفقیت تغییر کرد");
      resetFormRef?.current?.();
      return result;
    },
  });

  const onSubmit = async (data: IForm) => {
    await mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {error?.message && (
        <div className="bg-red-50 px-6 py-4 rounded-2xl border border-red-500 text-red-500 flex items-center gap-3 text-sm">
          <Ban size={20} />
          <span>{error.message}</span>
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-50 px-6 py-4 rounded-2xl border border-green-500 text-green-600 flex items-center gap-3 text-sm">
          <CheckCircle size={20} />
          <span>{data?.message}</span>
        </div>
      )}

      <Form<IForm>
        onSubmit={onSubmit}
        resolver={zodResolver(changePasswordSchema)}
      >
        {({ reset }) => {
          resetFormRef.current = reset;

          return (
            <div className="p-4 space-y-4 bg-white rounded-2xl shadow-md">
              <BaseField
                name="currentPassword"
                component={PasswordField}
                label="رمز عبور فعلی"
                required
              />

              <BaseField
                name="newPassword"
                component={PasswordField}
                label="رمز عبور جدید"
                required
              />

              <BaseField
                name="confirmPassword"
                component={PasswordField}
                label="تکرار رمز عبور جدید"
                required
              />

              <div className="pt-2">
                <Button type="submit" className="w-full" loading={isPending}>
                  بروزرسانی رمز عبور
                </Button>
              </div>
            </div>
          );
        }}
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
