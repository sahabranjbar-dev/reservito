"use client";

import { getBusinessTypeOptions } from "@/app/business/_meta/utils";
import { Button } from "@/components/ui/button";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ServiceFormModal from "./ServiceFormModal";
import { deleteService } from "../_meta/actions";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/useConfirm";

export default function ServicesClient({
  initialServices,
  staffList,
}: {
  initialServices: any[];
  staffList: any[];
}) {
  const session = useSession();

  const router = useRouter();

  const services = initialServices;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingService, setEditingService] = useState<any>(null);

  const AllbusinessData = getBusinessTypeOptions();

  const userBusiness = AllbusinessData.find(
    (item) => item.id === session.data?.user.business?.businessType,
  );

  const BusinessIcon = userBusiness?.icon;

  const confirm = useConfirm();

  const handleOpenAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (service: any) => {
    await confirm({
      description: "آیا میخواهید این سرویس را حذف کنید؟",
    }).then(async (value) => {
      if (!value) return;
      const result = await deleteService(service?.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
    });
  };

  const handleOpenEdit = (service: any) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const onSuccess = () => {
    setIsModalOpen(false);
    router.refresh();
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">مدیریت خدمات</h2>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 ml-2" />
          افزودن خدمت
        </Button>
      </div>
      <p className="text-slate-500 text-sm mt-1">
        لیست سرویس‌هایی که به مشتریان ارائه می‌دهید.
      </p>

      {services.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service: any) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  {BusinessIcon && <BusinessIcon className="w-6 h-6" />}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(service)}
                    className="p-2  text-indigo-600 bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-8 h-8" />
                  </button>
                  <button
                    onClick={() => handleDelete(service)}
                    className="p-2  text-red-600 bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-8 h-8" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {service.name}
              </h3>
              {service.category && (
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md mb-3 inline-block">
                  {service.category.name}
                </span>
              )}

              <div className="flex items-end justify-between border-t border-slate-100 pt-4 mt-4">
                <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                  {/* نمایش تعداد پرسنل مجاز */}
                  <span className="font-bold text-slate-700">
                    {service.staff.length}
                  </span>{" "}
                  پرسنل مجاز
                </div>
                {service.price && (
                  <div className="font-bold text-indigo-600 text-lg">
                    {parseInt(service.price).toLocaleString()}{" "}
                    <span className="text-xs font-normal text-slate-400">
                      تومان
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 border bg-gray-100 rounded-2xl w-full flex justify-center items-center">
          <p>هنوز سرویسی ثبت نشده است</p>
        </div>
      )}

      {/* Modal */}
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{ ...editingService, staffList }}
        onSuccess={onSuccess}
      />
    </div>
  );
}
