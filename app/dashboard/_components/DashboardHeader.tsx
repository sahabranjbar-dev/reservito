import { getServerSession } from "next-auth";
import HeaderContent from "./HeaderContent";
import { authOptions } from "@/utils/authOptions";

// کامپوننت اصلی Async
const DashboardHeader = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;

  return (
    <HeaderContent
      role={
        session
          ? user?.roles?.includes("SUPER_ADMIN")
            ? "admin"
            : user?.business?.businessRole === "OWNER"
              ? "business"
              : user?.business?.businessRole === "STAFF"
                ? "staff"
                : "customer"
          : "customer"
      }
    />
  );
};

export default DashboardHeader;
