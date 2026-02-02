import React, { useState } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";

interface Props {
  name: string;
  label?: string;
}

const PasswordField = ({ name, label = "رمز عبور", ...rest }: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const RenderedIcon = showPassword ? Eye : EyeOff;

  const iconClickHandler = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Input
      {...rest}
      name={name}
      id={label}
      icon={
        <RenderedIcon
          onClick={iconClickHandler}
          className="text-gray-500 cursor-pointer"
          size={20}
        />
      }
      type={showPassword ? "text" : "password"}
    />
  );
};

export default PasswordField;
