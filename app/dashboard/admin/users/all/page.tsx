import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import AdminUsersList from "./_components/AdminUsersList";
import { convertToEnglishDigits } from "@/utils/common";

interface Props {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
  }>;
}

const AdminDashboardUsersPage = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.roles?.includes("SUPER_ADMIN")) {
    return <div className="p-10 text-center">دسترسی غیرمجاز</div>;
  }

  const { page, pageSize } = await searchParams;

  const resolvedPage = Number(convertToEnglishDigits(pageSize || "1")) || 1;
  const resolvedPageSize = Number(convertToEnglishDigits(page || "10")) || 10;

  const where: any = {};
  const users = await prisma.user.findMany({
    where,
    skip: (resolvedPage - 1) * resolvedPageSize,
    take: resolvedPageSize,
    include: {
      roles: {
        select: { role: true },
      },
      ownedBusinesses: {
        select: {
          id: true,
          businessName: true,
        },
      },
      staffMembers: {
        select: {
          business: {
            select: { businessName: true, id: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const resultList = users.map((item, index) => ({
    ...item,
    rowNumber: (resolvedPage - 1) * resolvedPageSize + index + 1,
  }));

  const totalItems = await prisma.user.count({
    where,
  });

  const data = {
    resultList,
    totalItems,
    page: resolvedPage,
    pageSize: resolvedPageSize,
    totalPages: Math.ceil(totalItems / resolvedPageSize),
  };

  return (
    <div className="container mx-auto p-6">
      <AdminUsersList data={data} />
    </div>
  );
};

export default AdminDashboardUsersPage;
