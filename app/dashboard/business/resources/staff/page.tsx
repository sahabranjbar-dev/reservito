import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import StaffPage from "./_components/StaffPage"; // اگر فایل کامپوننت را جدا کردید، وگرنه همین فایل است
import { getStaffListAction } from "./_meta/actions";

export default async function StaffPageServer() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth");
  }

  // دریافت بیزنس کاربر (فرض: اولین بیزنس او)
  const business = session.user.business;

  if (!business) {
    return (
      <div className="p-6 text-center">دسترسی غیرمجاز یا بیزنی پیدا نشد.</div>
    );
  }

  // دریافت لیست پرسنل برای اولین رندر
  const staffRes = await getStaffListAction(business.id);
  const initialStaff = staffRes.success ? staffRes.data : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <StaffPage businessId={business.id} initialStaff={initialStaff} />
    </div>
  );
}
