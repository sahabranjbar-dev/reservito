import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ServicesClient from "./_components/ServicesClient";
import { authOptions } from "@/utils/authOptions";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth");

  const business = session?.user.business;

  if (!business) redirect("/dashboard/setup"); // اگر بیزنس نیست

  const data = await prisma.service.findMany({
    where: { businessId: business.id, deletedAt: null },
    include: {
      staff: { include: { staff: true } }, // لود کردن پرسنل مرتبط
    },
  });

  const staff = await prisma.staffMember.findMany({
    where: { businessId: business.id, isActive: true },
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <ServicesClient initialServices={data} staffList={staff} />
    </div>
  );
}
