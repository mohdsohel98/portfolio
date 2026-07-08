"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-void/80 backdrop-blur-md border-b border-rust/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        <a href="#top" className="font-mono text-sm tracking-widest text-white">
          <span className="text-rust text-glow-rust">&lt;/&gt;</span>{" "}
          SOHEL<span className="text-rust">.</span>DEV
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-xs uppercase tracking-[0.2em] text-steel hover:text-rust transition-colors"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href={profile.resumeFile} download className="btn-primary !px-4 !py-2 !text-xs">
              Resume
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`block w-6 h-px bg-rust transition-transform ${open ? "rotate-45 translate-y-[3.5px]" : ""}`} />
          <span className={`block w-6 h-px bg-rust transition-transform ${open ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-void/95 backdrop-blur-lg border-b border-rust/10">
          <ul className="px-5 py-4 space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block font-mono text-sm uppercase tracking-[0.2em] text-steel hover:text-rust"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={profile.resumeFile} download className="text-rust font-mono text-sm uppercase tracking-[0.2em]">
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
