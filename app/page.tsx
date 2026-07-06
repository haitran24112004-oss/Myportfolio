"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";
import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import Comments from "@/components/Comments";
import Footer from "@/components/Footer";

export default function Home() {
  const [showIntro, setShowIntro] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // F5/reload thật sự thì phát lại intro; chỉ chuyển trang trong site mới giữ đã-xem
    const [nav] = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    if (nav?.type === "reload") {
      sessionStorage.removeItem("introPlayed");
    }

    if (sessionStorage.getItem("introPlayed") === "true") {
      setAppReady(true);
      return;
    }
    setShowIntro(true);
    const timer = setTimeout(() => {
      setShowIntro(false);
      setAppReady(true);
      sessionStorage.setItem("introPlayed", "true");
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SmoothScroll>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main className="relative overflow-hidden">
        {/* Fixed background: blurred orbs + grid */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-white opacity-30 blur-[90px] md:h-56 md:w-56" />
            <div className="absolute right-10 top-10 h-40 w-40 rounded-full bg-zinc-300 opacity-25 blur-[100px] md:h-56 md:w-56" />
            <div className="absolute bottom-10 left-10 h-44 w-44 rounded-full bg-zinc-400 opacity-30 blur-[110px] md:h-60 md:w-60" />
            <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-white opacity-20 blur-[100px] md:h-56 md:w-56" />
          </div>
          <div className="grid-bg absolute inset-0" />
        </div>

        <div className="relative z-[2]">
          {appReady && (
            <>
              <Hero />
              <Portfolio />
              <Contact />
              <Comments />
              <Footer />
            </>
          )}
        </div>
      </main>

      <AnimatePresence>{showIntro && <Intro key="intro" />}</AnimatePresence>
    </SmoothScroll>
  );
}
