/* eslint-disable react-hooks/preserve-manual-memoization */
import { CustomTable } from "@/components";
import PaginationWrapper from "@/components/Pagination/Pagination";
import ListDataProvider from "@/container/ListDataProvider/ListDataProvider";
import WithRowCreateEdit from "@/HOC/WithRowCreateEdit/WithRowCreateEdit";
import { ITableColumns } from "@/types/Table";
import { getFullDateTime } from "@/utils/common";
import { Edit, Trash2 } from "lucide-react";
import { useMemo } from "react";
import BusinessStaffForm from "./BusinessStaffForm";
import { useList } from "@/container/ListContainer/ListContainer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStaffByAdmin } from "../_meta/actions/businessActions";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";

interface Props {
  data: any;
  loading: boolean;
  businessId: string;
}

const BusinessStaffList = ({ data, businessId, loading }: Props) => {
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const onPageChange = () => {};

  const { mutateAsync: deleteStaff } = useMutation({
    mutationFn: async (data: { staffMemberId: string }) => {
      const result = await deleteStaffByAdmin(data);

      if (!result.success) {
        throw new Error(result.message);
      }

      toast.success(result.message);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["business-staffs", businessId],
      });
    },
  });

  const { setEditingRowId } = useList();

  const columns = useMemo<ITableColumns[]>(
    () => [
      { field: "rowNumber", title: "ردیف" },
      { field: "name", title: "نام" },
      { field: "phone", title: "موبایل" },
      { field: "services", title: "سرویس‌ها", render: (v) => v.length },
      {
        field: "createdAt",
        title: "تاریخ ثبت‌نام",
        render: (v) => getFullDateTime(v),
      },
      {
        field: "id",
        title: "عملیات",
        render: (id) => {
          return (
            <div className="flex justify-center items-center gap-2">
              <Edit
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  setEditingRowId?.(id);
                }}
              />
              <Trash2
                className="text-red-500 cursor-pointer"
                onClick={() => {
                  confirm({
                    description: "آیا میخواهید این همکار را حذف کنید؟",
                  }).then(async (value) => {
                    if (!value) return;
                    await deleteStaff({ staffMemberId: id });
                  });
                }}
              />
            </div>
          );
        },
      },
    ],
    [confirm, deleteStaff, setEditingRowId],
  );
  return (
    <ListDataProvider>
      <CustomTable
        columns={columns}
        RowForm={WithRowCreateEdit(BusinessStaffForm, { businessId })}
      />
      <PaginationWrapper
        currentPage={data.page}
        loading={loading}
        onPageChange={onPageChange}
      />
    </ListDataProvider>
  );
};

export default BusinessStaffList;
