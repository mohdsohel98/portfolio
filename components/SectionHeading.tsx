"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsapConfig";

/**
 * Standard section heading: mission-code label + big title + glowing rule.
 * The reveal is scrubbed to scroll position (not fired once): the code slides
 * in, the title wipes open via clip-path, and the rule draws itself — all
 * progressing and reversing with the user's actual scroll.
 */
export default function SectionHeading({
  code,
  title,
}: {
  code: string;
  title: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const scrub = () => ({
        trigger: root.current,
        start: "top 92%",
        end: "top 55%",
        scrub: 0.6,
      });

      gsap.fromTo(
        "[data-h-code]",
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, ease: "none", scrollTrigger: scrub() }
      );
      gsap.fromTo(
        "[data-h-title]",
        { clipPath: "inset(0 100% 0 0)", y: 24 },
        { clipPath: "inset(0 0% 0 0)", y: 0, ease: "none", scrollTrigger: scrub() }
      );
      gsap.fromTo(
        "[data-h-line]",
        { scaleX: 0 },
        { scaleX: 1, transformOrigin: "left center", ease: "none", scrollTrigger: scrub() }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="mb-12 md:mb-16">
      <p data-h-code className="hud-label mb-3">
        {"//"} {code}
      </p>
      <h2
        data-h-title
        className="text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-wide text-white will-change-[clip-path,transform]"
      >
        {title}
      </h2>
      <div data-h-line className="heading-line h-px w-40 mt-4" />
    </div>
  );
}
