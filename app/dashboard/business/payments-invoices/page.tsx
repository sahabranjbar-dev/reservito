import { redirect } from "next/navigation";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import PaymentsClient from "./_components/PaymentsClient";

const BusinessPaymentsInvoicesPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // پیدا کردن بیزنس مرتبط با کاربر (اینجا فرض می‌کنیم مالک است)
  // از آنجایی که ساختار اسکیمای شما پیچیده شده، بیاییم بیزنس را پیدا کنیم
  const businessMember = await prisma.businessMember.findFirst({
    where: {
      userId: session.user.id,
      role: "OWNER", // یا نقش مناسب طبق اسکیمای BusinessRole
    },
    include: {
      business: true,
    },
  });

  if (!businessMember) {
    return <div className="p-10 text-center">شما هیچ کسب‌وکاری ندارید.</div>;
  }

  const businessId = businessMember.business.id;

  // دریافت لیست پرداخت‌ها با جوین کردن تمام اطلاعات لازم
  const payments = await prisma.payment.findMany({
    where: {
      businessId: businessId,
    },
    include: {
      booking: {
        include: {
          customer: {
            select: {
              fullName: true,
              phone: true,
            },
          },
          service: {
            select: {
              name: true,
            },
          },
          staff: {
            select: {
              name: true,
            },
          },
        },
      },
      commission: true, // برای محاسبه سهم بیزنس و کمیسیون
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // تبدیل Date به String برای ارسال به کلاینت (اگر لازم باشد، البته React معمولا Date را هندل می‌کند)
  // اما برای اطمینان از JSON stringify:
  const serializedPayments = JSON.parse(JSON.stringify(payments));
  console.log({ serializedPayments, payments });

  return (
    <div className="container mx-auto p-6">
      <PaymentsClient payments={serializedPayments} />
    </div>
  );
};

export default BusinessPaymentsInvoicesPage;
