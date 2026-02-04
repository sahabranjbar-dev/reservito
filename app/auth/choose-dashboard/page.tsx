"use client";
import { useMutation } from "@tanstack/react-query";
import { Briefcase, Loader2, Shield, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { getBusinessMemberHandler, setCustomerRole } from "./_meta/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SignoutButton } from "@/components";

export default function HubPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userId = session?.user.id;
  const businessId = session?.user.business?.id;

  const { mutateAsync: setCustomer, isPending: setCustomerLoading } =
    useMutation({
      mutationFn: async () => {
        if (!userId) return;
        const res = await setCustomerRole(userId);
        return res;
      },
    });

  const {
    mutateAsync: getBusinessMember,
    isPending: getBusinessMemberLoading,
    data: businessMemberData,
  } = useMutation({
    mutationFn: async () => {
      if (!userId || !businessId) return;
      const res = await getBusinessMemberHandler(userId, businessId);
      return res.businessMember;
    },
  });

  // اگر فقط یک نقش دارد، خودکار انتقال بده
  useEffect(() => {
    if (status === "authenticated" && session?.user?.roles) {
      const roles = session.user.roles;

      if (roles.length === 0) {
        setCustomer().then(() => {
          router.push("/dashboard/customer");
        });
      }
      if (roles.length === 1) {
        if (roles.includes("SUPER_ADMIN")) router.push("/dashboard/admin");
        else if (roles.includes("CUSTOMER")) {
          getBusinessMember().then((data) => {
            if (data?.role === "OWNER") {
              return;
            } else if (data?.role === "STAFF") {
              return;
            }
          });
        }
      }
    }
  }, [session, status, router, getBusinessMember, setCustomer]);

  const businessOwnerButtonDisable = useMemo(() => {
    return (
      businessMemberData?.business.registrationStatus === "PENDING" ||
      !businessMemberData?.business.isActive
    );
  }, [businessMemberData]);

  if (status === "loading" || setCustomerLoading || getBusinessMemberLoading)
    return (
      <div className="flex justify-center items-center min-h-screen gap-2">
        <Loader2 className="animate-spin" />
        <span>لطفاً منتظر بمانید...</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-center">پنل کاربری</h1>
        <p className="text-gray-500 text-center mb-8">
          سلام {session?.user?.name}، لطفاً انتخاب کنید به کدام بخش وارد شوید:
        </p>

        <div className="space-y-4">
          {businessMemberData?.role === "OWNER" && (
            <Button
              tooltip={
                businessOwnerButtonDisable
                  ? "کسب‌وکار هنوز تائید و فعال نشده است."
                  : undefined
              }
              variant="ghost"
              onClick={() => {
                if (businessOwnerButtonDisable) {
                  toast.error("کسب‌وکار هنوز تائید و فعال نشده است.");
                  return;
                }
                router.push("/dashboard/business");
              }}
              className="w-full flex items-center justify-center gap-3 p-4 border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 transition group"
            >
              <Briefcase className="text-indigo-600 group-hover:scale-110 transition" />
              <span className="font-bold text-gray-700">
                مدیریت کسب‌وکار {businessMemberData?.business?.businessName}
              </span>
            </Button>
          )}

          {businessMemberData?.role === "STAFF" && (
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/staff")}
              className="w-full flex items-center justify-center gap-3 p-4 border-2 border-orange-100 rounded-xl hover:bg-orange-50 transition group"
            >
              <Briefcase className="text-orange-600 group-hover:scale-110 transition" />
              <span className="font-bold text-gray-700">
                همکار کسب‌وکار {businessMemberData?.business?.businessName}
              </span>
            </Button>
          )}

          {session?.user?.roles.includes("SUPER_ADMIN") && (
            <button
              onClick={() => router.push("/dashboard/admin")}
              className="w-full flex items-center justify-center gap-3 p-4 border-2 border-red-100 rounded-xl hover:bg-red-50 transition group"
            >
              <Shield className="text-red-600 group-hover:scale-110 transition" />
              <span className="font-bold text-gray-700">مدیریت کل سیستم</span>
            </button>
          )}

          {session?.user?.roles.includes("CUSTOMER") && (
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard/customer")}
              className="w-full flex items-center justify-center gap-3 p-4 border-2 border-green-100 rounded-xl hover:bg-green-50 transition group"
            >
              <User className="text-green-600 group-hover:scale-110 transition" />
              <span className="font-bold text-gray-700">مشتری / نوبت‌دهی</span>
            </Button>
          )}
        </div>

        <div className="py-4">
          <SignoutButton />
        </div>
      </div>
    </div>
  );
}
