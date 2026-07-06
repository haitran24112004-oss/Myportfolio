"use client";

import { useEffect, useState, type FormEvent } from "react";
import Reveal from "./Reveal";

type Comment = {
  id: string;
  name: string;
  text: string;
  created_at: string;
};

const MINE_KEY = "portfolio-my-comment-ids";

function getMineIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(MINE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [mineIds, setMineIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/comments");
      const data = await res.json();
      setComments(data.comments ?? []);
    } catch {
      // network hiccup — leave list as-is
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMineIds(getMineIds());
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text }),
      });
      const data = await res.json();
      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        const nextMine = [data.comment.id, ...mineIds];
        setMineIds(nextMine);
        localStorage.setItem(MINE_KEY, JSON.stringify(nextMine));
      }
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    const nextMine = mineIds.filter((mid) => mid !== id);
    setMineIds(nextMine);
    localStorage.setItem(MINE_KEY, JSON.stringify(nextMine));
    await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
  };

  return (
    <section id="comments" className="relative px-6 py-28 md:px-[120px]">
      <Reveal>
        <p className="mono mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
          ✦ Comments
        </p>
        <h2 className="mb-12 text-[clamp(28px,4vw,44px)] font-extrabold tracking-[-0.02em] text-zinc-100">
          Leave your thoughts
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <form
          onSubmit={onSubmit}
          className="glass-card mb-8 max-w-[640px] rounded-2xl p-8"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="mb-4 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-zinc-500"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="mb-5 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-zinc-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-zinc-100 px-6 py-2.5 text-sm font-bold text-zinc-900 transition-transform hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </form>
      </Reveal>

      <div className="max-w-[640px] space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="glass-card rounded-xl px-6 py-4">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-zinc-200">{c.name}</span>
              <div className="flex items-center gap-3">
                <span className="mono text-[11px] text-zinc-600">
                  {new Date(c.created_at).toLocaleDateString("en-US")}
                </span>
                {mineIds.includes(c.id) && (
                  <button
                    onClick={() => onDelete(c.id)}
                    className="mono text-[11px] text-zinc-600 transition-colors hover:text-red-400"
                  >
                    delete
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">{c.text}</p>
          </div>
        ))}
        {!loading && comments.length === 0 && (
          <p className="mono text-xs text-zinc-600">
            No comments yet — be the first ✦
          </p>
        )}
      </div>
    </section>
  );
}
