"use client";

import { motion } from "framer-motion";
import { Code2, User, Globe } from "lucide-react";

const icons = [Code2, User, Globe];

export default function Intro() {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black p-5"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-[320px] flex-col items-center gap-4 text-center text-white"
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.35 } },
          }}
          className="flex items-center justify-center gap-3.5"
        >
          {icons.map((Icon, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, scale: 0.3, rotate: -140, y: 60 },
                visible: { opacity: 1, scale: 1, rotate: 0, y: 0 },
              }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              animate={{ y: [0, -6, 0], rotate: [0, 2, -2, 0] }}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md"
            >
              <Icon size={18} color="white" />
            </motion.div>
          ))}
        </motion.div>

        <div className="flex flex-col items-center gap-0.5">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <motion.span
              initial={{ opacity: 0, x: 120 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(18px,3vw,30px)] font-extrabold tracking-[-0.05em]"
            >
              Winter
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -120 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(18px,3vw,30px)] font-extrabold tracking-[-0.05em]"
            >
              is coming
            </motion.span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="whitespace-nowrap text-center text-[clamp(18px,3vw,30px)] font-extrabold leading-[1.15] tracking-[-0.05em]"
          >
            to my Portfolio
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="mono rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs tracking-[0.12em] text-white/70 backdrop-blur-md"
        >
          thanhhai.dev
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
