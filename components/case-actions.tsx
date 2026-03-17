"use client";

import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkCheck, Linkedin, Twitter } from "lucide-react";
import { readSavedCaseIds, writeSavedCaseIds } from "@/lib/saved-cases";

interface CaseActionsProps {
  caseId: number;
  title: string;
  variant?: "light" | "dark";
  className?: string;
}

export function CaseActions({ caseId, title, variant = "light", className }: CaseActionsProps) {
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    setSavedIds(readSavedCaseIds());
  }, []);

  const isSaved = useMemo(() => savedIds.includes(caseId), [caseId, savedIds]);
  const buttonClass =
    variant === "dark"
      ? "border-2 border-accent bg-[#1A1A1A] text-accent"
      : "border-2 border-black bg-white text-black";

  function toggleSaved() {
    const nextIds = isSaved ? savedIds.filter((id) => id !== caseId) : [...savedIds, caseId];
    setSavedIds(nextIds);
    writeSavedCaseIds(nextIds);
    window.dispatchEvent(new Event("featuregrave:saved-cases-updated"));
  }

  function shareTo(platform: "linkedin" | "x") {
    const url = `${window.location.origin}/fatalities/${caseId}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(`${title} | FeatureGrave`);
    const shareUrl =
      platform === "linkedin"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        : `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
      <button
        className={`${buttonClass} inline-flex items-center gap-1 px-2 py-1 text-xs font-black uppercase`}
        onClick={toggleSaved}
        type="button"
      >
        {isSaved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
        {isSaved ? "Saved" : "Save"}
      </button>
      <button
        className={`${buttonClass} inline-flex items-center gap-1 px-2 py-1 text-xs font-black uppercase`}
        onClick={() => shareTo("linkedin")}
        type="button"
      >
        <Linkedin className="h-3.5 w-3.5" />
        LinkedIn
      </button>
      <button
        className={`${buttonClass} inline-flex items-center gap-1 px-2 py-1 text-xs font-black uppercase`}
        onClick={() => shareTo("x")}
        type="button"
      >
        <Twitter className="h-3.5 w-3.5" />X
      </button>
    </div>
  );
}
