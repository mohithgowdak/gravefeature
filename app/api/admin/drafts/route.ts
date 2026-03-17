import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminCookieName, isValidAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(getAdminCookieName())?.value;
    if (!isValidAdminSession(token ?? null)) {
      return NextResponse.json({ ok: false, message: "Unauthorized", items: [] }, { status: 401 });
    }

    const requestedStatus = request.nextUrl.searchParams.get("status") ?? "draft";
    const statusFilter =
      requestedStatus === "published" || requestedStatus === "draft" ? requestedStatus : "draft";

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
      return NextResponse.json(
        { ok: false, message: "Missing Supabase server credentials.", items: [] },
        { status: 500 },
      );
    }

    const client = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
      },
    });
    const { data, error } = await client
      .from("fatalities")
      .select("*")
      .eq("status", statusFilter)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, message: error.message, items: [] }, { status: 500 });
    }

    const items = data ?? [];
    return NextResponse.json({ ok: true, items });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch draft submissions";
    return NextResponse.json({ ok: false, message, items: [] }, { status: 500 });
  }
}
