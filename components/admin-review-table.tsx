"use client";

import { useCallback, useEffect, useState } from "react";
import { PublishButton } from "@/components/publish-button";

interface DraftRow {
  id: number;
  title: string;
  brand: string;
  author_name: string;
  author_role: string;
}

interface DraftResponse {
  ok: boolean;
  drafts: DraftRow[];
  message?: string;
}

export function AdminReviewTable() {
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadDrafts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/drafts", { cache: "no-store" });
      const payload = (await response.json()) as DraftResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message ?? "Failed to load draft submissions.");
      }

      setDrafts(payload.drafts ?? []);
      setErrorMessage(null);
      setIsLoaded(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load draft submissions.";
      setErrorMessage(message);
      setIsLoaded(true);
    }
  }, []);

  function removeDraftRow(id: number) {
    setDrafts((prev) => prev.filter((item) => item.id !== id));
  }

  useEffect(() => {
    loadDrafts();
    const timer = window.setInterval(loadDrafts, 4000);
    return () => window.clearInterval(timer);
  }, [loadDrafts]);

  return (
    <>
      {errorMessage && (
        <p className="mt-2 border-2 border-black bg-accent px-2 py-1 text-xs font-black uppercase">
          {errorMessage}
        </p>
      )}

      <div className="overflow-x-auto border-[3px] border-black bg-white shadow-brutal">
        <table className="min-w-full">
          <thead className="bg-accent">
            <tr className="text-left text-xs font-black uppercase">
              <th className="border-r-2 border-black px-3 py-2">Title</th>
              <th className="border-r-2 border-black px-3 py-2">Brand</th>
              <th className="border-r-2 border-black px-3 py-2">Author</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {drafts.map((item) => (
              <tr key={item.id} className="border-t-2 border-black text-sm font-semibold">
                <td className="border-r-2 border-black px-3 py-2">{item.title}</td>
                <td className="border-r-2 border-black px-3 py-2">{item.brand}</td>
                <td className="border-r-2 border-black px-3 py-2">
                  {item.author_name} ({item.author_role})
                </td>
                <td className="px-3 py-2">
                  <PublishButton
                    fatalityId={item.id}
                    onPublished={() => removeDraftRow(item.id)}
                  />
                </td>
              </tr>
            ))}
            {isLoaded && drafts.length === 0 && (
              <tr className="border-t-2 border-black">
                <td className="px-3 py-3 text-sm font-semibold" colSpan={4}>
                  No draft submissions waiting for review.
                </td>
              </tr>
            )}
            {!isLoaded && (
              <tr className="border-t-2 border-black">
                <td className="px-3 py-3 text-sm font-semibold" colSpan={4}>
                  Loading draft submissions...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
