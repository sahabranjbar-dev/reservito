"use client";
import { applyDiscount } from "@/utils/actions";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { Ban, ChevronDown, Percent, SquareCheck } from "lucide-react";
import { Activity, useState } from "react";
import { toast } from "sonner";
import BaseField from "../BaseField/BaseField";
import Form from "../Form/Form";
import { TextCore } from "../TextCore/TextCore";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface IForm {
  code: string;
}

interface Props {
  businessId?: string;
  orderAmount?: number;
  onApplied?: (data: {
    discountAmount?: number;
    finalAmount?: number;
    discountCode?: string | null;
  }) => void;
}

const DiscountInput = ({ businessId, orderAmount, onApplied }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>();
  const { mutateAsync, isPending, data, reset } = useMutation({
    mutationFn: async (code: string) => {
      if (!businessId || !orderAmount) {
        setMessage({
          text: "مشکلی در اعمال تخفیف به وجود آمده است",
          type: "error",
        });
        return;
      }
      const result = await applyDiscount({
        businessId,
        code,
        orderAmount,
      });

      return result;
    },
    onSuccess: (result) => {
      if (!result) return;

      if (!result.success) {
        setMessage({ text: result.message ?? result.error, type: "error" });
        return;
      }

      setMessage({
        text: `مبلغ تخفیف: ${new Intl.NumberFormat("fa-IR").format(
          result.discountAmount!,
        )} تومان`,
        type: "success",
      });

      toast.success(result?.message);

      onApplied?.({
        discountAmount: result.discountAmount,
        finalAmount: result.finalAmount,
        discountCode: result.discount?.code,
      });
    },

    onError: () => {
      setMessage({
        text: "خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.",
        type: "error",
      });
    },
  });

  const onSubmit = async ({ code }: IForm) => {
    await mutateAsync(code);
  };

  const deleteCodeHandler = () => {
    onApplied?.({
      discountAmount: 0,
      discountCode: null,
      finalAmount: orderAmount,
    });
    setMessage(null);
    toast.warning("کد تخفیف حذف شد");
    reset();
  };
  return (
    <>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex justify-start items-center gap-2 my-2 p-2 ">
          <ChevronDown
            className={clsx("transition-transform duration-300", {
              "rotate-180": open,
            })}
          />
          <span className="font-semibold">کد تخفیف</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Form
            onSubmit={onSubmit}
            defaultValues={{ code: data?.discount?.code }}
          >
            {({ watch, setValue }) => (
              <div className="">
                <div className="flex justify-start items-start gap-2">
                  <BaseField
                    name="code"
                    component={TextCore}
                    containerClassName="flex-1"
                    className="p-4"
                    icon={<Percent className="w-4 h-4 text-slate-500" />}
                    placeholder="کد تخفیف را وارد کنید"
                  />

                  <Button disabled={!watch("code")} loading={isPending}>
                    ثبت کد تخفیف
                  </Button>
                </div>

                <Activity mode={message?.text ? "visible" : "hidden"}>
                  <div
                    className={clsx(
                      "text-sm m-2 flex justify-start items-center gap-2",
                      message?.type === "error"
                        ? "text-red-600"
                        : "text-green-700",
                    )}
                  >
                    {message?.type === "error" ? (
                      <Ban size={16} />
                    ) : (
                      <SquareCheck size={16} />
                    )}
                    <span>{message?.text}</span>
                  </div>
                </Activity>

                <Activity mode={message?.text ? "visible" : "hidden"}>
                  <Button
                    disabled={!watch("code")}
                    type="button"
                    onClick={() => {
                      setValue("code", "");
                      deleteCodeHandler();
                    }}
                    variant={"link"}
                  >
                    حذف کد تخفیف
                  </Button>
                </Activity>
              </div>
            )}
          </Form>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default DiscountInput;
