"use client";

import { usePathname } from "next/navigation";
import React from "react";

const Footer = () => {
  const pathname = usePathname();

  const hiddenRoutes = ["/auth", "/customer", "/admin", "/secretary"];
  if (hiddenRoutes.some((r) => pathname.startsWith(r))) return null;

  return (
    <footer>
      <div className="p-4">footer</div>
    </footer>
  );
};

export default Footer;
