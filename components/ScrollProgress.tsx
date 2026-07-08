"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { scrollState } from "@/lib/scrollState";

/**
 * Thin neon progress bar pinned to the top of the viewport.
 * Also feeds global scroll progress into `scrollState` for the 3D scene.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        scrollState.progress = self.progress;
        if (barRef.current) {
          gsap.set(barRef.current, { scaleX: self.progress });
        }
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-white/5">
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-rust to-violet shadow-glow-rust"
      />
    </div>
  );
}
