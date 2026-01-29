"use client";
import { BaseField, Combobox, DatePicker, Form, TextCore } from "@/components";
import { Button } from "@/components/ui/button";
import { DiscountStatus, DiscountType } from "@/constants/enums";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useCallback } from "react";
import { toast } from "sonner";
import { getDiscountDetail, upsertDiscount } from "../_meta/actions";

interface Props {
  onCancel?: () => void;
  onSuccess?: (data: any) => void;
  id: string | null;
  businessId: string;
}

interface IForm {
  id: string;
  businessId?: string | null;
  code: string;
  type: DiscountType;
  value: number;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
  usageLimit?: number | null;
  startsAt: string;
  expiresAt: string;
  status: DiscountStatus;
}

const DiscountForm = ({ onCancel, id, onSuccess, businessId }: Props) => {
  const handleSubmit = (values: IForm) => {
    mutateAsync({
      ...values,
      startsAt: new Date(values.startsAt).toISOString(),
      businessId,
      expiresAt: new Date(values.expiresAt).toISOString(),
    });
  };

  const getRandomCode = useCallback(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }, []);

  const {
    data: discountData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["discount-detail", id],
    queryFn: async () => {
      const result = await getDiscountDetail(id!);

      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.error("عملیات با موفقیت انجام شد");

      return result.discount;
    },
    enabled: !!id,
  });

  const { mutateAsync, isPending: upsertDiscountLoading } = useMutation({
    mutationFn: async (data: IForm) => {
      const result = await upsertDiscount(data);

      return result;
    },
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error);
        return;
      }
      onSuccess?.(data);
    },
  });
  const defaultValues = React.useMemo(() => {
    if (!discountData) return undefined;

    return {
      ...discountData,
      businessId: discountData?.businessId,
      expiresAt: discountData?.expiresAt.toISOString(),
      startsAt: discountData?.startsAt.toISOString(),
      status: discountData?.status as DiscountStatus,
      type: discountData?.type as DiscountType,
    };
  }, [discountData]);

  if (isLoading || isFetching)
    return (
      <div className=" w-full min-h-96 flex justify-center items-center h-full rounded-2xl">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <Form onSubmit={handleSubmit} defaultValues={defaultValues} className="p-4">
      {({ setValue, clearErrors }) => {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 space-y-3">
            <div className="flex justify-start items-center gap-2 col-span-2">
              <BaseField
                name="code"
                component={TextCore}
                label="کد تخفیف"
                placeholder="مثلا: YALDA40"
                required
                containerClassName="flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  const randomCode = getRandomCode();
                  setValue("code", randomCode);
                  clearErrors("code");
                }}
                className="w-1/3 h-9.5 mt-6 rounded-lg border border-slate-300 bg-slate-50 text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                تولید کد
              </button>
            </div>

            <BaseField
              name="type"
              component={Combobox}
              label="نوع تخفیف"
              options={[
                { id: "PERCENTAGE", farsiTitle: "درصدی (%)" },
                { id: "FIXED_AMOUNT", farsiTitle: "مبلغی (تومان)" },
              ]}
              required
            />

            <BaseField
              name="value"
              component={TextCore}
              number
              validate={() => {
                return true;
              }}
              label="مقدار"
              required
              formatter
            />
            <BaseField
              name="maxDiscount"
              component={TextCore}
              number
              formatter
              label="سقف تخفیف (تومان)"
            />

            <BaseField
              name="minOrderAmount"
              component={TextCore}
              number
              formatter
              label="حداقل سفارش (تومان)"
            />

            <BaseField
              name="usageLimit"
              component={TextCore}
              number
              formatter
              label="محدودیت تعداد مصرف"
            />

            <BaseField
              name="status"
              component={Combobox}
              label="وضعیت"
              required
              defaultValue={"ACTIVE"}
              options={[
                { id: "ACTIVE", farsiTitle: "فعال" },
                { id: "INACTIVE", farsiTitle: "غیرفعال" },
                { id: "EXPIRED", farsiTitle: "منقضی" },
              ]}
            />

            <BaseField
              name="startsAt"
              component={DatePicker}
              label="تاریخ شروع"
              required
            />

            <BaseField
              name="expiresAt"
              component={DatePicker}
              label="تاریخ انقضا"
              required
            />

            <div className="col-span-2 justify-self-end flex justify-end items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                انصراف
              </button>
              <Button type="submit" loading={upsertDiscountLoading}>
                ذخیره تخفیف
              </Button>
            </div>
          </div>
        );
      }}
    </Form>
  );
};

export default DiscountForm;
