"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";

type Tab = "projects" | "certificates" | "techstack";

const projects = [
  {
    title: "callcaloAI",
    role: "iOS Developer (Solo) · 2026",
    description:
      "An AI-powered iOS calorie tracking app that uses Google Gemini Vision to recognize food from photos and provide instant nutritional analysis.",
    tags: [
      "Swift",
      "SwiftUI",
      "SwiftData",
      "Gemini API",
      "Google Sign-In",
      "Swift Charts",
    ],
    link: "https://github.com/haitran24112004-oss/callcaloAI",
    highlights: [
      "AI food recognition via Google Gemini Vision: snap a photo to get instant calories, carbs, protein, and fat with a confidence score",
      "Manual food search across 3 nutrition databases simultaneously: USDA FoodData Central, Open Food Facts, and Calorie Ninjas API",
      "Daily dashboard with a calorie ring, macro tracking, weight/water charts via Swift Charts, BMI calculator, and Google Sign-In",
    ],
  },
  {
    title: "CRM.lemar.vn",
    role: "Fullstack Developer (Solo) · 2025 – 2026",
    description:
      "A comprehensive internal management system for a marine/engineering services company: quotations, invoices, contracts, HR, inventory, finance, partners, and an analytics dashboard.",
    tags: ["Next.js", "NextAuth", "JWT", "Recharts", "Custom Print CSS"],
    link: "https://crm.lemar.vn",
    highlights: [
      "Commercial document management: Quotations, Invoices, Contracts, PO/SO, Packing Lists, Delivery Notes",
      "Authentication & authorization with NextAuth + JWT + bcrypt, middleware-protected routes",
      "PDF document export with custom print CSS, dashboard for business data visualization",
    ],
  },
  {
    title: "AI Attendance Terminal",
    role: "Backend & Embedded Software Developer · 2026",
    description:
      "A smart attendance system with face recognition and RFID cards: ESP32-S3 firmware, FastAPI backend with InsightFace anti-spoofing, two-way device ↔ server communication.",
    tags: ["C++", "ESP32-S3", "Python", "FastAPI", "OpenCV", "WebSocket"],
    link: null,
    highlights: [
      "ESP32-S3 firmware (C++/Arduino): Wiegand card reading, door relay control, real-time WebSocket",
      "FastAPI backend integrating InsightFace face recognition, anti-spoofing, automatic check-in/out",
      "Two-way REST API: ESP32 sends photos/RFID to the server, server calls back to ESP32 to unlock the door",
    ],
  },
  {
    title: "Web Development @ Lemar Vietnam",
    role: "IT Intern · 2024 – present",
    description:
      "Managing website development projects from design to completion, optimizing cross-browser and cross-platform compatibility; building custom themes for WordPress and PHP-Fusion.",
    tags: ["WordPress", "PHP", "PHP-Fusion", "Code Review"],
    link: null,
    highlights: [
      "Developed and integrated custom themes into WordPress and PHP-Fusion",
      "Tested new features to ensure compatibility with existing systems",
      "Reviewed source code and supported teammates",
    ],
  },
];

const techStack: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: ["TypeScript", "React / Next.js", "Tailwind CSS", "HTML/CSS/JS", "Recharts"],
  },
  {
    group: "Backend",
    items: ["Python / FastAPI", "Node.js", "NextAuth + JWT", "SQLite / SQLAlchemy", "REST API"],
  },
  {
    group: "Embedded & Others",
    items: ["C++ / Arduino (ESP32)", "OpenCV / InsightFace", "WebSocket", "WordPress / PHP", "Git"],
  },
];

const tabs: { id: Tab; label: string }[] = [
  { id: "projects", label: "Projects" },
  { id: "certificates", label: "Certificates" },
  { id: "techstack", label: "Tech Stack" },
];

export default function Portfolio() {
  const [tab, setTab] = useState<Tab>("projects");

  return (
    <section id="portfolio" className="relative px-6 py-28 md:px-[120px]">
      <Reveal>
        <p className="mono mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">
          ✦ Portfolio Showcase
        </p>
        <h2 className="mb-4 text-[clamp(28px,4vw,44px)] font-extrabold tracking-[-0.02em] text-zinc-100">
          Portfolio Showcase
        </h2>
        <p className="mb-10 max-w-[540px] text-[15px] leading-relaxed text-zinc-400">
          Explore my journey through projects, certificates, and the
          technologies I&apos;ve worked with.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="glass-card mb-10 flex w-fit gap-1 rounded-full p-1.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative rounded-full px-5 py-2 text-sm transition-colors ${
                tab === t.id ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-zinc-100"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === "projects" && (
            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((p, i) => (
                <motion.article
                  key={p.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  whileHover={{ y: -6 }}
                  className="glass-card group rounded-2xl p-7 transition-colors hover:border-zinc-600"
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold text-zinc-100">
                      {p.title}
                    </h3>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono text-xs text-zinc-500 transition-colors hover:text-zinc-100"
                      >
                        {p.link.includes("github.com") ? "code" : "visit"} ↗
                      </a>
                    )}
                  </div>
                  <p className="mono mb-4 text-xs text-zinc-500">{p.role}</p>
                  <p className="mb-5 text-sm leading-relaxed text-zinc-400">
                    {p.description}
                  </p>
                  <ul className="mb-6 space-y-2">
                    {p.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex gap-2 text-[13px] leading-relaxed text-zinc-500"
                      >
                        <span className="text-zinc-600">✦</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="mono rounded-full border border-zinc-800 px-3 py-1 text-[11px] text-zinc-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          {tab === "certificates" && (
            <div className="glass-card flex flex-col items-center gap-3 rounded-2xl px-8 py-20 text-center">
              <span className="text-3xl">✦</span>
              <p className="text-zinc-300">Certificates coming soon.</p>
              <p className="mono text-xs text-zinc-500">
                FPT University Ho Chi Minh City — Software Engineering (2022 – present)
              </p>
            </div>
          )}

          {tab === "techstack" && (
            <div className="grid gap-6 md:grid-cols-3">
              {techStack.map((g, i) => (
                <motion.div
                  key={g.group}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="glass-card rounded-2xl p-7"
                >
                  <h3 className="mono mb-5 text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {g.group}
                  </h3>
                  <ul className="space-y-3">
                    {g.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm text-zinc-300"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
