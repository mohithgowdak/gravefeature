export const SAVED_CASES_STORAGE_KEY = "featuregrave:saved-cases";

export function readSavedCaseIds(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(SAVED_CASES_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is number => typeof item === "number");
  } catch {
    return [];
  }
}

export function writeSavedCaseIds(ids: number[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(SAVED_CASES_STORAGE_KEY, JSON.stringify(ids));
}
