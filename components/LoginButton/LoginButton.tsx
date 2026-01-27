"use client";

import { IdCardLanyard, LogIn, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import LoginForm from "../LoginForm/LoginForm";
import Modal from "../Modal/Modal";
import { getRole } from "@/utils/common";
import { useRouter } from "next/navigation";

interface Props {
  className?: string;
  isModal?: boolean;
}

const LoginButton = ({ className, isModal = true }: Props) => {
  const session = useSession();
  const { refresh } = useRouter();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const isAuthenticated = session.status === "authenticated";

  const loginClickHanlder = () => {
    setOpenModal(true);
  };

  const role = getRole(session.data?.user.roles);

  return (
    <>
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex justify-center items-center gap-2">
            <User className="text-primary" size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-200">
            <DropdownMenuLabel>
              {session?.data?.user?.phone ||
                session?.data?.user?.name ||
                session?.data?.user?.email ||
                "کاربر میهمان"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem dir="rtl">
              <Link
                href={`/auth/choose-dashboard`}
                target="_blank"
                className="flex justify-start items-center gap-2 text-primary"
              >
                <IdCardLanyard className="text-primary" size={20} />
                پروفایل کاربری
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 hover:text-red-500 flex justify-start items-center gap-2"
              onClick={() => {
                signOut();
              }}
            >
              خروج از حساب کاربری
              <LogOut className="text-red-500" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          {isModal ? (
            <>
              <Button
                type="button"
                onClick={loginClickHanlder}
                variant={"ghost"}
                className={clsx(
                  "border border-primary/50 text-primary",
                  className
                )}
                rightIcon={<LogIn />}
              >
                ورود / ثبت‌نام
              </Button>

              <Modal
                title="ورود به حساب کاربری"
                onOpenChange={setOpenModal}
                open={openModal}
                hideActions
                width="md:max-w-xl"
              >
                <LoginForm
                  onLoginSuccess={() => {
                    refresh();
                  }}
                />
              </Modal>
            </>
          ) : (
            <Link
              className={clsx(
                "border border-primary/50 text-primary text-center p-2 rounded-lg",
                className
              )}
              href={"/auth"}
            >
              {" "}
              ورود / ثبت‌نام
            </Link>
          )}
        </>
      )}
    </>
  );
};

export default LoginButton;
