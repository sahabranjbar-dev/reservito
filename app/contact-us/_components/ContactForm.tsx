"use client";

import { BaseField, Form, TextCore } from "@/components";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sendContactMessage } from "../_meta/actions";
import { convertToEnglishDigits } from "@/utils/common";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface IContactForm {
  fullName: string;
  phone: string;
  message: string;
  email?: string;
}

interface IData {
  fullName: string;
  phone: string;
  message: string;
  email?: string;
}

const schema = z.object({
  fullName: z.string({ error: "نام و نام‌خانوادگی الزامی است" }),
  message: z.string({ error: "پیام الزامی است" }),
  phone: z
    .string()
    .min(1, { error: "شماره موبایل الزامی است." })
    .length(11, { error: "شماره موبایل باید دقیقاً ۱۱ رقم باشد." })
    .trim()
    .transform(convertToEnglishDigits)
    .pipe(
      z
        .string()
        .regex(/^09\d{9}$/, { error: "شماره موبایل باید با ۰۹ شروع شود." }),
    ),
  email: z.string().optional(),
});

const ContactForm = () => {
  const { push } = useRouter();

  const searchParams = useSearchParams();

  const success = searchParams.get("success") === "true";

  const [message, setMessage] = useState<string>(
    success ? "پیام شما با موفقیت ارسال شد." : "",
  );

  const { isPending: isSubmitting, mutateAsync } = useMutation({
    mutationFn: async (data: IData) => {
      const result = await sendContactMessage(data);

      if (!result.success) {
        const messages: { message: string }[] = JSON.parse(result.message);

        if (typeof messages === "string") {
          toast.error(result.message);
          return;
        }
        messages.forEach((item) => {
          toast.error(item.message);
        });
        return;
      }

      toast.success("پیام شما با موفقیت ارسال شد.");
      setMessage(result.message);
      const url = new URL(window.location.href);
      url.searchParams.set("success", "true");
      push(url.toString());
      return result;
    },
  });
  const onSubmit = async (data: IContactForm) => {
    await mutateAsync({
      fullName: data.fullName,
      message: data.message,
      phone: convertToEnglishDigits(data.phone),
      email: data?.email,
    });
  };

  if (message.length) {
    return (
      <div className="flex flex-col justify-start items-center gap-4 text-center">
        <span className="text-lg text-blue-900">{message}</span>

        <DotLottieReact
          className="w-72 h-72 mx-auto"
          src="/lottie/success-animation.lottie"
          autoplay
        />
      </div>
    );
  }

  return (
    <Form<IContactForm>
      onSubmit={onSubmit}
      className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md"
      resolver={zodResolver(schema)}
    >
      <div>
        <BaseField
          name="fullName"
          component={TextCore}
          label="نام و نام خانوادگی"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start">
        <BaseField name="phone" component={TextCore} label="موبایل" required />
        <BaseField name="email" component={TextCore} label="ایمیل" />
      </div>

      <div>
        <BaseField
          name="message"
          component={Textarea}
          label="پیام شما"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 p-4 font-semibold"
      >
        {isSubmitting ? "در حال ارسال..." : "ارسال پیام"}
      </Button>
    </Form>
  );
};

export default ContactForm;
