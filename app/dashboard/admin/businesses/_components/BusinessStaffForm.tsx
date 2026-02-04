import { BaseField, Form, TextCore } from "@/components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { upsertStaff } from "../_meta/actions/businessActions";

interface IData {
  businessId: string;
  staffPhone: string;
  staffName: string;
  staffMemberId?: string;
}

const BusinessStaffForm = ({
  data,
  isEdit,
  onCancel,
  onSubmit,
  businessId,
}: any) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: IData) => {
      const result = await upsertStaff(data);

      if (!result?.success) {
        throw new Error(result?.message);
      }
      toast.success(result.message);
      return result;
    },
  });

  const onSubmitHandler = async (values: { name: string; phone: string }) => {
    await mutateAsync({
      businessId: businessId,
      staffName: values?.name,
      staffPhone: values?.phone,
      staffMemberId: data?.id,
    })
      .then(() => {
        onSubmit(values);
      })
      .finally(() => {
        queryClient.invalidateQueries({
          queryKey: ["business-staffs", businessId],
        });
      });
  };
  return (
    <tr className={isEdit ? "bg-blue-50" : "bg-green-50"}>
      <td colSpan={6}>
        {isPending ? (
          <div className="w-full flex justify-center items-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <Form
            defaultValues={{
              name: data?.name ?? "",
              phone: data?.phone ?? "",
            }}
            onSubmit={onSubmitHandler}
          >
            <div className="grid grid-cols-6 gap-2 items-center">
              <div></div>
              <BaseField name="name" component={TextCore} placeholder="نام" />
              <BaseField
                name="phone"
                component={TextCore}
                placeholder="موبایل"
              />

              <div></div>
              <div></div>
              <div className="flex gap-2 justify-end">
                <button
                  type="submit"
                  className={`px-3 py-2 rounded text-xs text-white ${
                    isEdit ? "bg-blue-600" : "bg-green-600"
                  }`}
                >
                  {isEdit ? "ذخیره" : "افزودن"}
                </button>

                <button
                  type="button"
                  onClick={onCancel}
                  className="border px-3 py-2 rounded text-xs"
                >
                  لغو
                </button>
              </div>
            </div>
          </Form>
        )}
      </td>
    </tr>
  );
};

export default BusinessStaffForm;
