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
    business?: IBusiness;
  }

  interface Session {
    user: {
      id: string;
      phone: string | null;
      roles: string[];
      business?: IBusiness;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string | null;
    roles: string[];
    business?: IBusiness;
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
  owner: any;
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

        const otp = await prisma.otpCode.findUnique({
          where: { phone },
        });

        if (!otp || otp.expiresAt < new Date()) return null;

        const isValid = await bcrypt.compare(code, otp.codeHash);
        if (!isValid) return null;

        // مصرف OTP
        await prisma.otpCode.deleteMany({ where: { phone } });

        // ساخت یا دریافت یوزر
        const user = await prisma.user.upsert({
          where: { phone },
          update: {},
          create: { phone },
        });

        // اطمینان از داشتن نقش CUSTOMER
        await prisma.userRole.upsert({
          where: {
            userId_role: {
              userId: user.id,
              role: "CUSTOMER",
            },
          },
          update: {},
          create: {
            userId: user.id,
            role: "CUSTOMER",
          },
        });

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
       BUSINESS OWNER / ADMIN LOGIN
    ===================================== */
    CredentialsProvider({
      id: "password",
      name: "PASSWORD",
      credentials: {
        identifier: { label: "شناسه کسب‌وکار", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },

      async authorize(credentials, req) {
        if (!credentials?.identifier || !credentials.password) return null;

        const business = await prisma.business.findUnique({
          where: { identifier: credentials.identifier },
          include: {
            owner: {
              include: {
                roles: true,
              },
            },
          },
        });

        if (!business || !business.owner) return null;

        const user = business.owner;

        if (!user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) return null;

        const roles = user.roles.map((r) => r.role);

        if (
          !roles.includes("BUSINESS_OWNER") &&
          !roles.includes("SUPER_ADMIN")
        ) {
          return null;
        }

        const businessDTO = {
          id: business.id,
          slug: business.slug,
          businessName: business.businessName,
          ownerName: business.ownerName,
          address: business.address ?? "",
          ownerId: business.ownerId,
          identifier: business.identifier,
          isActive: business.isActive,
          businessType: business.businessType,
          createdAt: business.createdAt.toISOString(),
          updatedAt: business.updatedAt.toISOString(),
          deletedAt: business.deletedAt,
          owner: business.owner,
        };

        return {
          id: user.id,
          phone: user.phone,
          roles,
          name: user.fullName ?? undefined,
          business: businessDTO,
        };
      },
    }),
  ],

  /* ======================
     Session
  ====================== */
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // ۷ روز
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone ?? null;
        token.roles = user.roles;
        token.business = user?.business;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.phone = token.phone;
      session.user.roles = token.roles;
      session.user.business = token?.business;
      return session;
    },
  },
};
