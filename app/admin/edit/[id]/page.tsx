import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { AdminEditForm } from "@/components/admin-edit-form";
import { getAdminCookieName, isValidAdminSession } from "@/lib/admin-auth";
import { getFatalityByIdForAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface EditPageProps {
  params: { id: string };
}

export default async function AdminEditPage({ params }: EditPageProps) {
  const token = cookies().get(getAdminCookieName())?.value;
  if (!isValidAdminSession(token)) {
    redirect("/admin/login");
  }

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    notFound();
  }

  const fatality = await getFatalityByIdForAdmin(id);
  if (!fatality) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <div className="neo-card">
        <h1 className="text-3xl font-black uppercase">Edit Submission</h1>
        <p className="mt-2 font-medium">Update content, type, status, and narrative fields.</p>
      </div>
      <AdminEditForm fatality={fatality} />
    </section>
  );
}
