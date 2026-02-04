import { Modal } from "@/components";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreVertical,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import ViewUser from "./ViewUser";
import EditUser from "./EditUser";

interface Props {
  id: string;
}

const AdminUserActionButton = ({ id }: Props) => {
  const [openModal, setOpenModal] = useState<{
    type?: "edit" | "view";
    isOpen: boolean;
  }>({ isOpen: false, type: "view" });
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setOpenModal({ type: "view", isOpen: true });
              }}
              className="flex justify-around items-center"
            >
              <Eye />
              مشاهده
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpenModal({ type: "edit", isOpen: true });
              }}
              className="flex justify-around items-center"
            >
              <PencilIcon />
              ویرایش
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        title={`${openModal.type === "view" ? "مشاهده" : "ویرایش"} اطلاعات کاربر`}
        open={openModal.isOpen}
        onOpenChange={(value) => {
          setOpenModal((prev) => ({ ...prev, isOpen: value }));
        }}
      >
        {openModal.type === "view" ? (
          <ViewUser id={id} />
        ) : (
          <EditUser id={id} />
        )}
      </Modal>
    </>
  );
};

export default AdminUserActionButton;
