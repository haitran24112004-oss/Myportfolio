"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const directions = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 60, y: 0 },
  right: { x: -60, y: 0 },
  none: { x: 0, y: 0 },
} as const;

export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  blur = true,
  className,
}: {
  children: ReactNode;
  direction?: keyof typeof directions;
  delay?: number;
  blur?: boolean;
  className?: string;
}) {
  const offset = directions[direction];
  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...offset,
      filter: blur ? "blur(10px)" : "blur(0px)",
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}
