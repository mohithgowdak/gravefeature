"use client";

import { FormEvent, useState } from "react";
import { CommunityComment } from "@/lib/types";

interface CommentFormProps {
  fatalityId: number;
  initialComments: CommunityComment[];
}

function formatUtcTimestamp(value?: string) {
  if (!value) {
    return "Just now";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
}

export function CommentForm({ fatalityId, initialComments }: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommunityComment[]>(initialComments);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fatality_id: fatalityId,
          name,
          email,
          comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to submit your comment.");
      }

      const payload = await response.json();
      if (payload?.comment) {
        setComments((prev) => [payload.comment as CommunityComment, ...prev]);
      }

      setName("");
      setEmail("");
      setComment("");
      setMessage("Analysis posted. Thanks for contributing.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong.";
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="neo-card space-y-4 text-black">
      <h3 className="text-xl font-black uppercase">Community POV</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          className="neo-input"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          className="neo-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>
      <textarea
        className="neo-input min-h-36"
        placeholder="What's your diagnosis on this failure?"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        required
      />
      <button className="neo-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Posting..." : "Post Analysis"}
      </button>
      {message && <p className="text-sm font-semibold text-black">{message}</p>}

      <div className="space-y-3 border-t-[3px] border-black pt-4">
        <h4 className="text-sm font-black uppercase">
          Community Notes ({comments.length})
        </h4>
        {comments.length === 0 ? (
          <p className="text-sm font-medium text-black">No comments yet. Be the first to share a diagnosis.</p>
        ) : (
          comments.map((item) => (
            <article key={item.id} className="border-2 border-black bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-black text-black">{item.name}</p>
                <p className="text-xs font-semibold text-black">
                  {formatUtcTimestamp(item.created_at)}
                </p>
              </div>
              <p className="mt-2 text-sm font-medium text-black">{item.comment}</p>
            </article>
          ))
        )}
      </div>
    </form>
  );
}
