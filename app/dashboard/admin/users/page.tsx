import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import AdminUsersList from "./_components/AdminUsersList";

const AdminDashboardUsersPage = async () => {
  const session = await getServerSession(authOptions);

  // چک کردن اینکه آیا خود سوپر ادمین هست یا نه (اختیاری)
  if (!session?.user?.roles?.includes("SUPER_ADMIN")) {
    return <div className="p-10 text-center">دسترسی غیرمجاز</div>;
  }

  // دریافت کاربران به همراه نقش‌ها و بیزنس‌هایشان
  const users = await prisma.user.findMany({
    include: {
      roles: {
        select: { role: true },
      },
      ownedBusinesses: {
        select: {
          id: true,
          businessName: true,
        },
      },
      // اگر می‌خواهید بدانید استاف کجاهاست (اختیاری)
      staffMembers: {
        // این رابطه باید در مدل یوزر تعریف شده باشد
        select: {
          business: {
            select: { businessName: true, id: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto p-6">
      <AdminUsersList users={JSON.parse(JSON.stringify(users))} />
    </div>
  );
};

export default AdminDashboardUsersPage;
