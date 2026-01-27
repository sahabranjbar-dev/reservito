"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"; // یا Toggle
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Trash2, Save, X, Eye } from "lucide-react";
import { toast } from "sonner";
import { updateUserAction, deleteUserAction } from "../_meta/actions";
import { Role } from "@/constants/enums";

/* ==============================
   Types
============================== */
type UserWithRoles = {
  id: string;
  fullName: string | null;
  phone: string;
  email: string | null;
  avatar: string | null;
  createdAt: Date;
  isActive: boolean;
  roles: { role: Role }[];
  ownedBusinesses: Array<{ businessName: string }>;
};

type ModalMode = "VIEW" | "EDIT" | "DELETE" | null;

/* ==============================
   Component
============================== */

interface UserActionModalsProps {
  user: UserWithRoles | null;
  mode: ModalMode;
  onClose: () => void;
  onSuccess: () => void; // کالبک برای رفرش لیست
}

export default function UserActionModals({
  user,
  mode,
  onClose,
  onSuccess,
}: UserActionModalsProps) {
  // استیت‌های فرم ویرایش
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    isActive: true,
    isSuperAdmin: false,
  });

  // پر کردن فرم وقتی مودال باز می‌شود
  useEffect(() => {
    if (user && mode !== "DELETE") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        isActive: user.isActive,
        isSuperAdmin: user.roles.some((r) => r.role === Role.SUPER_ADMIN),
      });
    }
  }, [user, mode]);

  /* --- مودیتیشن ویرایش --- */
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const fd = new FormData();
      fd.append("userId", user.id);
      fd.append("fullName", formData.fullName);
      fd.append("email", formData.email);
      fd.append("isActive", String(formData.isActive));
      fd.append("isSuperAdmin", String(formData.isSuperAdmin));

      return await updateUserAction(fd);
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res?.message);
        onSuccess();
        onClose();
      } else {
        toast.error(res?.message || res?.error);
      }
    },
  });

  /* --- مودیتیشن حذف --- */
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      return await deleteUserAction(user.id);
    },
    onSuccess: (res) => {
      if (res?.success) {
        toast.success(res.message);
        onSuccess();
        onClose();
      } else {
        toast.error(res?.message);
      }
    },
  });

  if (!user) return null;

  /* --- مودال مشاهده جزئیات --- */
  if (mode === "VIEW") {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye size={20} />
              جزئیات کاربر
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              {/* آواتار کاربر */}
              <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    ?
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {user.fullName || "بدون نام"}
                </h3>
                <p className="text-slate-500 font-mono">{user.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <Label className="text-xs text-slate-500">ایمیل</Label>
                <div className="font-medium">{user.email || "---"}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <Label className="text-xs text-slate-500">وضعیت</Label>
                <Badge
                  className={
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {user.isActive ? "فعال" : "غیرفعال"}
                </Badge>
              </div>
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg">
              <Label className="text-xs text-indigo-500 mb-2 block">
                نقش‌های سراسری
              </Label>
              <div className="flex flex-wrap gap-2">
                {user.roles.map((r) => (
                  <Badge
                    key={r.role}
                    variant="outline"
                    className="border-indigo-200 text-indigo-700"
                  >
                    {r.role}
                  </Badge>
                ))}
                {user.roles.length === 0 && (
                  <span className="text-sm text-slate-400">هیچ نقشی ندارد</span>
                )}
              </div>
            </div>

            <div>
              <Label className="text-xs text-slate-500 mb-2 block">
                بیزنس‌های متعلق به کاربر
              </Label>
              {user.ownedBusinesses.length > 0 ? (
                <ul className="space-y-1">
                  {user.ownedBusinesses.map((b) => (
                    <li
                      key={b.businessName}
                      className="text-sm bg-slate-100 p-2 rounded flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {b.businessName}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-sm text-slate-400">بدون کسب‌وکار</span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  /* --- مودال ویرایش --- */
  if (mode === "EDIT") {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>ویرایش کاربر: {user.fullName}</DialogTitle>
            <DialogDescription>
              اطلاعات پروفایل و نقش‌های کاربر را تغییر دهید.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>نام و نام خانوادگی</Label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>ایمیل</Label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">وضعیت حساب کاربری</Label>
                <p className="text-xs text-muted-foreground">
                  اگر غیرفعال باشد، کاربر نمی‌تواند وارد شود.
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(c) =>
                  setFormData({ ...formData, isActive: c })
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50 border-red-100">
              <div className="space-y-0.5">
                <Label htmlFor="isSuperAdmin" className="text-red-900">
                  دسترسی سوپر ادمین
                </Label>
                <p className="text-xs text-red-600">
                  دسترسی کامل به مدیریت کل سایت.
                </p>
              </div>
              <Switch
                id="isSuperAdmin"
                checked={formData.isSuperAdmin}
                onCheckedChange={(c) =>
                  setFormData({ ...formData, isSuperAdmin: c })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}
              ذخیره تغییرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  /* --- مودال حذف --- */
  if (mode === "DELETE") {
    return (
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 size={20} />
              حذف کاربر
            </DialogTitle>
            <DialogDescription className="text-right">
              آیا از حذف کردن کاربر <strong>{user.fullName}</strong> مطمئن
              هستید؟
              <br />
              این عملیات برگشت‌ناپذیر است.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={deleteMutation.isPending}
            >
              خیر، منصرف شدم
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Trash2 className="mr-2" />
              )}
              بله، حذف کن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
