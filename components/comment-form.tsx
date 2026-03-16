"use client";

import { FormEvent, useState } from "react";

interface CommentFormProps {
  fatalityId: number;
}

export function CommentForm({ fatalityId }: CommentFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
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
    <form onSubmit={onSubmit} className="neo-card space-y-4">
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
      {message && <p className="text-sm font-semibold">{message}</p>}
    </form>
  );
}
