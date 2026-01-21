import prisma from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ServerError } from "@/utils/errors";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const password = url.searchParams.get("password");
  const secret = process.env.SEED_SECRET;

  if (secret !== password) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const adminMobilesEnv = process.env.ADMIN_MOBILES;

    if (!adminMobilesEnv) {
      throw new Error("ADMIN_MOBILES is not defined in .env");
    }

    const adminMobiles = adminMobilesEnv
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    for (const mobile of adminMobiles) {
      await prisma.user.upsert({
        where: { phone: mobile },
        update: {
          role: "ADMIN",
          isActive: true,
        },
        create: {
          phone: mobile,
          role: "ADMIN",
          isActive: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "ادمین‌ها ساخته/آپدیت شدند",
    });
  } catch (error) {
    console.error(error);
    return ServerError();
  }
}
