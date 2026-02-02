"use client";
import { BaseField, Form, TextCore } from "@/components";
import { Button } from "@/components/ui/button";
import { convertToEnglishDigits } from "@/utils/common";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const CustomerSearch = () => {
  const searchParams = useSearchParams();

  const initialValue = searchParams.get("userNameOrPhone");

  const { replace } = useRouter();
  const onSubmit = ({ userNameOrPhone }: { userNameOrPhone: string }) => {
    const params = new URLSearchParams();

    params.append("userNameOrPhone", convertToEnglishDigits(userNameOrPhone));

    replace(`/dashboard/business/customers?${params}`);
  };

  const clearParamsHandler = () => {
    const params = new URLSearchParams();

    params.delete("userNameOrPhone");

    replace(`/dashboard/business/customers?${params}`);
  };
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400" />

      <Form onSubmit={onSubmit}>
        {({ reset, watch }) => {
          return (
            <div className="flex justify-start items-center gap-2">
              <BaseField
                name="userNameOrPhone"
                component={TextCore}
                placeholder="جستجو در نام یا شماره تماس..."
                defaultValue={initialValue}
                containerClassName="flex-1"
                icon={
                  watch("userNameOrPhone") && (
                    <X
                      size={20}
                      className="text-red-500 cursor-pointer"
                      onClick={() => {
                        clearParamsHandler();
                        reset();
                      }}
                    />
                  )
                }
              />

              <Button
                disabled={!watch("userNameOrPhone")}
                type="submit"
                variant="outline"
                className="mb-2"
              >
                <Search />
              </Button>
            </div>
          );
        }}
      </Form>
    </div>
  );
};

export default CustomerSearch;
