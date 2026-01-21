import { convertToEnglishDigits } from "@/utils/common";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";
import { AuthOptions, DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    phone: string;
    userId: string;
  }
  interface Session {
    user:
      | ({
          id: string;
          role: string;
          phone: string;
          userId: string;
        } & DefaultSession["user"])
      | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    phone: string;
    userId: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "OTP",
      credentials: {
        phone: { label: "شماره موبایل", type: "text" },
        code: { label: "کد یکبار مصرف", type: "text" },
      },

      async authorize(credentials) {
        if (!credentials?.phone || !credentials.code) {
          throw new Error("شماره موبایل یا کد وارد نشده است.");
        }

        const phone = convertToEnglishDigits(credentials.phone);
        const code = convertToEnglishDigits(credentials.code);

        const otpEntry = await prisma.otpCode.findUnique({ where: { phone } });
        if (!otpEntry) throw new Error("کد یافت نشد.");

        // بررسی انقضا با expiresAt
        const now = new Date();
        if (now > otpEntry.expiresAt) {
          await prisma.otpCode.delete({ where: { phone } });
          throw new Error("کد منقضی شده است.");
        }

        const isValid = await bcrypt.compare(code, otpEntry.codeHash);
        if (!isValid) throw new Error("کد وارد شده صحیح نیست.");

        await prisma.otpCode.delete({ where: { phone } });

        const user = await prisma.user.upsert({
          where: { phone },
          update: {},
          create: { phone },
        });

        return {
          id: user.id,
          userId: user.id,
          phone: user.phone ?? "",
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userId = user.userId;
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.userId = token.userId;
        session.user.phone = token.phone;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
