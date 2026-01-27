"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Shield,
  User,
  Briefcase,
  MoreHorizontal,
  Search,
  Ban,
  Eye,
} from "lucide-react";
import { Role } from "@prisma/client";
import UserActionModals from "./UserActionModals";

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
  // نشان‌دهنده اینکه آیا مالک بیزنس است؟
  ownedBusinesses: Array<{ businessName: string; id: string }>;
  // نشان‌دهنده عضویت در بیزنس به عنوان استاف (اختیاری)
  staffMembers?: { business: { businessName: string; id: string } }[];
};

interface AdminUsersListProps {
  users: UserWithRoles[];
}

const AdminUsersList = ({ users }: AdminUsersListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [modalMode, setModalMode] = useState<"VIEW" | "EDIT" | "DELETE" | null>(
    null
  );

  // تعریف فیلترها
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.fullName?.includes(searchTerm) || user.phone.includes(searchTerm);

      // منطق نقش‌ها
      const hasSuperAdmin = user.roles.some((r) => r.role === Role.SUPER_ADMIN);
      const hasBusinessOwner = user.ownedBusinesses.length > 0;
      const hasStaff = user.staffMembers && user.staffMembers.length > 0;

      let matchesFilter = true;
      if (filterRole === "SUPER_ADMIN") {
        matchesFilter = hasSuperAdmin;
      } else if (filterRole === "BUSINESS_OWNER") {
        matchesFilter = hasBusinessOwner;
      } else if (filterRole === "CUSTOMER") {
        matchesFilter = !hasSuperAdmin && !hasBusinessOwner && !hasStaff;
      }

      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, filterRole]);

  const handleSuccess = () => {
    window.location.reload(); // راه حل ساده
  };
  const openModal = (mode: typeof modalMode, user: UserWithRoles) => {
    setSelectedUser(user);
    setModalMode(mode);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">مدیریت کاربران</h2>
          <p className="text-sm text-slate-500">
            مشاهده و مدیریت حساب‌های کاربری، ادمین‌ها و صاحبان کسب‌وکار
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-slate-400" />
          <Input
            placeholder="جستجو بر اساس نام یا شماره..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>

        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="فیلتر نقش" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">همه کاربران</SelectItem>
            <SelectItem value="SUPER_ADMIN">سوپر ادمین</SelectItem>
            <SelectItem value="BUSINESS_OWNER">صاحب کسب‌وکار</SelectItem>
            <SelectItem value="CUSTOMER">مشتری عادی</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="text-center">کاربر</TableHead>
              <TableHead className="text-center">نقش‌ها</TableHead>
              <TableHead className="text-center">اطلاعات بیزنس</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              <TableHead className="text-center">تاریخ عضویت</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-slate-500"
                >
                  کاربری یافت نشد.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                // استخراج نقش‌ها برای نمایش
                const isSuperAdmin = user.roles.some(
                  (r) => r.role === Role.SUPER_ADMIN
                );
                const isCustomer =
                  user.roles.some((r) => r.role === Role.CUSTOMER) ||
                  user.roles.length === 0;
                const isBusinessOwner = user.ownedBusinesses.length > 0;

                const isStaff = (user?.staffMembers?.length ?? 0) > 0;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={user.avatar || undefined}
                            alt={user.fullName || ""}
                          />
                          <AvatarFallback>
                            {user.fullName?.substring(0, 2).toUpperCase() ||
                              "UK"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900">
                            {user.fullName || "---"}
                          </div>
                          <div
                            className="text-xs text-slate-500 dir-ltr inline-block"
                            style={{ direction: "ltr" }}
                          >
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {isSuperAdmin && (
                          <Badge variant="destructive" className="bg-red-600">
                            <Shield size={12} className="ml-1" />
                            ادمین کل
                          </Badge>
                        )}
                        {isCustomer && (
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-700"
                          >
                            <User size={12} className="ml-1" />
                            مشتری
                          </Badge>
                        )}
                        {isBusinessOwner && (
                          <Badge
                            variant="outline"
                            className="bg-indigo-50 text-indigo-700 border-indigo-100"
                          >
                            <Briefcase size={12} className="ml-1" />
                            صاحب بیزنس
                          </Badge>
                        )}
                        {isStaff && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-indigo-100"
                          >
                            <Briefcase size={12} className="ml-1" />
                            همکار بیزنس
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      {isBusinessOwner ? (
                        <div className="text-sm font-medium">
                          {user.ownedBusinesses.map((b) => (
                            <div key={b.id} className="text-slate-700">
                              {b.businessName}
                            </div>
                          ))}
                        </div>
                      ) : user.staffMembers?.length ? (
                        user.staffMembers.map((b) => (
                          <div key={b.business.id} className="text-slate-800">
                            <span className="text-gray-500"> همکاری با </span>
                            {b.business.businessName}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 text-sm">ندارد</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={user.isActive ? "outline" : "secondary"}
                        className={
                          user.isActive
                            ? "bg-green-50 text-green-700 border-green-100"
                            : "bg-red-50 text-red-700 border-red-100"
                        }
                      >
                        {user.isActive ? "فعال" : "غیرفعال"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right text-sm text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => openModal("VIEW", user)}
                          >
                            <Eye size={16} className="ml-2" />
                            مشاهده جزئیات
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("EDIT", user)}
                          >
                            <Eye size={16} className="ml-2" />
                            ویرایش
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openModal("DELETE", user)}
                            className="text-red-600"
                          >
                            <Ban size={16} className="ml-2" />
                            غیرفعال کردن
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <UserActionModals
        user={selectedUser}
        mode={modalMode}
        onClose={() => {
          setSelectedUser(null);
          setModalMode(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default AdminUsersList;
