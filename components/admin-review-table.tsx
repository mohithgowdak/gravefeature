"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PublishButton } from "@/components/publish-button";

interface DraftRow {
  id: number;
  title: string;
  brand: string;
  author_name: string;
  author_role: string;
  status: "draft" | "published";
}

interface DraftResponse {
  ok: boolean;
  items: DraftRow[];
  message?: string;
}

export function AdminReviewTable() {
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [statusView, setStatusView] = useState<"draft" | "published">("draft");

  const loadDrafts = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/drafts?status=${statusView}`, { cache: "no-store" });
      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const payload = (await response.json()) as DraftResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message ?? "Failed to load draft submissions.");
      }

      setDrafts(payload.items ?? []);
      setErrorMessage(null);
      setIsLoaded(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load draft submissions.";
      setErrorMessage(message);
      setIsLoaded(true);
    }
  }, [statusView]);

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

      <div className="neo-card">
        <div className="flex items-center gap-2">
          <button
            className={`border-[3px] border-black px-3 py-1 text-xs font-black uppercase ${
              statusView === "draft" ? "bg-accent shadow-brutal" : "bg-white"
            }`}
            onClick={() => {
              setIsLoaded(false);
              setStatusView("draft");
            }}
            type="button"
          >
            Drafts
          </button>
          <button
            className={`border-[3px] border-black px-3 py-1 text-xs font-black uppercase ${
              statusView === "published" ? "bg-accent shadow-brutal" : "bg-white"
            }`}
            onClick={() => {
              setIsLoaded(false);
              setStatusView("published");
            }}
            type="button"
          >
            Published
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border-[3px] border-black bg-white shadow-brutal">
        <table className="min-w-full">
          <thead className="bg-accent">
            <tr className="text-left text-xs font-black uppercase">
              <th className="border-r-2 border-black px-3 py-2">Title</th>
              <th className="border-r-2 border-black px-3 py-2">Brand</th>
              <th className="border-r-2 border-black px-3 py-2">Author</th>
              <th className="border-r-2 border-black px-3 py-2">Status</th>
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
                <td className="border-r-2 border-black px-3 py-2 uppercase">{item.status}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Link
                      className="border-2 border-black bg-white px-2 py-1 text-xs font-black uppercase"
                      href={`/admin/edit/${item.id}`}
                    >
                      Edit
                    </Link>
                    {item.status === "draft" && (
                      <PublishButton
                        fatalityId={item.id}
                        onPublished={() => removeDraftRow(item.id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {isLoaded && drafts.length === 0 && (
              <tr className="border-t-2 border-black">
                <td className="px-3 py-3 text-sm font-semibold" colSpan={5}>
                  {statusView === "draft"
                    ? "No draft submissions waiting for review."
                    : "No published submissions found."}
                </td>
              </tr>
            )}
            {!isLoaded && (
              <tr className="border-t-2 border-black">
                <td className="px-3 py-3 text-sm font-semibold" colSpan={5}>
                  Loading submissions...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
