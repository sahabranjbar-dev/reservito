import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ShiftSettings from "./_components/ShiftSettings";
import BusinessSchedule from "./_components/BusinessSchedule";

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
    <div className="p-4">
      <BusinessSchedule businessId={business.id} />
    </div>
  );
}
