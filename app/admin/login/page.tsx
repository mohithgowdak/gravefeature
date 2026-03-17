import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { getAdminCookieName, isValidAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const cookieStore = cookies();
  const token = cookieStore.get(getAdminCookieName())?.value;
  if (isValidAdminSession(token)) {
    redirect("/admin/review");
  }

  return (
    <section className="space-y-4">
      <AdminLoginForm />
    </section>
  );
}
