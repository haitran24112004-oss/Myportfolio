"use client";

import { motion } from "framer-motion";

const links = [
  { label: "Home", href: "#home" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-1/2 top-5 z-[100] w-[calc(100%-2.5rem)] max-w-[1240px] -translate-x-1/2"
    >
      <nav className="glass-card flex items-center justify-between rounded-2xl px-6 py-3.5">
        <a
          href="#home"
          className="mono text-sm tracking-wide text-zinc-200 transition-colors hover:text-white"
        >
          thanhhai.dev
        </a>
        <div className="mono hidden items-center gap-9 text-[13px] tracking-[0.12em] sm:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-zinc-500 transition-colors hover:text-zinc-100"
            >
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </motion.header>
  );
}
