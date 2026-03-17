"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message ?? "Login failed.");
      }
      router.push("/admin/review");
      router.refresh();
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : "Login failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="neo-card max-w-xl space-y-4">
      <h1 className="text-3xl font-black uppercase">Admin Login</h1>
      <p className="text-sm font-semibold">
        Enter admin password to access review and publishing controls.
      </p>
      <input
        className="neo-input"
        type="password"
        placeholder="Admin password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <button className="neo-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
      {error && <p className="text-sm font-black">{error}</p>}
    </form>
  );
}
