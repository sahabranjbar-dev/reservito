"use server";

import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { z } from "zod";

/* ------------------ Schema ------------------ */

const exceptionSchema = z.object({
  staffId: z
    .string({ error: "شناسه کارمند نامعتبر است" })
    .cuid("شناسه کارمند نامعتبر است"),

  mode: z.enum(["single", "multiple", "range"]),

  singleDate: z.string().optional().nullable(),
  multipleDates: z.array(z.string()).optional(),
  range: z
    .object({
      from: z.string().optional().nullable(),
      to: z.string().optional().nullable(),
    })
    .optional(),

  isClosed: z.boolean().optional(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  reason: z.string().max(500, "دلیل خیلی طولانی است").optional(),
});

/* ------------------ Utils ------------------ */

function getDatesBetween(from: string, to: string): string[] {
  const dates: string[] = [];
  const current = new Date(from);
  const end = new Date(to);

  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export type UpsertStaffExceptions = z.infer<typeof exceptionSchema>;
export async function upsertStaffExceptions(input: UpsertStaffExceptions) {
  /* ---------- Auth ---------- */
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: "دسترسی غیرمجاز" };
  }

  /* ---------- Validation ---------- */
  const parsed = exceptionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: JSON.parse(parsed.error.message) ?? "اطلاعات نامعتبر است",
    };
  }

  const {
    staffId,
    mode,
    singleDate,
    multipleDates,
    range,
    isClosed,
    startTime,
    endTime,
    reason,
  } = parsed.data;

  /* ---------- Staff Ownership ---------- */
  const staff = await prisma.staffMember.findFirst({
    where: {
      id: staffId,
      business: {
        OR: [
          { ownerId: session.user.id },
          { businessMembers: { some: { userId: session.user.id } } },
        ],
      },
    },
  });

  if (!staff) {
    return { success: false, message: "شما به این کارمند دسترسی ندارید" };
  }

  /* ---------- Build Dates ---------- */
  let dates: string[] = [];

  if (mode === "single" && singleDate) {
    dates = [singleDate];
  }

  if (mode === "multiple" && multipleDates?.length) {
    dates = multipleDates;
  }

  if (mode === "range" && range?.from && range?.to) {
    dates = getDatesBetween(range.from, range.to);
  }

  if (!dates.length) {
    return { success: false, message: "هیچ تاریخی انتخاب نشده است" };
  }

  /* ---------- Transaction ---------- */
  await prisma.$transaction(
    dates.map((date) =>
      prisma.staffException.upsert({
        where: {
          staffId_date: {
            staffId,
            date: new Date(date),
          },
        },
        update: {
          isClosed,
          startTime: isClosed ? null : startTime,
          endTime: isClosed ? null : endTime,
          reason: isClosed ? reason : null,
        },
        create: {
          staffId,
          date: new Date(date),
          isClosed,
          startTime: isClosed ? null : startTime,
          endTime: isClosed ? null : endTime,
          reason: isClosed ? reason : null,
        },
      }),
    ),
  );

  return {
    success: true,
    message: "تغییرات با موفقیت ذخیره شد",
  };
}
