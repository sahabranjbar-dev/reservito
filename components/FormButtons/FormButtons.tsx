"use client";
import clsx from "clsx";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { IFormButtons } from "./meta/types";

const FormButtons = ({
  id,
  submitLoading,
  cancelUrl,
  submitLabel,
  onCancel,
  className,
}: IFormButtons) => {
  const { replace } = useRouter();
  return (
    <div className={clsx("flex justify-start items-center gap-2", className)}>
      <Button
        rightIcon={<X />}
        type="button"
        onClick={() => {
          if (cancelUrl) {
            replace(cancelUrl);
          }
          onCancel?.();
        }}
        variant={"destructive"}
      >
        انصراف
      </Button>
      <Button rightIcon={<Check />} type="submit" loading={submitLoading}>
        {submitLabel ?? (id ? "ویرایش" : "ثبت")}
      </Button>
    </div>
  );
};

export default FormButtons;
