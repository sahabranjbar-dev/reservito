"use client";

import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/axios";
import { mobileValidation } from "@/utils/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import BaseField from "../BaseField/BaseField";
import Form from "../Form/Form";
import { LoginFormType } from "./LoginForm";

interface IFormValue {
  phone: string;
}

interface ISendCodeForm {
  setLoginFormType: Dispatch<SetStateAction<LoginFormType | null>>;
  setMobile: Dispatch<SetStateAction<string>>;
  mobile: string | null;
}

const SendCodeForm = ({
  setLoginFormType,
  setMobile,
  mobile,
}: ISendCodeForm) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: async (phone: string) => {
      const response = await authApi.post("/send-otp", { phone });
      return response.data;
    },
  });

  const handleSubmit = async (data: IFormValue) => {
    await mutateAsync(data.phone).then(
      (data: { success: boolean; message: string; mobile: string }) => {
        if (data.success) {
          toast.success(data?.message);
          setLoginFormType("verify");
          setMobile(data.mobile);
        }
      }
    );
  };

  return (
    <Form<IFormValue>
      onSubmit={handleSubmit}
      className="space-y-6"
      resolver={zodResolver(mobileValidation())}
      values={{
        phone: mobile ?? "",
      }}
    >
      {({ watch }) => {
        return (
          <>
            {/* هدر */}
            <div className="text-center mb-10">
              <p className="text-gray-500 text-sm leading-relaxed">
                لطفا شماره موبایل خود را وارد کنید
              </p>
            </div>

            {/* فیلد شماره موبایل */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                شماره موبایل
              </label>
              <BaseField
                component={Input}
                type="tel"
                name="phone"
                className="text-left w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                placeholder="09xxxxxxxxx (11 رقم)"
                required
                dir="ltr"
              />
            </div>

            {/* دکمه ارسال کد */}
            <button
              type="submit"
              disabled={!watch("phone") || isPending}
              className="w-full bg-blue-500  text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>در حال ارسال کد...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>ارسال کد تایید</span>
                </>
              )}
            </button>

            {/* اطلاعات اضافی */}
            <div className="text-center space-y-3">
              <p className="text-xs text-gray-400">
                با ادامه، شما با{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-800 underline transition-colors"
                >
                  قوانین و مقررات
                </Link>{" "}
                و{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-800 underline transition-colors"
                >
                  سیاست حفظ حریم خصوصی
                </Link>{" "}
                موافقت می‌کنید.
              </p>
            </div>
          </>
        );
      }}
    </Form>
  );
};

export default SendCodeForm;
