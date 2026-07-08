"use client";

import { useLayoutEffect, useRef } from "react";
import { FiMail, FiPhone, FiLinkedin, FiGithub, FiDownload } from "react-icons/fi";
import { gsap } from "@/lib/gsapConfig";
import { profile } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import HudPanel from "./HudPanel";

const channels = [
  {
    icon: FiMail,
    label: "Email",
    value: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    icon: FiPhone,
    label: "Phone",
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, "")}`,
  },
  {
    icon: FiLinkedin,
    label: "LinkedIn",
    value: "Connect on LinkedIn",
    href: profile.linkedin,
  },
  {
    icon: FiGithub,
    label: "GitHub",
    value: "Browse repositories",
    href: profile.github,
  },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Scrubbed staggered rise — channel cards surface one after another
      // as the section scrolls in, reversing on the way back up
      gsap.fromTo(
        "[data-contact-anim]",
        { y: 70, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.12,
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
    <section id="contact" ref={root} className="relative py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <SectionHeading code="SEC.07 — UPLINK" title="Contact" />

        <p data-contact-anim className="text-steel max-w-lg mb-10">
          Open to full-time roles, freelance missions, and collaborations.
          Transmission channels below — response time is fast.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {channels.map((c) => (
            <a
              key={c.label}
              data-contact-anim
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="glass glass-hover p-5 flex items-center gap-4 group"
            >
              <span className="w-11 h-11 shrink-0 rounded border border-rust/30 flex items-center justify-center text-rust group-hover:shadow-glow-rust transition-shadow">
                <c.icon className="text-lg" />
              </span>
              <span>
                <span className="block hud-label !text-[9px]">{c.label}</span>
                <span className="block font-mono text-sm text-bone mt-1 break-all">
                  {c.value}
                </span>
              </span>
            </a>
          ))}
        </div>

        <div data-contact-anim>
          <HudPanel className="p-8 text-center">
            <p className="hud-label mb-4">Full dossier available</p>
            <a href={profile.resumeFile} download className="btn-primary">
              <FiDownload /> Download Resume
            </a>
          </HudPanel>
        </div>
      </div>
    </section>
  );
}
