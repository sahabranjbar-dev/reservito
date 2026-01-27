import { convertToEnglishDigits } from "@/utils/common";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";
import { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: string;
    phone: string | null;
    roles: string[];
    business?: IBusiness | null;
  }

  interface Session {
    user: {
      id: string;
      phone: string | null;
      roles: string[];
      business?: IBusiness | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string | null;
    roles: string[];
    business?: IBusiness | null;
  }
}

interface IBusiness {
  id: string;
  slug: string;
  businessName: string;
  ownerName: string;
  address: string | null;
  ownerId: string;
  identifier: string;
  isActive: boolean;
  businessType: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  businessRole?: "OWNER" | "STAFF";
}

export const authOptions: AuthOptions = {
  providers: [
    /* =====================================
       OTP LOGIN (CUSTOMER)
    ===================================== */
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: {
        phone: { label: "شماره موبایل", type: "text" },
        code: { label: "کد یکبار مصرف", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.phone || !credentials.code) return null;

        const phone = convertToEnglishDigits(credentials.phone);
        const code = convertToEnglishDigits(credentials.code);

        const otp = await prisma.otpCode.findUnique({ where: { phone } });
        if (!otp || otp.expiresAt < new Date()) return null;

        const isValid = await bcrypt.compare(code, otp.codeHash);
        if (!isValid) return null;

        // مصرف OTP
        await prisma.otpCode.deleteMany({ where: { phone } });

        // ساخت یا دریافت یوزر (بدون assign کردن role)
        const user = await prisma.user.upsert({
          where: { phone },
          update: {},
          create: { phone },
        });

        // فقط roles های واقعی سیستم را برمی‌گردانیم (اگر وجود داشته باشد)
        const roles = await prisma.userRole.findMany({
          where: { userId: user.id },
          select: { role: true },
        });

        return {
          id: user.id,
          phone: user.phone,
          roles: roles.map((r) => r.role),
          name: user.fullName ?? undefined,
        };
      },
    }),

    /* =====================================
       PASSWORD LOGIN (ADMIN / BUSINESS OWNER / STAFF)
    ===================================== */
    CredentialsProvider({
      id: "password",
      name: "PASSWORD",
      credentials: {
        emailOrPhone: { label: "ایمیل یا شماره موبایل", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.emailOrPhone || !credentials.password) return null;

        const identifier = convertToEnglishDigits(credentials.emailOrPhone);

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { phone: identifier },
              { username: identifier },
            ],
          },
          include: {
            roles: true,
            businessMembers: {
              include: {
                business: true,
              },
            },
          },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;

        const roles = user.roles.map((r) => r.role);

        // اگر هیچ نقشی نداشت، اجازه ورود ندارد
        if (!roles.length) return null;

        const business = user.businessMembers?.length
          ? {
              id: user.businessMembers[0].business.id,
              slug: user.businessMembers[0].business.slug,
              businessName: user.businessMembers[0].business.businessName,
              ownerName: user.businessMembers[0].business.ownerName,
              address: user.businessMembers[0].business.address,
              ownerId: user.businessMembers[0].business.ownerId,
              identifier: user.businessMembers[0].business.identifier,
              isActive: user.businessMembers[0].business.isActive,
              businessType: user.businessMembers[0].business.businessType,
              createdAt:
                user.businessMembers[0].business.createdAt.toISOString(),
              updatedAt:
                user.businessMembers[0].business.updatedAt.toISOString(),
              deletedAt: user.businessMembers[0].business.deletedAt,
              businessRole: user.businessMembers[0].role,
            }
          : null;

        return {
          id: user.id,
          phone: user.phone,
          roles,
          name: user.fullName ?? undefined,
          business,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone ?? null;
        token.roles = user.roles;
        token.business = user.business ?? null;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.phone = token.phone;
      session.user.roles = token.roles;
      session.user.business = token.business ?? null;
      session.user.name = token.name;
      return session;
    },
  },
};
