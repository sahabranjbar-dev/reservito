import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Modal } from "@/components";

interface Props {
  id: string;
}
const ServicesListButtons = ({ id }: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <div className="flex justify-center items-center gap-2">
      <Link
        href={`/admin/services/${id}`}
        className="cursor-pointer rounded p-2 text-blue-500 hover:bg-blue-100"
      >
        <Edit size={20} />
      </Link>
      <div>
        <Trash2
          size={40}
          onClick={() => setOpenModal(true)}
          className="cursor-pointer rounded p-2 text-red-500 hover:bg-red-100"
        />

        <Modal
          title={"حذف سرویس"}
          open={openModal}
          onOpenChange={setOpenModal}
          actionLabel="حذف"
          width="md:max-w-2xl"
        >
          <p>{`آیا از حذف این آیتم اطمینان دارید؟`}</p>
        </Modal>
      </div>
    </div>
  );
};

export default ServicesListButtons;
