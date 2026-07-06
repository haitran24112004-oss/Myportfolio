"use client";

import { useEffect, useState, type FormEvent } from "react";
import Reveal from "./Reveal";

type Comment = {
  id: string;
  name: string;
  text: string;
  date: string;
};

const STORAGE_KEY = "portfolio-comments";

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setComments(JSON.parse(saved));
    } catch {
      // ignore corrupted storage
    }
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const next: Comment[] = [
      {
        id: crypto.randomUUID(),
        name: name.trim() || "Anonymous",
        text: text.trim(),
        date: new Date().toLocaleDateString("en-US"),
      },
      ...comments,
    ];
    setComments(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setText("");
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
            className="rounded-lg bg-zinc-100 px-6 py-2.5 text-sm font-bold text-zinc-900 transition-transform hover:scale-[1.03] active:scale-[0.97]"
          >
            Post Comment
          </button>
        </form>
      </Reveal>

      <div className="max-w-[640px] space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="glass-card rounded-xl px-6 py-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-200">{c.name}</span>
              <span className="mono text-[11px] text-zinc-600">{c.date}</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">{c.text}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="mono text-xs text-zinc-600">
            No comments yet — be the first ✦
          </p>
        )}
      </div>
    </section>
  );
}
