import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ShiftSettings from "./_components/ShiftSettings";

export default async function ShiftsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // دریافت اولین بیزنس کاربر (یا انتخاب بیزنس اگر چند تا دارد)
  // در اینجا ساده‌سازی می‌کنیم و فرض می‌کنیم اولین بیزنس او را می‌خواهیم ویرایش کند
  const business = session.user.business;

  if (!business) {
    return <div className="p-6 text-center">کسب‌وکاری یافت نشد.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ShiftSettings businessId={business.id} />
    </div>
  );
}
