"use client";

import { useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsapConfig";
import { profile } from "@/lib/data";
import { useIsMobile } from "@/hooks/useIsMobile";
import LoadingScreen from "./LoadingScreen";

// Canvas must never render on the server
const HeroScene = dynamic(() => import("./scene/HeroScene"), { ssr: false });

const stats = [
  { label: "EXP", value: "1+ YRS" },
  { label: "STACK", value: "FULL" },
  { label: "STATUS", value: "ACTIVE" },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  // Once the user has dragged the character, the hint fades out for good
  const [hasInteracted, setHasInteracted] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered boot-up entrance for all text elements
      gsap.fromTo(
        "[data-hero-anim]",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.5 }
      );

      // Scroll-linked exit: text shrinks, drifts up and fades as the user
      // scrolls past the hero — scrubbed, so it tracks scroll speed exactly
      gsap.to("[data-hero-content]", {
        yPercent: -30,
        opacity: 0,
        scale: 0.92,
        transformOrigin: "left top",
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom 40%",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="relative min-h-screen flex items-center overflow-hidden">
      {!isMobile && <LoadingScreen />}

      {/* 3D stage — right side on desktop, holographic fallback on mobile */}
      <div
        className="absolute inset-0 md:left-1/3"
        onPointerDown={() => setHasInteracted(true)}
      >
        {isMobile ? (
          <div className="holo-fallback absolute inset-0 flex items-center justify-center">
            <div className="w-56 h-56 rounded-full border border-rust/30 animate-spin-slow relative">
              <span className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rust shadow-glow-rust" />
              <div className="absolute inset-4 rounded-full border border-violet/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-rust/70 text-xs tracking-[0.3em]">MIRA-01</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <HeroScene />
            {/* Interaction hint — fades out permanently after the first drag */}
            <p
              className={`absolute bottom-20 left-1/2 -translate-x-1/2 hud-label !text-[9px] whitespace-nowrap
                transition-opacity duration-1000 pointer-events-none
                ${hasInteracted ? "opacity-0" : "opacity-100 animate-pulse-slow"}`}
            >
              ⟨ drag to rotate ⟩
            </p>
          </>
        )}
      </div>

      {/* Left-edge fade keeps the text readable — stops well before the
          character (from ~45% across) so she isn't darkened by the overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/25 via-30% to-transparent to-55% pointer-events-none" />

      {/* Content */}
      <div data-hero-content className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-8 pt-24 md:pt-16">
        <div className="max-w-xl">
          <p data-hero-anim className="hud-label mb-4">
            &gt; SYSTEM ONLINE _ OPERATIVE PROFILE
          </p>
          <h1
            data-hero-anim
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white uppercase leading-[0.95]"
          >
            Sohel
            <br />
            <span className="text-rust text-gloading">Mansoori</span>
          </h1>
          <p data-hero-anim className="mt-5 font-mono text-lg text-violet text-glow-violet">
            {profile.title}
          </p>
          <p data-hero-anim className="mt-4 text-steel leading-relaxed">
            {profile.tagline}
          </p>

          {/* CTAs */}
          <div data-hero-anim className="mt-8 flex flex-wrap gap-4">
            <a href="#projects" className="btn-primary">
              View Projects
            </a>
            <a href={profile.resumeFile} download className="btn-secondary">
              Download Resume
            </a>
            <a href="#contact" className="btn-secondary">
              Contact
            </a>
          </div>

          {/* HUD stat chips */}
          <div data-hero-anim className="mt-10 flex gap-6">
            {stats.map((s) => (
              <div key={s.label} className="glass px-4 py-2">
                <p className="font-mono text-[9px] tracking-[0.25em] text-steel/70">{s.label}</p>
                <p className="font-mono text-sm text-rust">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="hud-label !text-[9px]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-rust to-transparent animate-pulse-slow" />
      </div>
    </section>
  );
}
