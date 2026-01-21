"use client";

import { useScrollDirection } from "@/hooks/useScrollDirection";
import LoginButton from "../LoginButton/LoginButton";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const Header = () => {
  const isHidden = useScrollDirection();
  const pathname = usePathname();

  const hiddenRoutes = ["/auth", "/customer", "/admin", "/secretary"];
  if (hiddenRoutes.some((r) => pathname.startsWith(r))) return null;

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 bg-linear-to-t from-transparent to-white transition-transform duration-300",
        isHidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="flex justify-between items-center container m-auto border rounded-2xl p-4">
        <div>hum</div>

        <div>logo</div>

        <LoginButton />
      </div>
    </header>
  );
};

export default Header;
