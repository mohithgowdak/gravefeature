"use client";

import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { FileJson } from "lucide-react";
import { normalizeJsonSubmission } from "@/lib/normalize-json-submission";

export function JsonSubmitUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File) {
    setMessage(null);
    setErrors([]);
    setFileName(file.name);

    const text = await file.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text) as unknown;
    } catch {
      setErrors(["Invalid JSON: could not parse file"]);
      return;
    }

    const normalized = normalizeJsonSubmission(parsed);
    if (!normalized.ok) {
      setErrors(normalized.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/fatalities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized.payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? "Submission failed");
      }

      setMessage("JSON case uploaded successfully. It is saved as a draft for admin review.");
      if (inputRef.current) inputRef.current.value = "";
      setFileName(null);
    } catch (e) {
      setErrors([e instanceof Error ? e.message : "Upload failed"]);
    } finally {
      setIsSubmitting(false);
    }
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    inputRef.current?.click();
  }

  return (
    <div className="neo-card space-y-4">
      <div className="flex items-center gap-2 border-b-2 border-black pb-3">
        <FileJson className="h-6 w-6" />
        <div>
          <h2 className="text-xl font-black uppercase">Upload JSON</h2>
          <p className="text-sm font-medium">
            Paste a Gemini (or hand-written) case as a single <code className="font-bold">.json</code> file.
            Same schema as the API — saved as <strong>draft</strong>.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          ref={inputRef}
          accept="application/json,.json"
          className="hidden"
          onChange={onChange}
          type="file"
        />
        <button
          className="neo-button"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Uploading..." : "Choose JSON file"}
        </button>
        {fileName && <p className="text-xs font-semibold">Last file: {fileName}</p>}
      </form>

      {message && <p className="text-sm font-black text-green-800">{message}</p>}

      {errors.length > 0 && (
        <div className="border-2 border-black bg-red-50 p-3">
          <p className="text-xs font-black uppercase">Fix these issues</p>
          <ul className="mt-2 list-inside list-disc text-sm font-medium">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <details className="text-sm font-medium">
        <summary className="cursor-pointer font-black uppercase">Required JSON shape</summary>
        <pre className="mt-2 overflow-x-auto border-2 border-black bg-white p-3 text-xs">
{`{
  "type": "feature" | "project",
  "title": "...",
  "brand": "...",
  "sector": "...",
  "product_type": "...",
  "total_loss": "...",
  "start_year": 2022,
  "end_year": 2023,
  "intro_text": "...",
  "failure_analysis": "...",
  "market_analysis": "...",
  "startup_learnings": "...",
  "market_potential": "...",
  "difficulty": "...",
  "scalability": "...",
  "pivot_concept": "...",
  "execution_plan": [
    { "step": "...", "detail": "..." }
  ],
  "monetization_strategy": "...",
  "suggested_tech": ["a", "b"] or "a, b",
  "author_name": "...",
  "author_role": "...",
  "author_linkedin": null or "https://...",
  "is_ai_victim": false,
  "project_vision": null,
  "resources_burned": null,
  "reality_check": null,
  "missed_pivot": null
}`}
        </pre>
      </details>
    </div>
  );
}
