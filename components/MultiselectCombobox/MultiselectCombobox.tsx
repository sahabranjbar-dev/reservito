"use client";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@/components/ui/multi-select";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useInView } from "react-intersection-observer";

interface Option {
  id: string;
  farsiTitle: string;
  englishTitle: string;
}

interface Props<T = any> {
  data?: {
    resultList?: Option[];
    pages?: T;
  };
  loading?: boolean;
  error?: any;
  options?: Option[];
  label: string;
  name: string;
  value?: string[];
  onChange?: (value: string[]) => void;

  keyField?: "id" | string;
  getKey?: (item: Option) => string;
  getLabel?: (item: Option) => string;

  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;

  [key: string]: any;
}

const MultiselectCombobox = ({
  data,
  loading,
  error,
  options,
  label,
  name,
  value,
  onChange,
  keyField = "id",
  getKey,
  getLabel,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  ...rest
}: Props) => {
  const { getFieldState } = useFormContext();
  const { invalid } = getFieldState(name);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  const resolvedOptions = useMemo<Option[]>(() => {
    if (options?.length) return options;
    return data?.resultList ?? [];
  }, [options, data?.resultList]);

  useEffect(() => {
    if (!inView) return;
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;

    fetchNextPage?.();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const resolveKey = (item: Option) =>
    keyField === "id" ? item.id : getKey ? getKey(item) : item.englishTitle;

  const resolveLabel = (item: Option) =>
    getLabel ? getLabel(item) : item.farsiTitle;

  if (loading && !resolvedOptions.length) {
    return (
      <div className="flex justify-center py-4 border rounded-lg w-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-4 text-red-500">
        خطایی رخ داده است
      </div>
    );
  }

  return (
    <MultiSelect
      {...rest}
      values={value}
      onValuesChange={(values) => {
        if (values.length === 1 && !values[0]) return;
        onChange?.(values);
      }}
    >
      <MultiSelectTrigger
        name={name}
        className={clsx("w-full", {
          "border-red-500": invalid,
        })}
      >
        <MultiSelectValue placeholder={`${label} را انتخاب کنید...`} />
      </MultiSelectTrigger>

      <MultiSelectContent>
        <MultiSelectGroup>
          {resolvedOptions.length === 0 && (
            <div className="flex justify-center py-6 text-gray-500">
              داده‌ای وجود ندارد
            </div>
          )}

          {resolvedOptions.map((item) => (
            <MultiSelectItem key={resolveKey(item)} value={resolveKey(item)}>
              {resolveLabel(item)}
            </MultiSelectItem>
          ))}

          {hasNextPage && (
            <div ref={ref} className="flex justify-center py-2">
              {isFetchingNextPage && (
                <Loader2 className="animate-spin w-4 h-4" />
              )}
            </div>
          )}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
};

export default MultiselectCombobox;
