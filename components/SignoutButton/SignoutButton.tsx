"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

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
      leftIcon={<LogOut className="text-white" />}
      variant={"destructive"}
      className="w-full"
      onClick={signoutHandler}
    >
      خروج
    </Button>
  );
};

export default SignoutButton;
