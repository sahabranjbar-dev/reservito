import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BusinessBookingsTable from "../_components/BusinessBookingsTable";
import { BookingStatus } from "@/constants/enums";

interface Props {
  searchParams?: Promise<{
    page: number;
    pageSize: number;
    customerName?: string;
    customerPhone?: string;
    serviceName?: string;
    staffName?: string;
    date?: string;
    status?: BookingStatus;
  }>;
}

const BusinessUserBookingsPage = async ({ searchParams }: Props) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth");
  }

  // دریافت رزروهای بیزنی که این کاربر صاحبش است
  const business = session.user.business;

  if (!business) {
    // اگر بیزنی نیست
    return <div className="p-6">بیزنی پیدا نشد.</div>;
  }
  const page = Number((await searchParams)?.page || 1);

  const pageSize = Number((await searchParams)?.pageSize || 10);

  const customerName = (await searchParams)?.customerName;

  const customerPhone = (await searchParams)?.customerPhone;

  const serviceName = (await searchParams)?.serviceName;

  const staffName = (await searchParams)?.staffName;

  const date = (await searchParams)?.date;

  const status = (await searchParams)?.status;

  const where: any = {
    businessId: business.id,
    deletedAt: null,
    customer: {
      phone: {
        contains: customerPhone,
      },
      fullName: {
        contains: customerName,
      },
    },
    staff: {
      name: {
        contains: staffName,
      },
    },
    service: {
      name: {
        contains: serviceName,
      },
    },
    startTime: date,
    status: status,
  };

  const bookings = await prisma.booking.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      customer: true,
      service: true,
      staff: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const resolveBookings = bookings.map((item, index) => ({
    ...item,
    rowNumber: (page - 1) * pageSize + index + 1,
  }));

  const totalItems = await prisma.booking.count({
    where,
  });

  const data = {
    resultList: resolveBookings,
    totalItems,
    page,
    pageSize,
    totalPages: Math.ceil(totalItems / pageSize),
  };

  return <BusinessBookingsTable data={data} />;
};

export default BusinessUserBookingsPage;
