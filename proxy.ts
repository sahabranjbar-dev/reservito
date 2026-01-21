import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "./types/common";
import { forbidden, redirectToLogin, unauthorized } from "./utils/errors";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (pathname.startsWith("/api")) {
    if (!token) return unauthorized();

    const role = token.role as UserRole;

    if (pathname.startsWith("/api/admin") && role !== "ADMIN") {
      return forbidden();
    }

    if (
      pathname.startsWith("/api/secretary") &&
      !["ADMIN", "SECRETARY"].includes(role)
    ) {
      return forbidden();
    }

    if (
      pathname.startsWith("/api/customer") &&
      !["ADMIN", "CUSTOMER"].includes(role)
    ) {
      return forbidden();
    }

    return NextResponse.next();
  }

  if (!token) return redirectToLogin(req);

  const role = token.role as UserRole;

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return redirectToLogin(req);
  }

  if (
    pathname.startsWith("/secretary") &&
    !["ADMIN", "SECRETARY"].includes(role)
  ) {
    return redirectToLogin(req);
  }

  if (
    pathname.startsWith("/customer") &&
    !["ADMIN", "CUSTOMER"].includes(role)
  ) {
    return redirectToLogin(req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/secretary/:path*",
    "/customer/:path*",
    "/api/:path*",
  ],
};
