import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceRoleKey) {
      return NextResponse.json(
        { ok: false, message: "Missing Supabase server credentials.", drafts: [] },
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
      .eq("status", "draft")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, message: error.message, drafts: [] }, { status: 500 });
    }

    const drafts = data ?? [];
    return NextResponse.json({ ok: true, drafts });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch draft submissions";
    return NextResponse.json({ ok: false, message, drafts: [] }, { status: 500 });
  }
}
