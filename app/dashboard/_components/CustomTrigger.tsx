"use client";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, PanelRightClose } from "lucide-react";

export function CustomTrigger() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="flex items-center justify-center h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label={open ? "بستن نوار کناری" : "باز کردن نوار کناری"}
    >
      {open ? (
        <PanelRightClose className="h-5 w-5 text-gray-700" />
      ) : (
        <div className="flex items-center gap-1">
          <Menu className="h-5 w-5 text-gray-700" />
        </div>
      )}
    </button>
  );
}
