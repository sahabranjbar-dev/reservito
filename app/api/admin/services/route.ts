import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { ServerError } from "@/utils/errors";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const pageSize = Math.min(Number(searchParams.get("pageSize")) || 20, 100);

    const sortBy = searchParams.get("sortField") || "createdAt";
    const sortOrder =
      searchParams.get("sortDirection") === "desc" ? "desc" : "asc";

    const where: any = {};

    const services = await prisma.service.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { [sortBy]: sortOrder },
      where,
      include: {
        calendarRules: true,
        reservations: true,
        workingHours: true,
      },
    });

    const resultList = services.map((item, index) => ({
      ...item,
      rowNumber: (page - 1) * pageSize + index + 1,
    }));

    const totalItems = await prisma.service.count({ where });
    return NextResponse.json(
      {
        resultList,
        totalItems,
        page,
        pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return ServerError();
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json();

    const { title, duration, price, isActive, workingHours, calendarRules } =
      body;

    const service = await prisma.service.create({
      data: {
        title,
        duration,
        price,
        isActive,

        workingHours: {
          create: workingHours.map((w: any) => ({
            weekday: w.weekday,
            startTime: w.startTime,
            endTime: w.endTime,
            isActive: w.isActive,
            englishTitle: w.englishTitle,
          })),
        },

        calendarRules: {
          create: calendarRules.map((r: any) => ({
            type: r.type,
            startDate: new Date(r.startDate),
            endDate: r.endDate ? new Date(r.endDate) : null,
            startTime: r.startTime ?? null,
            endTime: r.endTime ?? null,
            isActive: r.isActive,
          })),
        },
      },
    });

    return NextResponse.json(
      {
        service,
        message: "سرویس با موفقیت ایجاد شد",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return ServerError();
  }
}
