"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsapConfig";
import { leadership } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import HudPanel from "./HudPanel";

export default function Leadership() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Scrubbed clip-path reveal: the panel wipes open from the center line
      gsap.fromTo(
        "[data-lead-anim]",
        { y: 70, opacity: 0, clipPath: "inset(8% 14% 8% 14% round 8px)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0% round 8px)",
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 88%",
            end: "top 45%",
            scrub: 0.6,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="leadership" ref={root} className="relative py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <SectionHeading code="SEC.06 — COMMAND" title="Leadership" />

        <div data-lead-anim>
          <HudPanel className="p-8 md:p-10 text-center">
            <p className="hud-label mb-3">{leadership.period}</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              {leadership.role}
            </h3>
            <p className="font-mono text-violet mt-2">{leadership.org}</p>
            <p className="mt-5 text-steel leading-relaxed max-w-xl mx-auto">
              {leadership.description}
            </p>
            <div className="mt-6 inline-flex items-center gap-3 glass px-5 py-2.5">
              <span className="font-mono text-2xl font-bold text-rust text-glow-rust">
                100+
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-steel">
                members trained
              </span>
            </div>
          </HudPanel>
        </div>
      </div>
    </section>
  );
}
