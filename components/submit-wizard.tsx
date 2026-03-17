"use client";

import { FormEvent, useMemo, useState } from "react";
import { FatalityType } from "@/lib/types";

type FormState = {
  type: FatalityType;
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
  monetization_strategy: string;
  execution_plan: string;
  suggested_tech: string;
  author_name: string;
  author_role: string;
  is_ai_victim: boolean;
  project_vision: string;
  resources_burned: string;
  reality_check: string;
  missed_pivot: string;
};

const initialState: FormState = {
  type: "feature",
  title: "",
  brand: "",
  sector: "",
  product_type: "",
  total_loss: "",
  start_year: 2020,
  end_year: new Date().getFullYear(),
  intro_text: "",
  failure_analysis: "",
  market_analysis: "",
  startup_learnings: "",
  market_potential: "",
  difficulty: "",
  scalability: "",
  pivot_concept: "",
  monetization_strategy: "",
  execution_plan: "",
  suggested_tech: "",
  author_name: "",
  author_role: "",
  is_ai_victim: false,
  project_vision: "",
  resources_burned: "",
  reality_check: "",
  missed_pivot: "",
};

export function SubmitWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialState);

  const progress = useMemo(() => `${step}/3`, [step]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const execution_plan = form.execution_plan
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((stepLine) => ({ step: stepLine, detail: stepLine }));

    const suggested_tech = form.suggested_tech
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    try {
      const normalizedPayload = {
        ...form,
        type: form.type,
        failure_analysis:
          form.type === "feature" ? form.failure_analysis : form.reality_check || form.failure_analysis,
        market_analysis:
          form.type === "feature" ? form.market_analysis : form.market_analysis || form.resources_burned,
        startup_learnings:
          form.type === "feature" ? form.startup_learnings : form.startup_learnings || form.missed_pivot,
        market_potential:
          form.type === "feature" ? form.market_potential : form.market_potential || form.project_vision,
        project_vision: form.type === "project" ? form.project_vision : null,
        resources_burned: form.type === "project" ? form.resources_burned : null,
        reality_check: form.type === "project" ? form.reality_check : null,
        missed_pivot: form.type === "project" ? form.missed_pivot : null,
      };

      const response = await fetch("/api/fatalities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...normalizedPayload,
          execution_plan,
          suggested_tech,
          status: "draft",
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed. Try again.");
      }

      setForm(initialState);
      setStep(1);
      setMessage("Submission received. Thanks for your forensic contribution.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error.";
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="neo-card space-y-6">
      <div className="flex items-center justify-between border-2 border-black bg-accent p-3">
        <h2 className="text-xl font-black uppercase">
          Submit a {form.type === "feature" ? "Fatal Feature" : "Founder Confessional"}
        </h2>
        <span className="text-sm font-black">{progress}</span>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-black uppercase">
          Are you reporting a Feature or a Project?
        </p>
        <div className="flex gap-2">
          <button
            className={`border-[3px] border-black px-3 py-2 text-xs font-black uppercase ${
              form.type === "feature" ? "bg-accent shadow-brutal" : "bg-white"
            }`}
            onClick={() => update("type", "feature")}
            type="button"
          >
            FeatureGrave
          </button>
          <button
            className={`border-[3px] border-black px-3 py-2 text-xs font-black uppercase ${
              form.type === "project" ? "bg-accent shadow-brutal" : "bg-white"
            }`}
            onClick={() => update("type", "project")}
            type="button"
          >
            Founder&apos;s Confessional
          </button>
        </div>
      </div>

      {step === 1 && (
        <div className="grid gap-3 md:grid-cols-2">
          <input
            className="neo-input md:col-span-2"
            placeholder="Case Title"
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            required
          />
          <input
            className="neo-input"
            placeholder="Brand"
            value={form.brand}
            onChange={(event) => update("brand", event.target.value)}
            required
          />
          <input
            className="neo-input"
            placeholder="Sector"
            value={form.sector}
            onChange={(event) => update("sector", event.target.value)}
            required
          />
          <input
            className="neo-input"
            placeholder="Product Type"
            value={form.product_type}
            onChange={(event) => update("product_type", event.target.value)}
            required
          />
          <input
            className="neo-input"
            placeholder="Total Loss"
            value={form.total_loss}
            onChange={(event) => update("total_loss", event.target.value)}
            required
          />
          <input
            className="neo-input"
            type="number"
            placeholder="Start Year"
            value={form.start_year}
            onChange={(event) => update("start_year", Number(event.target.value))}
            required
          />
          <input
            className="neo-input"
            type="number"
            placeholder="End Year"
            value={form.end_year}
            onChange={(event) => update("end_year", Number(event.target.value))}
            required
          />
          <textarea
            className="neo-input md:col-span-2"
            placeholder="Intro summary"
            value={form.intro_text}
            onChange={(event) => update("intro_text", event.target.value)}
            required
          />
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-3">
          <textarea
            className="neo-input"
            placeholder={form.type === "feature" ? "Failure Analysis" : "The Project Vision"}
            value={form.type === "feature" ? form.failure_analysis : form.project_vision}
            onChange={(event) =>
              update(
                form.type === "feature" ? "failure_analysis" : "project_vision",
                event.target.value,
              )
            }
            required
          />
          <textarea
            className="neo-input"
            placeholder={form.type === "feature" ? "Market Analysis" : "Resources Burned"}
            value={form.type === "feature" ? form.market_analysis : form.resources_burned}
            onChange={(event) =>
              update(
                form.type === "feature" ? "market_analysis" : "resources_burned",
                event.target.value,
              )
            }
            required
          />
          <textarea
            className="neo-input"
            placeholder={form.type === "feature" ? "Startup Learnings" : "Reality Check"}
            value={form.type === "feature" ? form.startup_learnings : form.reality_check}
            onChange={(event) =>
              update(
                form.type === "feature" ? "startup_learnings" : "reality_check",
                event.target.value,
              )
            }
            required
          />
          <textarea
            className="neo-input"
            placeholder={form.type === "feature" ? "Market Potential" : "The Pivot I Missed"}
            value={form.type === "feature" ? form.market_potential : form.missed_pivot}
            onChange={(event) =>
              update(
                form.type === "feature" ? "market_potential" : "missed_pivot",
                event.target.value,
              )
            }
            required
          />
          <input
            className="neo-input"
            placeholder="Difficulty"
            value={form.difficulty}
            onChange={(event) => update("difficulty", event.target.value)}
            required
          />
          <input
            className="neo-input"
            placeholder="Scalability"
            value={form.scalability}
            onChange={(event) => update("scalability", event.target.value)}
            required
          />
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-3">
          <textarea
            className="neo-input"
            placeholder={form.type === "feature" ? "Pivot Concept" : "The Pivot I Missed (summary)"}
            value={form.pivot_concept}
            onChange={(event) => update("pivot_concept", event.target.value)}
            required
          />
          <textarea
            className="neo-input"
            placeholder="Execution Plan (one line per step)"
            value={form.execution_plan}
            onChange={(event) => update("execution_plan", event.target.value)}
            required
          />
          <textarea
            className="neo-input"
            placeholder="Monetization Strategy"
            value={form.monetization_strategy}
            onChange={(event) => update("monetization_strategy", event.target.value)}
            required
          />
          <input
            className="neo-input"
            placeholder="Suggested Tech (comma separated)"
            value={form.suggested_tech}
            onChange={(event) => update("suggested_tech", event.target.value)}
            required
          />
          <input
            className="neo-input"
            placeholder="Your Name"
            value={form.author_name}
            onChange={(event) => update("author_name", event.target.value)}
            required
          />
          <input
            className="neo-input"
            placeholder="Your Role"
            value={form.author_role}
            onChange={(event) => update("author_role", event.target.value)}
            required
          />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              checked={form.is_ai_victim}
              onChange={(event) => update("is_ai_victim", event.target.checked)}
              type="checkbox"
            />
            Mark as AI victim
          </label>
        </div>
      )}

      <div className="flex gap-3">
        {step > 1 && (
          <button
            className="neo-button bg-white"
            onClick={() => setStep((prev) => prev - 1)}
            type="button"
          >
            Back
          </button>
        )}
        <button className="neo-button" disabled={isSubmitting} type="submit">
          {step < 3 ? "Next Step" : isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
      {message && <p className="text-sm font-semibold">{message}</p>}
    </form>
  );
}
