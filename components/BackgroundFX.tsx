"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsapConfig";

/**
 * Fixed background layer with parallax: the blueprint grid and three blurred
 * glow orbs drift at different speeds than the content, scrubbed against the
 * full page scroll. Transform-only animation on a handful of elements —
 * effectively free at render time.
 */
export default function BackgroundFX() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Each layer gets its own speed → depth illusion while scrolling
      const layers: Array<[string, gsap.TweenVars]> = [
        ["[data-fx-grid]", { yPercent: -6 }],
        ["[data-fx-orb1]", { y: -380, x: 90 }],
        ["[data-fx-orb2]", { y: -700, x: -70 }],
        ["[data-fx-orb3]", { y: -240 }],
      ];
      layers.forEach(([sel, vars]) => {
        gsap.to(sel, {
          ...vars,
          ease: "none",
          scrollTrigger: {
            start: 0,
            end: "max",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
    >
      {/* Blueprint grid — oversized so parallax never exposes an edge */}
      <div data-fx-grid className="bg-grid absolute -inset-[12%] will-change-transform" />
      {/* Glow orbs */}
      <div
        data-fx-orb1
        className="absolute -top-48 -left-48 w-[36rem] h-[36rem] rounded-full bg-rust/[0.07] blur-[120px] will-change-transform"
      />
      <div
        data-fx-orb2
        className="absolute top-[65%] -right-56 w-[40rem] h-[40rem] rounded-full bg-violet/[0.06] blur-[130px] will-change-transform"
      />
      <div
        data-fx-orb3
        className="absolute top-[135%] left-1/4 w-[28rem] h-[28rem] rounded-full bg-ember/[0.05] blur-[110px] will-change-transform"
      />
    </div>
  );
}
