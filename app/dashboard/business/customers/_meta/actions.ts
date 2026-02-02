"use server";

import { authOptions } from "@/utils/authOptions";
import { convertToEnglishDigits } from "@/utils/common";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";

// تابع دریافت لیست مشتریان
export async function getCustomers(
  userNameOrPhone?: string,
  inputPage?: string,
  inPutPageSize?: string,
) {
  try {
    const session = await getServerSession(authOptions);

    const resolvedUserNameOrPhone = convertToEnglishDigits(
      userNameOrPhone || "",
    );

    const searchValue = resolvedUserNameOrPhone
      ? decodeURIComponent(resolvedUserNameOrPhone).trim()
      : "";

    const page = Number(convertToEnglishDigits(inputPage || "1")) || 1;
    const pageSize =
      Number(convertToEnglishDigits(inPutPageSize || "10")) || 10;

    const where: any = {
      bookings: {
        some: {
          businessId: session?.user.business?.id,
        },
      },
      ...(searchValue && {
        OR: [
          {
            fullName: {
              contains: searchValue,
              mode: "insensitive", // مهم
            },
          },
          {
            phone: {
              contains: searchValue,
            },
          },
        ],
      }),
    };
    const customers = await prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        bookings: {
          where: {
            businessId: session?.user.business?.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    const mappedCustomers = customers.map((customer, index) => {
      const bookings = customer.bookings;

      return {
        id: customer.id,
        name: customer.fullName ?? "—",
        phone: customer.phone,
        totalBookings: bookings.length,
        lastBooking: bookings[0]?.createdAt ?? null,
        firstBooking: bookings[bookings.length - 1]?.createdAt ?? null,
        rowNumber: (page - 1) * pageSize + index + 1,
        isActive: customer.isActive,
      };
    });

    const totalItems = await prisma.user.count({
      where,
    });

    return {
      success: true,
      data: {
        resultList: mappedCustomers,
        totalItems,
        page,
        pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return {
      success: false,
      error: "خطا در ارتباط با سرور برای دریافت لیست مشتریان",
    };
  }
}
