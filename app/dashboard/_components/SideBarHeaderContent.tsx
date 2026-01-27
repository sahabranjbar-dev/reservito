"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { getEnglishLabel } from "../_meta/utils";
import { JSX, useMemo } from "react";

type UserRole = "CUSTOMER" | "SUPER_ADMIN";

const SideBarHeaderContent = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const role = getEnglishLabel(pathname) as UserRole;

  const displayName =
    session?.user.business?.ownerName || session?.user.name || "کاربر";

  const phone = session?.user.phone;

  const businessRole = session?.user?.business?.businessRole;

  const roleContentMap: Record<UserRole, JSX.Element> = {
    CUSTOMER:
      businessRole === "OWNER" && pathname.startsWith("/dashboard/business") ? (
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-slate-800 text-sm truncate max-w-35">
            {session?.user.business?.businessName}
          </span>
          <span className="text-xs text-slate-500">
            مدیر: {session?.user.business?.ownerName || "—"}
          </span>
        </div>
      ) : businessRole === "STAFF" &&
        pathname.startsWith("/dashboard/staff") ? (
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-slate-800 text-sm truncate max-w-35">
            {session?.user.name || session?.user.phone || "همکار"}
          </span>
          <span className="text-xs text-slate-500">
            همکار در مجموعه {session?.user.business?.businessName ?? ""}
          </span>
        </div>
      ) : (
        <div className="flex flex-col overflow-hidden">
          <span className="font-bold text-slate-800 text-sm truncate max-w-35">
            {session?.user.name || session?.user.phone || "کاربر مهمان"}
          </span>
          <span className="text-xs text-slate-500">{phone || "—"}</span>
        </div>
      ),

    SUPER_ADMIN: (
      <div className="flex flex-col overflow-hidden">
        <span className="font-bold text-slate-800 text-sm truncate max-w-35">
          {session?.user.name || "ادمین"}
        </span>
        <span className="text-xs text-rose-600 font-medium">مدیر سیستم</span>
      </div>
    ),
  };

  const content = useMemo(() => {
    return roleContentMap[role] ?? roleContentMap.CUSTOMER;
  }, [role, session]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-12 w-12 ring-2 ring-primary/20 shadow-sm">
            <AvatarImage
              src={session?.user.image || "/images/placeholder.png"}
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* online indicator */}
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-50" />
        </div>

        {content}
      </div>
    </div>
  );
};

export default SideBarHeaderContent;
