import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminSessionMaxAgeSeconds,
  isAdminAuthConfigured,
  validateAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body?.password?.trim() ?? "";

    if (!isAdminAuthConfigured()) {
      return NextResponse.json(
        { ok: false, message: "Admin auth is not configured on server." },
        { status: 500 },
      );
    }

    if (!validateAdminPassword(password)) {
      return NextResponse.json({ ok: false, message: "Invalid admin password." }, { status: 401 });
    }

    const token = createAdminSessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(getAdminCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: getAdminSessionMaxAgeSeconds(),
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, message: "Failed to authenticate." }, { status: 500 });
  }
}
