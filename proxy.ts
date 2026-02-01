import { getServerSession, Session } from "next-auth";
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "./utils/authOptions";
import prisma from "./utils/prisma";

type Rule = (
  req: NextRequest,
  session: Session | null,
) => NextResponse | void | Promise<any>;

const redirectToLogin = (req: NextRequest, url?: string) =>
  NextResponse.redirect(new URL(url ? url : "/auth", req.url));

// ================================
// 1) قواعد مخصوص مسیرهای Admin
// ================================
const adminRules: Rule[] = [
  (req, session) => {
    if (!session) return redirectToLogin(req);
  },
  (req, session) => {
    const roles = session?.user?.roles || [];
    if (!roles.includes("SUPER_ADMIN")) return redirectToLogin(req);
  },
];

// =================================
// 2) قواعد مخصوص مسیرهای Customer
// =================================
const customerRules: Rule[] = [
  (req, session) => {
    if (!session) return redirectToLogin(req);
    const roles = session?.user?.roles || [];
    if (!roles.length) return;
    if (!roles.includes("CUSTOMER")) return redirectToLogin(req);
  },
];

// =================================
// 3) قواعد مخصوص مسیرهای Business
// =================================
const businessRules: Rule[] = [
  async (req, session) => {
    const userId = session?.user.id;
    const businessId = session?.user.business?.id;
    if (!businessId || !userId) {
      return redirectToLogin(req, "/business/login");
    }
    const businessMember = await prisma.businessMember.findUnique({
      where: {
        userId_businessId: {
          businessId,
          userId,
        },
      },
      select: {
        business: {
          select: {
            isActive: true,
            registrationStatus: true,
          },
        },
        role: true,
      },
    });

    if (
      businessMember?.role !== "OWNER" ||
      businessMember.business.registrationStatus !== "APPROVED" ||
      !businessMember.business.isActive
    )
      return redirectToLogin(req, "/business/login");
  },
];

const staffRules: Rule[] = [
  async (req, session) => {
    const userId = session?.user.id;
    const businessId = session?.user.business?.id;
    if (!businessId || !userId) {
      return redirectToLogin(req);
    }
    const businessMember = await prisma.businessMember.findUnique({
      where: {
        userId_businessId: {
          businessId,
          userId,
        },
      },
    });
    if (businessMember?.role !== "STAFF") return redirectToLogin(req);
  },
];

// =================================
// 4) قوانین امنیتی API ها
// =================================
const apiRules: Rule[] = [
  (req, session) => {
    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }
  },

  async (req, session) => {
    const roles = session?.user?.roles || [];

    if (req.nextUrl.pathname.startsWith("/api/dashboard/admin")) {
      if (!roles.includes("SUPER_ADMIN")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    if (req.nextUrl.pathname.startsWith("/api/dashboard/business")) {
      const userId = session?.user.id;
      const businessId = session?.user.business?.id;
      if (!businessId || !userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const businessMember = await prisma.businessMember.findUnique({
        where: {
          userId_businessId: {
            businessId,
            userId,
          },
        },
      });
      if (businessMember?.role !== "OWNER") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    if (req.nextUrl.pathname.startsWith("/api/dashboard/staff")) {
      const userId = session?.user.id;
      const businessId = session?.user.business?.id;
      if (!businessId || !userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const businessMember = await prisma.businessMember.findUnique({
        where: {
          userId_businessId: {
            businessId,
            userId,
          },
        },
      });
      if (businessMember?.role !== "STAFF") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    if (req.nextUrl.pathname.startsWith("/api/dashboard/customer")) {
      if (!roles.includes("CUSTOMER")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
  },
];

// ================================
// 5) انتخاب rule بر اساس مسیر
// ================================
function getRulesForPath(pathname: string): Rule[] {
  if (pathname === "/dashboard") {
    return [
      (req, session) => {
        if (!session) return redirectToLogin(req, "/auth");
      },
    ];
  }
  if (pathname.startsWith("/dashboard/admin")) return adminRules;
  if (pathname.startsWith("/dashboard/business")) return businessRules;
  if (pathname.startsWith("/dashboard/customer")) return customerRules;
  if (pathname.startsWith("/dashboard/staff")) return staffRules;

  if (
    pathname.startsWith("/api/dashboard/admin") ||
    pathname.startsWith("/api/dashboard/customer") ||
    pathname.startsWith("/api/dashboard/business") ||
    pathname.startsWith("/api/dashboard/staff")
  ) {
    return apiRules;
  }

  return [];
}

// ================================
// 6) تابع اصلی middleware
// ================================
export async function proxy(req: NextRequest) {
  const session = await getServerSession(authOptions);

  const pathname = req.nextUrl.pathname;

  const rules = getRulesForPath(pathname);

  for (const rule of rules) {
    const result = await rule(req, session);
    if (result instanceof NextResponse) return result;
  }

  return NextResponse.next();
}

// ================================
// 7) مجوز مسیرها
// ================================
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
