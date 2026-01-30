import HeaderContent from "./HeaderContent";

type UserRoleType = "admin" | "business" | "staff" | "customer";

function getUserRole(session: any): UserRoleType {
  // لازم است Role را ایمپورت کنید یا از جایی دیگر دریافت کنید
  // اینجا برای جلوگیری از خطا فرض می‌کنیم Role موجود است
  // import { Role } from "@/constants/enums";
  if (session?.user?.roles?.includes("SUPER_ADMIN")) {
    // Placeholder for Role enum
    return "admin";
  }
  if (session?.user?.business?.businessRole === "OWNER") {
    return "business";
  }
  if (session?.user?.business?.businessRole === "STAFF") {
    return "staff";
  }
  return "customer";
}

function getRoleDisplayName(role: UserRoleType): string {
  const roleNames: Record<UserRoleType, string> = {
    admin: "مدیر سیستم",
    business: "صاحب کسب‌وکار",
    staff: "کارمند",
    customer: "مشتری",
  };
  return roleNames[role];
}

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// کامپوننت اصلی Async
const DashboardHeader = async () => {
  // دریافت سشن در سمت سرور
  // const session = await getServerSession(authOptions);

  // داده فیک برای اینکه کد در اینجا خطا ندهد (در پروژه واقعی خط بالا را فعال کنید)
  const session = {
    user: {
      name: "علی محمدی",
      email: "ali@example.com",
      roles: [],
      business: { businessRole: "OWNER" },
    },
  };

  const role = getUserRole(session);
  const user = session?.user;
  const roleName = getRoleDisplayName(role);
  const initials = getInitials(user?.name);

  return (
    <HeaderContent
      user={user}
      role={role}
      roleName={roleName}
      initials={initials}
    />
  );
};

export default DashboardHeader;
