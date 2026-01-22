import React from "react";
import { Checkbox } from "../ui/checkbox";

interface Props {
  onChange?: (checked: boolean) => void;
}

const CheckboxCore = ({ onChange, ...res }: Props) => {
  return (
    <Checkbox
      {...res}
      onCheckedChange={(checked) => {
        onChange?.(!!checked);
      }}
    />
  );
};

export default CheckboxCore;
