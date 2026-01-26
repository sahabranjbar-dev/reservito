import { BusinessType } from "@/constants/enums";
import { convertToEnglishDigits, getSlug } from "@/utils/common";
import { ServerError } from "@/utils/errors";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/* ==============================
   Schema
============================== */
const schema = z.object({
  ownerFullname: z.string().min(2, "نام و نام خانوادگی الزامی است"),
  phone: z.string().min(10, "شماره موبایل الزامی است"),
  businessName: z.string().min(2, "نام کسب‌وکار الزامی است"),
  address: z.string().min(2, "آدرس کسب‌وکار الزامی است"),
  businessType: z.nativeEnum(BusinessType),
  password: z.string().min(6, "رمز عبور حداقل ۶ کاراکتر"),
  username: z.string({ error: "نام کاربری الزامی است" }),
});

/* ==============================
   Helpers
============================== */
const generateUniqueSlug = async (businessName: string) => {
  const baseSlug = getSlug(businessName);

  const existingSlugs = await prisma.business.findMany({
    where: { slug: { startsWith: baseSlug } },
    select: { slug: true },
  });

  if (existingSlugs.length === 0) return baseSlug;

  const numbers = existingSlugs
    .map((b) => b.slug)
    .filter((slug) => slug !== baseSlug)
    .map((slug) => Number(slug.replace(`${baseSlug}-`, "")))
    .filter((n) => !isNaN(n));

  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `${baseSlug}-${next}`;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: true, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      businessName,
      ownerFullname,
      businessType,
      address,
      password,
      phone,
      username,
    } = parsed.data;

    const existUserName = await prisma.business.findFirst({
      where: {
        identifier: username,
      },
    });

    if (existUserName) {
      return NextResponse.json(
        {
          success: false,
          message: `نام کاربری تکراری است `,
        },
        { status: 402 }
      );
    }

    const resolvedPhone = convertToEnglishDigits(phone);
    const passwordHash = await bcrypt.hash(password, 12);
    const slug = await generateUniqueSlug(businessName);

    const business = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { phone: resolvedPhone },
        select: { id: true, roles: true },
      });

      let ownerId: string;

      if (!existingUser) {
        const owner = await tx.user.create({
          data: {
            phone: resolvedPhone,
            fullName: ownerFullname,
            username,
            passwordHash,
            roles: {
              create: {
                role: "BUSINESS_OWNER",
              },
            },
          },
        });

        ownerId = owner.id;
      } else {
        await tx.user.update({
          where: { id: existingUser.id },
          data: {
            passwordHash,
            username,
            ...(existingUser.roles.some((r) => r.role === "BUSINESS_OWNER")
              ? {}
              : {
                  roles: {
                    create: {
                      role: "BUSINESS_OWNER",
                    },
                  },
                }),
          },
        });

        ownerId = existingUser.id;
      }

      return tx.business.create({
        data: {
          businessName,
          slug,
          businessType,
          address,
          identifier: username,
          ownerId,
          ownerName: ownerFullname,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        business,
        credentials: {
          identifier: business.identifier,
        },
        message: `کسب‌وکار ${business.businessName} با موفقیت ایجاد شد`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[CREATE_BUSINESS_ERROR]", error);
    return ServerError();
  }
}
