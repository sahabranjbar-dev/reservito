"use client";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/useConfirm";
import { ArrowLeftFromLine } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const HeaderLogOut = () => {
  const confirm = useConfirm();
  const pathname = usePathname();
  const { replace } = useRouter();
  return (
    <>
      <Button
        onClick={() => {
          confirm().then((value) => {
            if (!value) return;
            signOut({
              redirect: false,
            }).then(() => {
              if (pathname.startsWith("/dashboard/business")) {
                replace("/business/auth/login");
                return;
              }
              replace("/auth");
            });
          });
        }}
        type="button"
        variant="ghost"
        className="bg-red-500 text-white group hover:bg-red-500 hover:text-white"
        leftIcon={<ArrowLeftFromLine />}
      >
        <span
          className="
        inline-block
        overflow-hidden
        max-w-0
        opacity-0
        group-hover:max-w-20
        group-hover:opacity-100
        transition-all
        duration-500
        whitespace-nowrap
        "
        >
          خروج
        </span>
      </Button>
    </>
  );
};

export default HeaderLogOut;
