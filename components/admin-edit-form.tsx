"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Fatality, FatalityType, PublishStatus } from "@/lib/types";

interface AdminEditFormProps {
  fatality: Fatality;
}

type FormState = {
  type: FatalityType;
  status: PublishStatus;
  title: string;
  brand: string;
  sector: string;
  product_type: string;
  total_loss: string;
  start_year: number;
  end_year: number;
  intro_text: string;
  failure_analysis: string;
  market_analysis: string;
  startup_learnings: string;
  market_potential: string;
  difficulty: string;
  scalability: string;
  pivot_concept: string;
  execution_plan: string;
  monetization_strategy: string;
  suggested_tech: string;
  author_name: string;
  author_role: string;
  is_ai_victim: boolean;
  project_vision: string;
  resources_burned: string;
  reality_check: string;
  missed_pivot: string;
};

function toExecutionPlanText(fatality: Fatality) {
  return (fatality.execution_plan ?? [])
    .map((step) => `${step.step}: ${step.detail}`)
    .join("\n");
}

function toTechText(fatality: Fatality) {
  return (fatality.suggested_tech ?? []).join(", ");
}

export function AdminEditForm({ fatality }: AdminEditFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saveAndBack, setSaveAndBack] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const initialFormState = useMemo<FormState>(
    () => ({
      type: fatality.type,
      status: fatality.status,
      title: fatality.title,
      brand: fatality.brand,
      sector: fatality.sector,
      product_type: fatality.product_type,
      total_loss: fatality.total_loss,
      start_year: fatality.start_year,
      end_year: fatality.end_year,
      intro_text: fatality.intro_text,
      failure_analysis: fatality.failure_analysis,
      market_analysis: fatality.market_analysis,
      startup_learnings: fatality.startup_learnings,
      market_potential: fatality.market_potential,
      difficulty: fatality.difficulty,
      scalability: fatality.scalability,
      pivot_concept: fatality.pivot_concept,
      execution_plan: toExecutionPlanText(fatality),
      monetization_strategy: fatality.monetization_strategy,
      suggested_tech: toTechText(fatality),
      author_name: fatality.author_name,
      author_role: fatality.author_role,
      is_ai_victim: fatality.is_ai_victim,
      project_vision: fatality.project_vision ?? "",
      resources_burned: fatality.resources_burned ?? "",
      reality_check: fatality.reality_check ?? "",
      missed_pivot: fatality.missed_pivot ?? "",
    }),
    [fatality],
  );
  const [form, setForm] = useState<FormState>(initialFormState);
  const [baseline, setBaseline] = useState<FormState>(initialFormState);

  const isDirty = JSON.stringify(form) !== JSON.stringify(baseline);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsSaving(true);

    const execution_plan = form.execution_plan
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [step, ...rest] = line.split(":");
        return { step: step.trim(), detail: (rest.join(":").trim() || step.trim()) };
      });

    const suggested_tech = form.suggested_tech
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const response = await fetch(`/api/admin/fatalities/${fatality.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          execution_plan,
          suggested_tech,
          project_vision: form.project_vision || null,
          resources_burned: form.resources_burned || null,
          reality_check: form.reality_check || null,
          missed_pivot: form.missed_pivot || null,
        }),
      });

      const payload = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message ?? "Failed to update.");
      }

      setMessage("Saved.");
      setBaseline(form);
      if (saveAndBack) {
        router.push("/admin/review");
        return;
      }
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Update failed.";
      setMessage(errorMessage);
    } finally {
      setIsSaving(false);
      setSaveAndBack(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="neo-card space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <select
          className="neo-input"
          value={form.type}
          onChange={(e) => update("type", e.target.value as FatalityType)}
        >
          <option value="feature">Feature</option>
          <option value="project">Project</option>
        </select>
        <select
          className="neo-input"
          value={form.status}
          onChange={(e) => update("status", e.target.value as PublishStatus)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <input className="neo-input md:col-span-2" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Title" />
        <input className="neo-input" value={form.brand} onChange={(e) => update("brand", e.target.value)} placeholder="Brand" />
        <input className="neo-input" value={form.sector} onChange={(e) => update("sector", e.target.value)} placeholder="Sector" />
        <input className="neo-input" value={form.product_type} onChange={(e) => update("product_type", e.target.value)} placeholder="Product type" />
        <input className="neo-input" value={form.total_loss} onChange={(e) => update("total_loss", e.target.value)} placeholder="Total loss" />
        <input className="neo-input" type="number" value={form.start_year} onChange={(e) => update("start_year", Number(e.target.value))} placeholder="Start year" />
        <input className="neo-input" type="number" value={form.end_year} onChange={(e) => update("end_year", Number(e.target.value))} placeholder="End year" />
        <textarea className="neo-input md:col-span-2" value={form.intro_text} onChange={(e) => update("intro_text", e.target.value)} placeholder="Intro" />
        <textarea className="neo-input" value={form.failure_analysis} onChange={(e) => update("failure_analysis", e.target.value)} placeholder="Failure analysis" />
        <textarea className="neo-input" value={form.market_analysis} onChange={(e) => update("market_analysis", e.target.value)} placeholder="Market analysis" />
        <textarea className="neo-input" value={form.startup_learnings} onChange={(e) => update("startup_learnings", e.target.value)} placeholder="Startup learnings" />
        <textarea className="neo-input" value={form.market_potential} onChange={(e) => update("market_potential", e.target.value)} placeholder="Market potential" />
        <input className="neo-input" value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)} placeholder="Difficulty" />
        <input className="neo-input" value={form.scalability} onChange={(e) => update("scalability", e.target.value)} placeholder="Scalability" />
        <textarea className="neo-input md:col-span-2" value={form.pivot_concept} onChange={(e) => update("pivot_concept", e.target.value)} placeholder="Pivot concept" />
        <textarea className="neo-input md:col-span-2" value={form.execution_plan} onChange={(e) => update("execution_plan", e.target.value)} placeholder="Execution plan (one step per line, optionally Step: Detail)" />
        <textarea className="neo-input md:col-span-2" value={form.monetization_strategy} onChange={(e) => update("monetization_strategy", e.target.value)} placeholder="Monetization strategy" />
        <input className="neo-input md:col-span-2" value={form.suggested_tech} onChange={(e) => update("suggested_tech", e.target.value)} placeholder="Suggested tech comma-separated" />
        <input className="neo-input" value={form.author_name} onChange={(e) => update("author_name", e.target.value)} placeholder="Author name" />
        <input className="neo-input" value={form.author_role} onChange={(e) => update("author_role", e.target.value)} placeholder="Author role" />
        <textarea className="neo-input md:col-span-2" value={form.project_vision} onChange={(e) => update("project_vision", e.target.value)} placeholder="Project vision (project type)" />
        <textarea className="neo-input md:col-span-2" value={form.resources_burned} onChange={(e) => update("resources_burned", e.target.value)} placeholder="Resources burned (project type)" />
        <textarea className="neo-input md:col-span-2" value={form.reality_check} onChange={(e) => update("reality_check", e.target.value)} placeholder="Reality check (project type)" />
        <textarea className="neo-input md:col-span-2" value={form.missed_pivot} onChange={(e) => update("missed_pivot", e.target.value)} placeholder="Missed pivot (project type)" />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          checked={form.is_ai_victim}
          onChange={(event) => update("is_ai_victim", event.target.checked)}
          type="checkbox"
        />
        Mark as AI victim
      </label>

      <div className="flex flex-wrap gap-3">
        <button className="neo-button" type="submit" disabled={isSaving} onClick={() => setSaveAndBack(false)}>
          {isSaving && !saveAndBack ? "Saving..." : "Save Changes"}
        </button>
        <button
          className="neo-button bg-white"
          type="submit"
          disabled={isSaving}
          onClick={() => setSaveAndBack(true)}
        >
          {isSaving && saveAndBack ? "Saving..." : "Save + Back to Review"}
        </button>
        <button
          className="neo-button bg-white"
          type="button"
          onClick={() => {
            if (isDirty && !window.confirm("You have unsaved changes. Leave anyway?")) {
              return;
            }
            router.push("/admin/review");
          }}
        >
          Back to Review
        </button>
      </div>
      {message && <p className="text-sm font-black">{message}</p>}
      {isDirty && <p className="text-xs font-black uppercase">Unsaved changes</p>}
    </form>
  );
}
