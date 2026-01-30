import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { DiscountTable } from "./_components/DiscountTable";

const DiscountBusinessDashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div className="p-8 text-center">دسترسی غیرمجاز</div>;
  }

  const businessMember = await prisma.businessMember.findFirst({
    where: {
      userId: session.user.id,
      role: "OWNER", // یا STAFF
      business: {
        isActive: true,
      },
    },
    select: {
      businessId: true,
    },
  });

  if (!businessMember) {
    return <div className="p-8 text-center">شما بیزینسی ندارید.</div>;
  }

  const businessId = businessMember.businessId;

  // دریافت تخفیف‌ها
  const discounts = await prisma.discount.findMany({
    where: {
      businessId: businessId,
      // می‌توانیم تخفیف‌های پلتفرم را هم بگیریم اگر بخواهیم، ولی اینجا فقط تخفیف‌های بیزنس
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      code: true,
      type: true,
      value: true,
      status: true,
      maxDiscount: true,
      minOrderAmount: true,
      usageLimit: true,
      usedCount: true,
      startsAt: true,
      expiresAt: true,
    },
  });

  return (
    <div className="p-6 lg:p-8 bg-slate-50 min-h-screen" dir="rtl">
      <div className="mx-auto max-w-6xl">
        <DiscountTable discounts={discounts as any} businessId={businessId} />
      </div>
    </div>
  );
};

export default DiscountBusinessDashboardPage;
