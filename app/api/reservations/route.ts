import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { combineDateAndTime } from "@/utils/common";

type Body = {
  serviceId: string;
  startAt: string;
  source: "ONLINE" | "WALK_IN" | "PHONE";
  notes?: string;
};

export async function POST(req: Request) {
  const body: Body = await req.json();

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  const service = await prisma.service.findUnique({
    where: { id: body.serviceId },
    include: { workingHours: true },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const startAt = new Date(body.startAt);
  const endAt = new Date(startAt.getTime() + service.duration * 60000);

  const weekday = startAt.getDay();
  const workingHour = service.workingHours.find(
    (w) => w.weekday === weekday && w.isActive
  );

  if (!workingHour) {
    return NextResponse.json(
      { error: "No working hours for this day" },
      { status: 400 }
    );
  }

  const dayStart = combineDateAndTime(startAt, workingHour.startTime);
  const dayEnd = combineDateAndTime(startAt, workingHour.endTime);

  if (startAt < dayStart || endAt > dayEnd) {
    return NextResponse.json(
      { error: "Time is outside working hours" },
      { status: 400 }
    );
  }

  // Transaction to avoid race condition
  const reservation = await prisma.$transaction(async (tx) => {
    const conflict = await tx.reservation.findFirst({
      where: {
        serviceId: body.serviceId,
        status: { not: "CANCELED" },
        AND: [{ startAt: { lt: endAt } }, { endAt: { gt: startAt } }],
      },
    });

    if (conflict) {
      throw new Error("CONFLICT");
    }

    const newReservation = await tx.reservation.create({
      data: {
        userId,
        serviceId: body.serviceId,
        startAt,
        endAt,
        source: body.source,
        notes: body.notes,
        status: "PENDING",
        createdById: userId,
      },
    });

    return newReservation;
  });

  return NextResponse.json(reservation, { status: 201 });
}
