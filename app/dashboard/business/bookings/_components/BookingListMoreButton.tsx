import { Modal } from "@/components";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import BookingDetails from "./BookingDetails";

interface Props {
  id: string;
}

const BookingListMoreButton = ({ id }: Props) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setOpenModal(true);
        }}
        variant="ghost"
        size="icon"
        className="h-9 w-9"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      <Modal
        hideActions
        open={openModal}
        onOpenChange={setOpenModal}
        title="جزئیات رزرو"
      >
        <BookingDetails bookingId={id} />
      </Modal>
    </>
  );
};

export default BookingListMoreButton;
