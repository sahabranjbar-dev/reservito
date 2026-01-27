import prisma from "@/utils/prisma";
import AdminBusinessesList from "./_components/AdminBusinessesList";

const AdminDashboardBusinessesPage = async () => {
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
      <AdminBusinessesList initialBusinesses={serializedBusinesses} />
    </div>
  );
};

export default AdminDashboardBusinessesPage;
