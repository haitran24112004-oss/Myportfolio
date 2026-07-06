"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import HeroCanvas from "./HeroCanvas";
import Typewriter from "./Typewriter";

const Lanyard3D = dynamic(() => import("./Lanyard3D"), { ssr: false });

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-6 md:pl-[120px] md:pr-[60px]"
    >
      <HeroCanvas />

      {/* Lanyard 3D — thẻ treo dây, kéo được. Trải toàn bộ chiều ngang để kéo
          thoải mái không bị hụt hình ở mép; chừa khoảng trống phía trên navbar */}
      <div className="absolute inset-x-0 bottom-0 top-20 z-20 hidden md:block">
        <Lanyard3D />
      </div>

      <div className="relative z-[5] flex w-full flex-col items-center gap-14 md:flex-row md:items-center md:justify-between">
        {/* Left: text */}
        <div className="w-full md:max-w-[600px]">
          <motion.div
            initial={{ opacity: 0, filter: "blur(12px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5"
          >
            <span className="mono text-xs uppercase tracking-[0.2em] text-zinc-500">
              ✦ Available for work
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(32px,6vw,62px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-zinc-100"
          >
            Fullstack
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, x: -80, rotate: -4 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-[clamp(32px,6vw,62px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-zinc-400"
          >
            Developer
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-3 h-6"
          >
            <Typewriter
              words={[
                "Trần Thanh Hải",
                "Software Engineer",
                "Web · Backend · Embedded",
              ]}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mb-7 max-w-[520px] text-[15px] leading-relaxed text-zinc-400"
          >
            Building modern websites and systems with clean, responsive interfaces
            that are easy to use. Turning ideas and designs into complete digital
            experiences — from frontend and backend to embedded devices.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-9 flex flex-wrap gap-2"
          >
            {["TypeScript", "Next.js", "Python", "C++"].map((t) => (
              <span
                key={t}
                className="glass-card mono rounded-full px-4 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-500"
              >
                {t}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95 }}
            className="mono flex flex-col gap-2 text-[13px] text-zinc-500"
          >
            <a
              href="#portfolio"
              className="w-fit transition-colors hover:text-zinc-200"
            >
              ↓ explore my work below
            </a>
            <a
              href="#contact"
              className="w-fit transition-colors hover:text-zinc-200"
            >
              ↗ open to full-time &amp; freelance opportunities
            </a>
          </motion.div>
        </div>

      </div>

      <motion.a
        href="#portfolio"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="mono absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.2em] text-zinc-500 transition-colors hover:text-zinc-200"
      >
        Scroll ↓
      </motion.a>
    </section>
  );
}
