"use client";

import { useState, type FormEventHandler } from "react";
import Reveal from "./Reveal";

const EMAIL = "haitran24112004@gmail.com";

const socials = [
  {
    name: "GitHub",
    handle: "@haitran24112004-oss",
    href: "https://github.com/haitran24112004-oss",
  },
  { name: "LinkedIn", handle: "@linkedin", href: "https://linkedin.com/" },
  {
    name: "Facebook",
    handle: "@thanh.hai.112417",
    href: "https://www.facebook.com/thanh.hai.112417",
  },
  { name: "Email", handle: EMAIL, href: `mailto:${EMAIL}` },
  { name: "Phone / Zalo", handle: "0922 839 979", href: "tel:0922839979" },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${name || "a visitor"}`);
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="relative px-6 py-28 md:px-[120px]">
      <Reveal>
        <p className="mono mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
          ✦ Contact Me
        </p>
        <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-[-0.02em] text-zinc-100">
          Contact Me
        </h2>
        <p className="mb-12 max-w-[540px] text-[15px] leading-relaxed text-zinc-400">
          Have something in mind? Send a message and let&apos;s connect.
        </p>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal direction="right" delay={0.1}>
          <form onSubmit={onSubmit} className="glass-card rounded-2xl p-8">
            <h3 className="mb-6 text-lg font-bold text-zinc-100">
              Send Message
            </h3>
            <label className="mono mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
              Your Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mb-5 w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-zinc-500"
            />
            <label className="mono mb-2 block text-xs uppercase tracking-[0.15em] text-zinc-500">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi Hai, I'd like to talk about..."
              rows={5}
              className="mb-6 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-zinc-500"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-zinc-100 py-3 text-sm font-bold text-zinc-900 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Send Message ↗
            </button>
          </form>
        </Reveal>

        <Reveal direction="left" delay={0.2}>
          <div className="glass-card h-full rounded-2xl p-8">
            <h3 className="mb-6 text-lg font-bold text-zinc-100">
              Connect With Me
            </h3>
            <ul className="space-y-3">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-zinc-800/60 px-5 py-4 transition-colors hover:border-zinc-500 hover:bg-zinc-800/30"
                  >
                    <span className="text-sm font-medium text-zinc-200">
                      {s.name}
                    </span>
                    <span className="mono text-xs text-zinc-500 transition-colors group-hover:text-zinc-200">
                      {s.handle} ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
