"use client";
import { BaseField, Combobox, Form, TextCore } from "@/components";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getSlug } from "@/utils/common";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UpdateBusinessInput, updateBusinessSettings } from "../_meta/actions";
import { Check } from "lucide-react";
import { businessOptions } from "@/app/business/auth/register/meta/constants";

interface IForm {
  businessName: string;
  ownerName: string;
  slug: string;
  address?: string | null;
  description?: string | null;
  businessType: string;
}

interface Props {
  defaultValues: IForm;
}

const GeneralForm = ({ defaultValues }: Props) => {
  const { update: updateSession, data: sessionData } = useSession();

  const updateSessionHandler = async ({
    businessName,
    businessType,
    ownerName,
    slug,
    address,
    description,
  }: IForm) => {
    await updateSession({
      user: {
        ...sessionData?.user,
        business: {
          ...sessionData?.user.business,
          slug,
          businessName,
          ownerName,
          address,
          businessType,
          description,
          updatedAt: new Date(),
        },
      },
    });
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: UpdateBusinessInput) => {
      const result = await updateBusinessSettings(data);

      if (!result.success) {
        toast.error(result.error);
        return result;
      }

      toast.success("اطلاعات کسب‌وکار با موفقیت ویرایش شد.");

      const updateBusinessData = result.updateBusiness;

      if (updateBusinessData?.id) {
        updateSessionHandler({
          businessName: updateBusinessData?.businessName,
          businessType: updateBusinessData?.businessType,
          ownerName: updateBusinessData?.ownerName,
          slug: updateBusinessData?.slug,
          address: updateBusinessData?.address,
          description: updateBusinessData?.description,
        });
      }

      return result;
    },
  });
  const onSubmit = async (data: IForm) => {
    await mutateAsync({
      businessName: data.businessName,
      businessType: data.businessType,
      ownerName: data.ownerName,
      slug: data.slug,
      address: data.address,
      description: data.description,
    });
  };
  return (
    <Form defaultValues={defaultValues} onSubmit={onSubmit}>
      {({ setValue }) => {
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BaseField
                name="businessName"
                component={TextCore}
                required
                label="نام کسب‌وکار"
                onChange={(value: string) => {
                  setValue("slug", getSlug(value));
                }}
              />
              <BaseField
                name="ownerName"
                component={TextCore}
                required
                label="نام صاحب کسب‌وکار"
              />

              <BaseField
                name="slug"
                component={TextCore}
                required
                label="نام کسب و کار در url"
                description="این در URL استفاده می‌شود و بهتر است به فارسی بنویسید"
              />

              <BaseField
                name="businessType"
                component={Combobox}
                label="نوع کسب و کار"
                options={businessOptions}
              />
            </div>
            <Separator />

            <BaseField
              name="address"
              component={Textarea}
              label="آدرس"
              rows={2}
              required
            />

            <BaseField
              name="description"
              component={Textarea}
              label="درباره‌ی کسب‌وکار"
              rows={3}
            />

            <div className="pt-4 flex justify-end">
              <Button rightIcon={<Check />} loading={isPending} type="submit">
                ذخیره تغییرات
              </Button>
            </div>
          </div>
        );
      }}
    </Form>
  );
};

export default GeneralForm;
