import prisma from "@/utils/prisma";
import AdminBusinessesList from "./_components/AdminBusinessesList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

const AdminDashboardBusinessesPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div className="p-8 text-center">دسترسی غیرمجاز</div>;
  }
  // دریافت لیست کسب و کارها به همراه مالکشان
  const businesses = await prisma.business.findMany({
    orderBy: {
      createdAt: "desc", // جدیدترین‌ها اول
    },
    include: {
      owner: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          email: true,
        },
      },
    },
  });

  // تبدیل داده‌ها به JSON ساده (چون نمی‌توان آبجکت پرایزما را مستقیم به کلاینت فرستاد اگر Date یا BigInt دارد)
  // در نکست جی اس ۱۵+ نیازی به JSON.stringify نیست، اما برای اطمینان:
  const serializedBusinesses = JSON.parse(JSON.stringify(businesses));

  return (
    <div className="container mx-auto py-8">
      {/* پاس دادن داده‌ها به کامپوننت کلاینت */}
      <AdminBusinessesList businesses={serializedBusinesses} />
    </div>
  );
};

export default AdminDashboardBusinessesPage;
