import { authOptions } from "@/utils/authOptions";
import { getRole } from "@/utils/common";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const BusinessDashboard = async () => {
  const session = await getServerSession(authOptions);

  const role = getRole(session?.user?.roles);

  redirect("/dashboard/" + role);
};

export default BusinessDashboard;
