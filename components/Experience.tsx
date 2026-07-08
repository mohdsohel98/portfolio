"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsapConfig";
import { experience } from "@/lib/data";
import SectionHeading from "./SectionHeading";

/**
 * Mission-log timeline. Cards alternate sides on desktop and slide in
 * from their respective side with a slight 3D rotation.
 */
export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline spine grows as you scroll through the section
      gsap.fromTo(
        "[data-exp-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 60%",
            end: "bottom 70%",
            scrub: true,
          },
        }
      );

      // Each card slides in from its side with a 3D tilt, scrubbed to scroll
      // so the un-tilt tracks exactly how far the card has entered the viewport
      gsap.utils.toArray<HTMLElement>("[data-exp-card]").forEach((card, i) => {
        const fromLeft = i % 2 === 0;
        gsap.fromTo(
          card,
          { x: fromLeft ? -90 : 90, opacity: 0, rotateY: fromLeft ? 10 : -10 },
          {
            x: 0,
            opacity: 1,
            rotateY: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 60%",
              scrub: 0.6,
            },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={root} className="relative py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeading code="SEC.02 — MISSION LOG" title="Experience" />

        <div className="relative" style={{ perspective: "1200px" }}>
          {/* Vertical spine */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/5">
            <div
              data-exp-line
              className="absolute inset-0 origin-top bg-gradient-to-b from-rust to-violet"
            />
          </div>

          <div className="space-y-12">
            {experience.map((job, i) => (
              <div
                key={job.id}
                className={`relative md:w-[calc(50%-2.5rem)] pl-12 md:pl-0 ${
                  i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                }`}
              >
                {/* Node dot on the spine */}
                <span
                  className={`absolute top-6 w-3 h-3 rounded-full bg-rust shadow-glow-rust
                    left-4 -translate-x-1/2
                    ${i % 2 === 0 ? "md:left-auto md:-right-[2.5rem] md:translate-x-1/2" : "md:-left-[2.5rem] md:-translate-x-1/2"}`}
                />

                <div data-exp-card className="glass glass-hover p-6">
                  <p className="hud-label mb-2">{job.period}</p>
                  <h3 className="text-xl font-bold text-white">{job.role}</h3>
                  <p className="font-mono text-sm text-violet mt-1">
                    {job.company} · {job.location}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {job.achievements.map((a, j) => (
                      <li key={j} className="text-sm text-steel leading-relaxed flex gap-2">
                        <span className="text-rust mt-0.5 shrink-0">▸</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
