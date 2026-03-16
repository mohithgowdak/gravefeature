import { NextResponse } from "next/server";
import { createFatality } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await createFatality(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create fatality";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
