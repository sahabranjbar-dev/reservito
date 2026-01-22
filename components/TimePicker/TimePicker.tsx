import React from "react";
import { Input } from "../ui/input";

interface Props {
  name?: string;
}

const TimePicker = ({ name, ...res }: Props) => {
  return <Input {...res} name={name} type="time" />;
};

export default TimePicker;
