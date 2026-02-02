import { ComponentPropsWithoutRef } from "react";
import { Input } from "../ui/input";

interface Props extends Omit<
  ComponentPropsWithoutRef<typeof Input>,
  "onChange"
> {
  name?: string;
  onChange?: (value: string) => void;
}

const TimePicker = ({ name, onChange, ...res }: Props) => {
  return (
    <Input
      {...res}
      name={name}
      type="time"
      onChange={(event) => {
        onChange?.(event.target.value);
      }}
    />
  );
};

export default TimePicker;
