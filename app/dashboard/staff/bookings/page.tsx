import { authOptions } from "@/utils/authOptions";
import { convertToEnglishDigits } from "@/utils/common";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import BookingList from "./_components/BookingList";
import StaffBookingPagination from "./_components/StaffBookingPagination";

interface Props {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    customerName?: string;
    customerPhone?: string;
    serviceName?: string;
    date?: string | null;
    status?: string;
  }>;
}

export default async function StaffBookingPage({ searchParams }: Props) {
  const {
    page,
    pageSize,
    customerName,
    customerPhone,
    date,
    serviceName,
    status,
  } = await searchParams;

  const session = await getServerSession(authOptions);

  const userId = session?.user.id;

  const businessId = session?.user.business?.id;

  const resolvedPage = Number(convertToEnglishDigits(pageSize || "1")) || 1;
  const resolvedPageSize = Number(convertToEnglishDigits(page || "10")) || 10;

  if (!userId || !businessId) {
    notFound();
  }

  const staff = await prisma.staffMember.findUnique({
    where: {
      businessId_userId: {
        businessId,
        userId,
      },
    },
  });

  if (!staff) {
    notFound();
  }

  const where: any = {
    businessId,
    staffId: staff.id,
    deletedAt: null,
  };

  if (customerPhone) {
    where.customer = {
      ...where.customer,
      phone: { contains: customerPhone },
    };
  }

  if (customerName) {
    where.customer = {
      ...where.customer,
      fullName: { contains: customerName },
    };
  }

  if (serviceName) {
    where.service = {
      name: { contains: serviceName },
    };
  }

  if (status) {
    where.status = status;
  }

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    where.startTime = {
      gte: start,
      lte: end,
    };
  }

  const bookings = await prisma.booking.findMany({
    where,
    skip: (resolvedPage - 1) * resolvedPageSize,
    take: resolvedPageSize,
    orderBy: {
      startTime: "asc",
    },
    include: {
      service: true,
      customer: true,
      staff: true,
    },
  });

  const resultList = bookings.map((item, index) => ({
    ...item,
    rowNumber: (resolvedPage - 1) * resolvedPageSize + index + 1,
  }));

  const totalItems = await prisma.booking.count({
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
    <div className="max-w-lvw">
      {/* Booking List */}
      <BookingList data={data} />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <StaffBookingPagination
          currentPage={data?.page ? data?.page : 1}
          totalCount={data?.totalItems}
          totalPages={data?.totalPages}
        />
      </div>
    </div>
  );
}
