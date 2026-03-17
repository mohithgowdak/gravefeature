import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminCookieName, isValidAdminSession } from "@/lib/admin-auth";
import { updateFatalityById } from "@/lib/supabase";

export const runtime = "nodejs";

interface RouteProps {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  try {
    const token = request.cookies.get(getAdminCookieName())?.value;
    if (!isValidAdminSession(token ?? null)) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return NextResponse.json({ ok: false, message: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    await updateFatalityById(id, body);

    revalidatePath("/");
    revalidatePath("/database-view");
    revalidatePath("/admin/review");
    revalidatePath(`/fatalities/${id}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update submission";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
