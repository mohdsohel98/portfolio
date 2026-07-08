"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { gsap } from "@/lib/gsapConfig";

/**
 * Full-screen "system boot" overlay shown while the GLB streams in.
 * Driven by drei's useProgress; fades out with GSAP once loading completes.
 */
export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active && progress >= 100 && overlayRef.current && !done) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.8,
        delay: 0.4,
        ease: "power2.inOut",
        onComplete: () => setDone(true),
      });
    }
  }, [active, progress, done]);

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[90] bg-void flex flex-col items-center justify-center gap-6"
    >
      <p className="hud-label animate-blink">Initializing Operative</p>
      <h1 className="font-mono text-4xl sm:text-6xl font-bold text-rust text-glow-rust tabular-nums">
        {Math.round(progress)}%
      </h1>
      <div className="w-64 sm:w-80 h-px bg-white/10 relative overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-rust to-violet transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="font-mono text-[10px] text-steel/60 tracking-[0.25em] uppercase">
        Loading combat asset · mira.glb
      </p>
    </div>
  );
}
