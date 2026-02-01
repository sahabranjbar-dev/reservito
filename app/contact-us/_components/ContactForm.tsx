"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { BaseField, Form, TextCore } from "@/components";
import { useMutation } from "@tanstack/react-query";

interface IContactForm {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const { isPending: isSubmitting, mutateAsync } = useMutation({
    mutationFn: async () => {
      console.log("api call");
    },
  });
  const onSubmit = async (data: IContactForm) => {
    try {
      await mutateAsync();
    } catch (err) {
      toast.error("خطا در ارسال پیام، دوباره تلاش کنید.");
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-md"
    >
      <div>
        <BaseField
          name="fullName"
          component={TextCore}
          label="نام و نام خانوادگی"
          required
        />
      </div>

      <div>
        <BaseField name="email" component={TextCore} label="ایمیل" required />
      </div>

      <div>
        <BaseField
          name="email"
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
