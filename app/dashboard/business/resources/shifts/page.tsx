import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ShiftSettings from "./_components/ShiftSettings";

export default async function ShiftsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const business = session.user.business;

  if (!business) {
    return <div className="p-6 text-center">کسب‌وکاری یافت نشد.</div>;
  }

  return (
    <div className="p-4">
      <ShiftSettings businessId={business.id} />
    </div>
  );
}
