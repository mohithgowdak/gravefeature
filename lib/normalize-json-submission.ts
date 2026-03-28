import type { FatalityType, PublishStatus } from "@/lib/types";

export type NormalizeResult =
  | { ok: true; payload: Record<string, unknown> }
  | { ok: false; errors: string[] };

function asString(v: unknown, field: string, errors: string[]): string {
  if (v === null || v === undefined) {
    errors.push(`Missing "${field}"`);
    return "";
  }
  if (typeof v === "string") return v.trim();
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  errors.push(`"${field}" must be a string`);
  return "";
}

function asInt(v: unknown, field: string, errors: string[]): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) {
    return Math.trunc(Number(v));
  }
  errors.push(`"${field}" must be an integer`);
  return NaN;
}

function asBool(v: unknown, defaultValue: boolean): boolean {
  if (typeof v === "boolean") return v;
  return defaultValue;
}

function normalizeExecutionPlan(raw: unknown, errors: string[]): Array<{ step: string; detail: string }> {
  if (raw === null || raw === undefined) {
    errors.push('Missing "execution_plan" (array)');
    return [];
  }
  if (!Array.isArray(raw)) {
    errors.push('"execution_plan" must be an array');
    return [];
  }
  const out: Array<{ step: string; detail: string }> = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const o = item as Record<string, unknown>;
      const step = asString(o.step ?? o.title, `execution_plan[${i}].step`, errors);
      const detail = asString(o.detail ?? o.description ?? step, `execution_plan[${i}].detail`, errors);
      if (step) out.push({ step, detail: detail || step });
    } else if (typeof item === "string" && item.trim()) {
      const s = item.trim();
      out.push({ step: s, detail: s });
    }
  }
  if (out.length === 0) {
    errors.push('"execution_plan" must contain at least one step');
  }
  return out;
}

function normalizeSuggestedTech(raw: unknown, errors: string[]): string[] {
  if (raw === null || raw === undefined) {
    errors.push('Missing "suggested_tech"');
    return [];
  }
  if (Array.isArray(raw)) {
    const arr = raw.map((x) => (typeof x === "string" ? x.trim() : String(x))).filter(Boolean);
    if (arr.length === 0) errors.push('"suggested_tech" array is empty');
    return arr;
  }
  if (typeof raw === "string") {
    const arr = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (arr.length === 0) errors.push('"suggested_tech" has no items');
    return arr;
  }
  errors.push('"suggested_tech" must be a string array or comma-separated string');
  return [];
}

/**
 * Turns uploaded JSON into a payload suitable for POST /api/fatalities.
 * Public submissions are always forced to draft.
 */
export function normalizeJsonSubmission(input: unknown): NormalizeResult {
  const errors: string[] = [];

  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["Root JSON must be an object"] };
  }

  const obj = input as Record<string, unknown>;

  const typeRaw = asString(obj.type, "type", errors);
  let type: FatalityType = "feature";
  if (typeRaw === "project") {
    type = "project";
  } else if (typeRaw === "" || typeRaw === "feature") {
    type = "feature";
  } else {
    errors.push('"type" must be "feature" or "project"');
  }

  const title = asString(obj.title, "title", errors);
  const brand = asString(obj.brand, "brand", errors);
  const sector = asString(obj.sector, "sector", errors);
  const product_type = asString(obj.product_type, "product_type", errors);
  const total_loss = asString(obj.total_loss, "total_loss", errors);
  const start_year = asInt(obj.start_year, "start_year", errors);
  const end_year = asInt(obj.end_year, "end_year", errors);
  const intro_text = asString(obj.intro_text, "intro_text", errors);
  const failure_analysis = asString(obj.failure_analysis, "failure_analysis", errors);
  const market_analysis = asString(obj.market_analysis, "market_analysis", errors);
  const startup_learnings = asString(obj.startup_learnings, "startup_learnings", errors);
  const market_potential = asString(obj.market_potential, "market_potential", errors);
  const difficulty = asString(obj.difficulty, "difficulty", errors);
  const scalability = asString(obj.scalability, "scalability", errors);
  const pivot_concept = asString(obj.pivot_concept, "pivot_concept", errors);
  const monetization_strategy = asString(obj.monetization_strategy, "monetization_strategy", errors);
  const author_name = asString(obj.author_name, "author_name", errors);
  const author_role = asString(obj.author_role, "author_role", errors);

  const execution_plan = normalizeExecutionPlan(obj.execution_plan, errors);
  const suggested_tech = normalizeSuggestedTech(obj.suggested_tech, errors);

  let author_linkedin: string | null = null;
  if (obj.author_linkedin !== null && obj.author_linkedin !== undefined && obj.author_linkedin !== "") {
    const al = typeof obj.author_linkedin === "string" ? obj.author_linkedin.trim() : String(obj.author_linkedin);
    author_linkedin = al || null;
  }

  const is_ai_victim = asBool(obj.is_ai_victim, false);

  const project_vision =
    type === "project"
      ? (obj.project_vision === null || obj.project_vision === undefined
          ? null
          : asString(obj.project_vision, "project_vision", errors) || null)
      : null;
  const resources_burned =
    type === "project"
      ? (obj.resources_burned === null || obj.resources_burned === undefined
          ? null
          : asString(obj.resources_burned, "resources_burned", errors) || null)
      : null;
  const reality_check =
    type === "project"
      ? (obj.reality_check === null || obj.reality_check === undefined
          ? null
          : asString(obj.reality_check, "reality_check", errors) || null)
      : null;
  const missed_pivot =
    type === "project"
      ? (obj.missed_pivot === null || obj.missed_pivot === undefined
          ? null
          : asString(obj.missed_pivot, "missed_pivot", errors) || null)
      : null;

  if (Number.isFinite(start_year) && Number.isFinite(end_year) && end_year < start_year) {
    errors.push('"end_year" must be >= "start_year"');
  }

  const unique = new Set(errors);
  const errList = Array.from(unique);

  if (errList.length > 0) {
    return { ok: false, errors: errList };
  }

  const status: PublishStatus = "draft";

  const payload: Record<string, unknown> = {
    type,
    title,
    brand,
    sector,
    product_type,
    total_loss,
    start_year,
    end_year,
    intro_text,
    failure_analysis,
    market_analysis,
    startup_learnings,
    market_potential,
    difficulty,
    scalability,
    pivot_concept,
    execution_plan,
    monetization_strategy,
    suggested_tech,
    author_name,
    author_role,
    author_linkedin,
    is_ai_victim,
    status,
    project_vision,
    resources_burned,
    reality_check,
    missed_pivot,
  };

  return { ok: true, payload };
}
