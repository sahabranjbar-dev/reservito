// مثال نحوه استفاده در page.tsx
import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CustomerDashboardBookmarks from "./_components/CustomerDashboardBookmarks";

const CustomerBookmarksPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // دریافت لیست بیزنس‌های لایک شده توسط کاربر (فرض: در جدول User فیلدی دارید یا جدول جداگانه دارید)
  // در اینجا من فقط یک Mock برمی‌گردانم، شما باید اینجا کوئری واقعی بزنید
  const favorites = [
    {
      id: "1",
      slug: "negar-beauty",
      businessName: "آرایشگاه نگار",
      businessType: "SALON",
      banner: "/images/placeholder.png",
      address: "تهران، جردن",
      rating: 4.9,
    },
    {
      id: "2",
      slug: "physical-gym",
      businessName: "باشگاه فیزیکال",
      businessType: "GYM",
      banner: "/images/placeholder.png",
      address: "تهران، ونک",
      rating: 4.6,
    },
    // ... بقیه دیتا
  ];

  return <CustomerDashboardBookmarks favorites={favorites} />;
};

export default CustomerBookmarksPage;
