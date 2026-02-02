"use client";
import { BaseField, Form, FormButtons, Modal } from "@/components";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const AddNote = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const onSubmit = ({ note }: { note: string }) => {
    toast.info("این قابلیت به‌زودی فعال می‌شود.");
  };
  return (
    <>
      <Button
        onClick={() => {
          setOpenModal(true);
        }}
        rightIcon={<Plus />}
        variant="outline"
        className="w-full"
      >
        افزودن یادداشت جدید
      </Button>

      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="یادداشت"
        hideActions
      >
        <Form onSubmit={onSubmit}>
          <BaseField
            name="note"
            component={Textarea}
            label="یادداشت"
            required
            description="این یادداشت محرمانه میباشد و فقط شما و همکارانتان میبیند و مشتری به این دسترسی ندارد"
          />
          <FormButtons
            className="justify-self-end"
            onCancel={() => {
              setOpenModal(false);
            }}
          />
        </Form>
      </Modal>
    </>
  );
};

export default AddNote;
