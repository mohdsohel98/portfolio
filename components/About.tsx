"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsapConfig";
import { profile, education } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import HudPanel from "./HudPanel";

const highlights = [
  { k: "React / Next.js", v: "Frontend Systems" },
  { k: "Node / NestJS", v: "Backend Services" },
  { k: "React Native", v: "Mobile Apps" },
  { k: "PostgreSQL / Docker", v: "Data & Infra" },
];

export default function About() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Scrubbed reveal: panels rise and settle in sync with scroll position,
      // reversing if the user scrolls back up
      gsap.fromTo(
        "[data-about-anim]",
        { y: 90, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.6,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading code="SEC.01 — DOSSIER" title="About" />

        <div className="grid md:grid-cols-5 gap-8">
          {/* Summary */}
          <div data-about-anim className="md:col-span-3">
            <HudPanel className="p-6 md:p-8 h-full">
              <p className="hud-label mb-4">Professional Summary</p>
              <p className="text-steel leading-relaxed">{profile.summary}</p>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="hud-label mb-2">Education</p>
                <p className="text-white font-medium">{education.degree}</p>
                <p className="font-mono text-sm text-steel">
                  {education.school} · {education.period}
                </p>
              </div>
            </HudPanel>
          </div>

          {/* Capability grid */}
          <div data-about-anim className="md:col-span-2 grid grid-cols-2 gap-4">
            {highlights.map((h) => (
              <div key={h.k} className="glass glass-hover p-5 flex flex-col justify-between">
                <p className="font-mono text-rust text-sm">{h.k}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-steel/70">{h.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
