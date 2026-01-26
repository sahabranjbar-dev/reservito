import { BaseSyntheticEvent } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export interface IForm<T extends FieldValues = FieldValues> {
  onSubmit?: (
    data: T,
    event: BaseSyntheticEvent<object, any, any>,
    methods: UseFormReturn<T, any, T>
  ) => void;
  children?: React.ReactNode | ((methods: UseFormReturn<T>) => React.ReactNode);
  className?: string;
}
