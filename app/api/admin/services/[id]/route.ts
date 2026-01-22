import { authOptions } from "@/utils/authOptions";
import { ServerError } from "@/utils/errors";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id: serviceId } = await params;
    const { title, duration, price, isActive, workingHours, calendarRules } =
      await req.json();

    const service = await prisma.$transaction(async (tx) => {
      await tx.workingHour.deleteMany({ where: { serviceId } });

      const updated = await tx.service.update({
        where: { id: serviceId },
        data: {
          title,
          duration,
          price,
          isActive,

          workingHours: {
            deleteMany: {},
            create: workingHours.map((w: any) => ({
              weekday: w.weekday,
              startTime: w.startTime,
              endTime: w.endTime,
              isActive: w.isActive,
              englishTitle: w.englishTitle,
            })),
          },

          calendarRules: {
            deleteMany: {},
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
        include: { workingHours: true },
      });

      return updated;
    });

    return NextResponse.json(
      {
        service,
        message: "سرویس با موفقیت ویرایش شد",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return ServerError();
  }
}
