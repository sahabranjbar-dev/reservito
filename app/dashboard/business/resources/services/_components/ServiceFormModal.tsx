"use client";

import { BaseField, Form, MultiselectCombobox, TextCore } from "@/components";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { upsertService } from "../_meta/actions";

interface IupsertService {
  name: string;
  price?: number | null;
  duration: number;
  businessId: string;
  id?: string;
  staffIds: string[];
}

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSuccess?: (data: any) => void;
}

export default function ServiceFormModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: ServiceFormModalProps) {
  const staffOptions = initialData?.staffList?.map((item: any) => {
    return {
      ...item,
      id: item?.id,
      farsiTitle: item?.name,
    };
  });

  const onSubmit = async (data: IupsertService) => {
    const res = await upsertService({
      ...data,
      price: !!data?.price ? data?.price : null,
    });

    if (res?.success) {
      onSuccess?.(res);
      toast.success(res.message);
    } else {
      toast.error(res?.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">
            {initialData ? "ویرایش خدمت" : "افزودن خدمت جدید"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <Form
          defaultValues={{
            ...initialData,
            staffIds: initialData?.staff?.map((item: any) => item?.staffId),
          }}
          onSubmit={onSubmit}
          className="p-6 space-y-6"
        >
          {/* نام و قیمت */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseField
              name="name"
              component={TextCore}
              label="نام خدمت"
              required
            />

            <BaseField
              name="price"
              component={TextCore}
              label="قیمت"
              number
              formatter
              icon="تومان"
              validate={(value: number) => {
                if (value > 100_000_000)
                  return "قیمت نباید بیشتر از ۱۰۰,۰۰۰,۰۰۰ باشد";
                return true;
              }}
            />
            <BaseField
              name="duration"
              component={TextCore}
              label="مدت زمان"
              required
              number
              formatter
              description="مدت زمان بر حسب دقیقه محاسبه می‌گردد"
              validate={(value: number) => {
                if (value > 1_000)
                  return "زمان نباید بیشتر از ۱,۰۰۰ دقیقه باشد";
                return true;
              }}
            />
          </div>

          {/* --- بخش مهم: انتخاب پرسنل --- */}
          <div>
            <BaseField
              name="staffIds"
              options={staffOptions}
              component={MultiselectCombobox}
              className="text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
              label="ارائه‌دهندگان این خدمت"
              required
            />
            {/* <p className="text-xs text-slate-400 mt-2">
              اگر هیچ‌کس را انتخاب نکنید، سرویس در منوی عمومی غیرفعال نمایش داده
              می‌شود.
            </p> */}
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-1/3"
            >
              لغو
            </Button>
            <Button
              type="submit"
              className="w-2/3 bg-indigo-600 hover:bg-indigo-700"
            >
              {initialData ? "ویرایش" : "ذخیره خدمت"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
