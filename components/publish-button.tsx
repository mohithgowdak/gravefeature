"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PublishButtonProps {
  fatalityId: number;
  onPublished?: () => void;
}

export function PublishButton({ fatalityId, onPublished }: PublishButtonProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onPublish() {
    setIsPublishing(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/fatalities/${fatalityId}/publish`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        throw new Error(payload.message ?? "Failed to publish.");
      }

      setMessage("Published");
      onPublished?.();
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error.";
      setMessage(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button className="neo-button px-3 py-1 text-xs" onClick={onPublish} disabled={isPublishing}>
        {isPublishing ? "Publishing..." : "Publish"}
      </button>
      {message && <span className="text-xs font-bold">{message}</span>}
    </div>
  );
}
