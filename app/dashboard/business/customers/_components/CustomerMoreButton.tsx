import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface Props<T = any> {
  row: T;
  id: string;
}

const CustomerMoreButton = ({ row, id }: Props) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">باز کردن منو</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            عملیات برای {row?.name || "کاربر"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/dashboard/business/customers/${id}`}
              className="cursor-pointer"
            >
              پروفایل و تاریخچه نوبت‌ها
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            حذف مشتری
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CustomerMoreButton;
