"use client";
import React, { ComponentPropsWithoutRef } from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props extends Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "onClick"
> {
  text?: string;
  onGoBack?: () => void;
}

const GoBackButton = ({
  rightIcon = <ArrowRight />,
  text = "بازگشت",
  type = "button",
  onGoBack,
  ...rest
}: Props) => {
  const { back } = useRouter();
  const goBackHandler = () => {
    back();
    onGoBack?.();
  };
  return (
    <Button
      type={type}
      onClick={goBackHandler}
      variant="ghost"
      rightIcon={rightIcon}
      {...rest}
    >
      {text}
    </Button>
  );
};

export default GoBackButton;
