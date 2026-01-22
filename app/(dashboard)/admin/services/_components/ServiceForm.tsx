"use client";

import { Form, FormButtons } from "@/components";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { inParser, outParser } from "../meta/utils";
import ServiceFormFields from "./ServiceFormFields";
import WorkingHoursManager from "./WorkingHoursManager";
import { useRouter } from "next/navigation";

interface Props<T = any> {
  defaultValues?: T;
}

export interface IworkingHours {
  weekday: number;
  englishTitle: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function ServiceForm({ defaultValues }: Props) {
  const { push } = useRouter();
  const id = defaultValues?.id;
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await api(
        !!id ? `/admin/services/${id}` : "/admin/services",
        {
          method: !!id ? "PUT" : "POST",
          data: outParser(data),
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      if (!data?.service?.id) return;
      push(`/admin/services/${data?.service?.id}`);
    },
  });
  const onSubmit = (data: any) => {
    mutateAsync(data);
  };
  return (
    <Form
      onSubmit={onSubmit}
      defaultValues={
        inParser(defaultValues) || {
          isActive: true,
          workingHours: [
            {
              weekday: 0,
              englishTitle: "Saturday",
              startTime: "09:00",
              endTime: "18:00",
              isActive: true,
            },
            {
              weekday: 1,
              englishTitle: "Sunday",
              startTime: "09:00",
              endTime: "18:00",
              isActive: true,
            },
            {
              weekday: 2,
              englishTitle: "Monday",
              startTime: "09:00",
              endTime: "18:00",
              isActive: true,
            },
            {
              weekday: 3,
              englishTitle: "Tuesday",
              startTime: "09:00",
              endTime: "18:00",
              isActive: true,
            },
            {
              weekday: 4,
              englishTitle: "Wednesday",
              startTime: "09:00",
              endTime: "18:00",
              isActive: true,
            },
            {
              weekday: 5,
              englishTitle: "Thursday",
              startTime: "09:00",
              endTime: "14:00",
              isActive: true,
            },
            {
              weekday: 6,
              englishTitle: "Friday",
              startTime: "00:00",
              endTime: "00:00",
              isActive: false,
            },
          ],
          calendarRules: [],
        }
      }
      className="p-4"
    >
      <ServiceFormFields />

      <WorkingHoursManager />

      <FormButtons
        submitLoading={isPending}
        className="justify-self-end"
        cancelUrl="/admin/services"
      />
    </Form>
  );
}
