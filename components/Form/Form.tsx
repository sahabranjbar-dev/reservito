"use client";

import {
  FieldValues,
  FormProvider,
  useForm,
  UseFormProps,
} from "react-hook-form";
import { IForm } from "./meta/types";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

const Form = <T extends FieldValues = FieldValues>({
  children,
  onSubmit,
  className,
  // اینا رو اضافه کردیم
  defaultValues,
  resolver,
  mode = "onBlur",
  reValidateMode = "onChange",
  loading,
  ...restUseFormOptions
}: IForm<T> & UseFormProps<T>) => {
  const methods = useForm<T>({
    defaultValues,
    resolver,
    mode,
    reValidateMode,
    ...restUseFormOptions,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={
          onSubmit
            ? methods.handleSubmit((data, event) =>
                onSubmit(data as any, event as any, methods),
              )
            : undefined
        }
        className={clsx(className, "relative")}
        noValidate // مهم! تا مرورگر اعتبارسنجی خودش رو نشون نده
      >
        {loading && (
          <div className="absolute z-20 top-0 left-0 right-0 bottom-0 w-full bg-gray-300/45 flex justify-center items-center h-full rounded-2xl">
            <Loader2 className="animate-spin" />
          </div>
        )}
        {typeof children === "function" ? children(methods) : children}
      </form>
    </FormProvider>
  );
};

export default Form;
