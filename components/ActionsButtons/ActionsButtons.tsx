"use client";

import { useList } from "@/container/ListContainer/ListContainer";
import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { Activity, useState } from "react";
import { toast } from "sonner";
import clsx from "clsx";
import Modal from "../Modal/Modal";

interface ActionsButtonsProps<T = any> {
  id: string;
  url: string;
  title: string;
  hasDelete?: boolean;
  queryKey: readonly unknown[];
  className?: string;
  editForm: React.ComponentType<{
    initialData: T;
    onCancel: () => void;
    onSuccess: () => void;
  }>;
}

const ActionsButtons = <T,>({
  id,
  url,
  title,
  queryKey,
  editForm: Form,
  hasDelete = true,
  className,
}: ActionsButtonsProps<any>) => {
  const queryClient = useQueryClient();
  const { fetch } = useList();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  /**
   * =========================
   * Fetch initial data (Lazy)
   * =========================
   */
  const {
    mutateAsync: fetchInitialData,
    data: initialData,
    isPending: isEditLoading,
    reset: resetEditData,
  } = useMutation({
    mutationFn: async () => {
      const res = await api.get(`${url}/${id}`);
      return res.data as T;
    },
    onError(error: AxiosError<{ message: string }>) {
      toast.error(error.response?.data?.message || "خطا در دریافت اطلاعات");
    },
  });

  const onEditClick = async () => {
    setEditOpen(true);
    await fetchInitialData();
  };

  const onEditClose = () => {
    resetEditData();
    setEditOpen(false);
  };

  /**
   * =========================
   * Delete mutation
   * =========================
   */
  const { mutateAsync: deleteItem, isPending: isDeleteLoading } = useMutation({
    mutationFn: async () => {
      const res = await api.delete(url, {
        params: { id },
      });
      return res.data;
    },
    onError(error: AxiosError<{ message: string }>) {
      toast.error(error.response?.data?.message || "خطا در حذف آیتم");
    },
    onSuccess(data: { success: boolean; message?: string }) {
      if (!data?.success) return;
      toast.success(data.message || "آیتم با موفقیت حذف شد");
      fetch();
      setDeleteOpen(false);
    },
  });

  return (
    <div className="flex items-center justify-center gap-2">
      {/* ================= Edit ================= */}
      <Edit
        size={40}
        onClick={onEditClick}
        className="cursor-pointer rounded p-2 text-blue-500 hover:bg-blue-100"
      />

      <Modal
        title={title}
        open={editOpen}
        hideActions
        onOpenChange={(open) => {
          if (!open) onEditClose();
        }}
        width="md:max-w-4xl"
        className={clsx(className, "max-h-[94vh] overflow-scroll")}
      >
        {isEditLoading || !initialData ? (
          <div className="flex min-h-40 items-center justify-center">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          <Form
            initialData={initialData}
            onCancel={onEditClose}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey });
              onEditClose();
            }}
          />
        )}
      </Modal>

      {/* ================= Delete ================= */}
      <Activity mode={hasDelete ? "visible" : "hidden"}>
        <Trash2
          size={40}
          onClick={() => setDeleteOpen(true)}
          className="cursor-pointer rounded p-2 text-red-500 hover:bg-red-100"
        />

        <Modal
          title={title || "حذف آیتم"}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          actionLabel="حذف"
          actionLoading={isDeleteLoading}
          onAction={deleteItem}
          width="md:max-w-2xl"
        >
          <p>{`آیا از حذف این ${title || "آیتم"} اطمینان دارید؟`}</p>
        </Modal>
      </Activity>
    </div>
  );
};

export default ActionsButtons;
