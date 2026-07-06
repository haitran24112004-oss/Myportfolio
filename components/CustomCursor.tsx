"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mouse = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let hovering = false;
    let pressed = false;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const target = e.target as HTMLElement;
      hovering = !!target.closest(
        "a, button, [role='button'], input, textarea, label, [data-cursor='hover']"
      );
    };
    const onDown = () => (pressed = true);
    const onUp = () => (pressed = false);

    const tick = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.16;
      ringPos.y += (mouse.y - ringPos.y) * 0.16;

      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%) scale(${
        pressed ? 0.6 : 1
      })`;
      const ringScale = hovering ? 2.2 : pressed ? 0.8 : 1;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%) scale(${ringScale})`;
      ring.style.opacity = hovering ? "1" : "0.5";
      ring.style.background = hovering ? "rgba(255,255,255,0.15)" : "transparent";

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-white pointer-events-none"
        style={{ transition: "opacity 0.2s", mixBlendMode: "difference" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] w-9 h-9 rounded-full border-2 border-white pointer-events-none"
        style={{
          opacity: 0.5,
          transition: "opacity 0.25s, background 0.25s",
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
