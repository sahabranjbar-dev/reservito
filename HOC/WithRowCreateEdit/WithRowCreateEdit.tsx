/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useList } from "@/container/ListContainer/ListContainer";
import { ComponentType, JSX } from "react";

export interface RowFormProps<T = any> {
  data?: T;
  isEdit: boolean;
  businessId: string;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

interface WithRowCreateEditProps {
  businessId: string;
}

export default function WithRowCreateEdit<T>(
  Component: ComponentType<RowFormProps<T>>,
  { businessId }: WithRowCreateEditProps,
) {
  return function WrappedRowForm({
    data,
  }: {
    data?: T & { id?: string };
  }): JSX.Element | null {
    const { isCreating, setIsCreating, editingRowId, setEditingRowId } =
      useList();

    const isEdit = !!data?.id;

    if (!isEdit && !isCreating) return null;
    if (isEdit && editingRowId !== data?.id) return null;

    return (
      <Component
        data={data}
        isEdit={isEdit}
        businessId={businessId}
        onSubmit={() => {
          if (isEdit) {
            setEditingRowId?.(null);
          } else {
            setIsCreating?.(false);
          }
        }}
        onCancel={() => {
          isEdit ? setEditingRowId?.(null) : setIsCreating?.(false);
        }}
      />
    );
  };
}
