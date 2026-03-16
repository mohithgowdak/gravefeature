import { NextResponse } from "next/server";
import { createComment } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await createComment(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create comment";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
