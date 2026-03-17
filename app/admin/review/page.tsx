import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { AdminReviewTable } from "@/components/admin-review-table";
import { getAdminCookieName, isValidAdminSession } from "@/lib/admin-auth";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminReviewPage() {
  const token = cookies().get(getAdminCookieName())?.value;
  if (!isValidAdminSession(token)) {
    redirect("/admin/login");
  }

  const hasAdmin = isSupabaseAdminConfigured();
  const hasDb = isSupabaseConfigured();

  return (
    <section className="space-y-4">
      <div className="neo-card">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-black uppercase">Admin Review</h1>
          <AdminLogoutButton />
        </div>
        <p className="mt-2 font-medium">
          Publish submitted draft ideas directly from the app.
        </p>
        <p className="mt-2 text-xs font-black uppercase">Auto-refresh: every 4 seconds</p>
        {!hasDb && (
          <p className="mt-2 border-2 border-black bg-accent px-2 py-1 text-xs font-black uppercase">
            Supabase not configured. This page is in demo mode.
          </p>
        )}
        {hasDb && !hasAdmin && (
          <p className="mt-2 border-2 border-black bg-accent px-2 py-1 text-xs font-black uppercase">
            Add a valid SUPABASE_SERVICE_ROLE_KEY in .env.local to review/publish drafts.
          </p>
        )}
      </div>
      <AdminReviewTable />
    </section>
  );
}
