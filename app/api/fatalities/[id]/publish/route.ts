import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { publishFatality } from "@/lib/supabase";

export const runtime = "nodejs";

interface RouteProps {
  params: { id: string };
}

export async function PATCH(_request: Request, { params }: RouteProps) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
    }

    await publishFatality(id);
    revalidatePath("/");
    revalidatePath("/database-view");
    revalidatePath("/admin/review");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to publish fatality";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
