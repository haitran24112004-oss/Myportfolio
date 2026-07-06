"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";

type Tab = "projects" | "certificates" | "techstack";

const projects = [
  {
    title: "CRM.lemar.vn",
    role: "Fullstack Developer (Solo) · 2025 – 2026",
    description:
      "Hệ thống quản lý nội bộ toàn diện cho doanh nghiệp dịch vụ kỹ thuật marine/engineering: báo giá, hóa đơn, hợp đồng, quản lý nhân sự, vật tư, tài chính, đối tác và dashboard analytics.",
    tags: ["Next.js", "NextAuth", "JWT", "Recharts", "Custom Print CSS"],
    link: "https://crm.lemar.vn",
    highlights: [
      "Quản lý tài liệu thương mại: Quotations, Invoices, Contracts, PO/SO, Packing Lists, Delivery Notes",
      "Authentication & phân quyền với NextAuth + JWT + bcrypt, middleware bảo vệ routes",
      "Xuất PDF tài liệu với custom print CSS, dashboard trực quan hóa dữ liệu kinh doanh",
    ],
  },
  {
    title: "AI Attendance Terminal",
    role: "Backend & Embedded Software Developer · 2026",
    description:
      "Hệ thống chấm công thông minh tích hợp nhận diện khuôn mặt và thẻ RFID: firmware ESP32-S3, backend FastAPI với InsightFace anti-spoofing, giao tiếp 2 chiều thiết bị ↔ server.",
    tags: ["C++", "ESP32-S3", "Python", "FastAPI", "OpenCV", "WebSocket"],
    link: null,
    highlights: [
      "Firmware ESP32-S3 (C++/Arduino): đọc thẻ Wiegand, điều khiển relay cửa, WebSocket real-time",
      "Backend FastAPI tích hợp InsightFace nhận diện khuôn mặt, chống giả mạo, tự động check-in/out",
      "REST API 2 chiều: ESP32 gửi ảnh/RFID lên server, server gọi lại ESP32 để mở cửa",
    ],
  },
  {
    title: "Web Development @ Lemar Việt Nam",
    role: "Thực tập sinh IT · 2024 – nay",
    description:
      "Quản lý các dự án phát triển website từ thiết kế đến hoàn thiện, tối ưu tương thích đa trình duyệt và nền tảng; phát triển theme tùy chỉnh cho WordPress, PHP-Fusion.",
    tags: ["WordPress", "PHP", "PHP-Fusion", "Code Review"],
    link: null,
    highlights: [
      "Phát triển và tích hợp các theme tùy chỉnh vào WordPress, PHP-Fusion",
      "Đánh giá, thử nghiệm tính năng mới đảm bảo tương thích với hệ thống hiện có",
      "Tham gia review source code và hỗ trợ các thành viên trong nhóm",
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
    group: "Embedded & Khác",
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
          Khám phá hành trình của mình qua các dự án, chứng chỉ và công nghệ đã
          sử dụng.
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
                        visit ↗
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
              <p className="text-zinc-300">Chứng chỉ sẽ được cập nhật sớm.</p>
              <p className="mono text-xs text-zinc-500">
                Đại học FPT TP. Hồ Chí Minh — Kỹ thuật phần mềm (2022 – nay)
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
