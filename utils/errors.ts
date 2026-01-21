"use server";

import { NextRequest, NextResponse } from "next/server";

export const ServerError = async () => {
  return NextResponse.json(
    { message: "خطایی در سرور رخ داد. لطفا دوباره تلاش کنید." },
    { status: 500 }
  );
};

export const redirectToLogin = (req: NextRequest) =>
  NextResponse.redirect(new URL("/auth", req.url));

export const unauthorized = () =>
  NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

export const forbidden = () =>
  NextResponse.json({ error: "Forbidden" }, { status: 403 });
