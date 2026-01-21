"use client";
import { signOut } from "next-auth/react";
import React, { useCallback } from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const SignoutButton = () => {
  const signoutHandler = useCallback(() => {
    signOut();
  }, []);
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
