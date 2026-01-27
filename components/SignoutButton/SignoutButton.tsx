"use client";
import { signOut } from "next-auth/react";
import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const SignoutButton = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const signoutHandler = () => {
    signOut({
      redirect: false,
    }).then(() => {
      if (!pathname.includes("/dashboard")) return;

      replace("/");
    });
  };
  return (
    <Button
      leftIcon={<LogOut />}
      variant={"destructive"}
      className="w-full"
      onClick={signoutHandler}
    >
      خروج
    </Button>
  );
};

export default SignoutButton;
