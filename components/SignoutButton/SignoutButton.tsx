"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useConfirm } from "@/hooks/useConfirm";

const SignoutButton = () => {
  const pathname = usePathname();
  const { replace } = useRouter();

  const confirm = useConfirm();

  const signoutHandler = () => {
    confirm({
      title: "خروج از داشبورد",
      description: "آیا میخواهید از داشبورد خارج شوید؟",
    }).then((value) => {
      if (!value) return;
      signOut({
        redirect: false,
      }).then(() => {
        if (
          !pathname.includes("/dashboard") &&
          !pathname.includes("/choose-dashboard")
        )
          return;

        replace("/");
      });
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
