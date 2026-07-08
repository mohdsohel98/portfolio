"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsapConfig";
import { projects, Project } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import HudPanel from "./HudPanel";

const accentText: Record<Project["accent"], string> = {
  cyan: "text-rust",
  violet: "text-violet",
  blue: "text-ember",
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <HudPanel className="project-card w-[85vw] sm:w-[420px] shrink-0 p-6 md:p-8 will-change-transform">
      <div className="flex items-start justify-between">
        <p className="hud-label">{project.codename}</p>
        <span className={`font-mono text-xs ${accentText[project.accent]}`}>● DEPLOYED</span>
      </div>
      <h3 className={`mt-4 text-2xl md:text-3xl font-bold uppercase ${accentText[project.accent]}`}>
        {project.name}
      </h3>
      <p className="font-mono text-xs text-steel/80 mt-1 uppercase tracking-wider">
        {project.subtitle}
      </p>
      <p className="mt-4 text-sm text-steel leading-relaxed">{project.description}</p>
      <ul className="mt-4 space-y-1.5">
        {project.highlights.map((h, i) => (
          <li key={i} className="text-xs text-steel/90 flex gap-2">
            <span className={`${accentText[project.accent]} shrink-0`}>+</span>
            {h}
          </li>
        ))}
      </ul>
      <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-2">
        {project.stack.map((t) => (
          <span
            key={t}
            className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-steel"
          >
            {t}
          </span>
        ))}
      </div>
    </HudPanel>
  );
}

/**
 * Desktop: section pins and the card track scrolls horizontally, each card
 * un-tilting from a 3D perspective rotation as it crosses the viewport.
 * Mobile: simple vertical stack with fade-up reveals (no pinning).
 */
export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const trackEl = track.current!;
      const scrollDistance = () => trackEl.scrollWidth - window.innerWidth + 120;

      // Horizontal scrub while the section is pinned
      const tween = gsap.to(trackEl, {
        x: () => -scrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 3D tilt: cards arrive rotated away and straighten as they enter
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.fromTo(
          card,
          { rotateY: 30, opacity: 0.25, scale: 0.92 },
          {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 95%",
              end: "left 45%",
              scrub: true,
            },
          }
        );
      });
    });

    mm.add("(max-width: 767px)", () => {
      // Vertical stack on mobile — rise + un-tilt scrubbed to scroll
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0, rotateX: 8 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              end: "top 65%",
              scrub: 0.6,
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="projects" ref={root} className="relative py-24 md:py-0 md:min-h-screen md:flex md:flex-col md:justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 md:pt-24">
        <SectionHeading code="SEC.03 — OPERATIONS" title="Projects" />
      </div>

      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 md:max-w-none md:px-0" style={{ perspective: "1400px" }}>
        <div
          ref={track}
          className="flex flex-col md:flex-row gap-8 md:gap-10 md:pl-[8vw] md:pr-[10vw] md:pb-24 will-change-transform"
        >
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
