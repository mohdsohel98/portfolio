"use client";

import { useLayoutEffect, useRef } from "react";
import type { IconType } from "react-icons";
import {
  SiJavascript,
  SiTypescript,
  SiPhp,
  SiCplusplus,
  SiReact,
  SiNextdotjs,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiNodedotjs,
  SiNestjs,
  SiExpress,
  SiDotnet,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiDocker,
  SiGit,
  SiGithub,
  SiJsonwebtokens,
  SiRazorpay,
  SiJira,
  SiPostman,
} from "react-icons/si";
import { TbBrandCSharp, TbApi, TbShieldLock, TbCloudUpload } from "react-icons/tb";
import { gsap } from "@/lib/gsapConfig";
import { skillGroups } from "@/lib/data";
import SectionHeading from "./SectionHeading";

/** Maps skill names from the resume data to their brand icons. */
const iconMap: Record<string, IconType> = {
  "JavaScript (ES6+)": SiJavascript,
  TypeScript: SiTypescript,
  PHP: SiPhp,
  "C++": SiCplusplus,
  "C#": TbBrandCSharp,
  "React.js": SiReact,
  "Next.js": SiNextdotjs,
  "React Native": SiReact,
  HTML5: SiHtml5,
  CSS3: SiCss3,
  "Tailwind CSS": SiTailwindcss,
  "Node.js": SiNodedotjs,
  NestJS: SiNestjs,
  "Express.js": SiExpress,
  "ASP.NET Core": SiDotnet,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  "SQL Server": SiMysql,
  Docker: SiDocker,
  Git: SiGit,
  GitHub: SiGithub,
  "Azure Blob": TbCloudUpload,
  "REST APIs": TbApi,
  JWT: SiJsonwebtokens,
  "OAuth 2.0": TbShieldLock,
  Razorpay: SiRazorpay,
  Jira: SiJira,
  Postman: SiPostman,
};

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Each group slides in and its chips cascade — both scrubbed, so the
      // cascade rolls forward/backward with the scroll instead of firing once
      gsap.utils.toArray<HTMLElement>("[data-skill-group]").forEach((group, i) => {
        gsap.fromTo(
          group,
          { x: i % 2 === 0 ? -70 : 70, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: group,
              start: "top 95%",
              end: "top 65%",
              scrub: 0.6,
            },
          }
        );
        gsap.fromTo(
          group.querySelectorAll("[data-skill-chip]"),
          { scale: 0.7, opacity: 0, y: 24 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: group,
              start: "top 90%",
              end: "top 50%",
              scrub: 0.6,
            },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={root} className="relative py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <SectionHeading code="SEC.04 — ARSENAL" title="Skills" />

        <div className="space-y-10">
          {skillGroups.map((group) => (
            <div key={group.label} data-skill-group>
              <div className="flex items-center gap-4 mb-5">
                <h3 className="font-mono text-sm uppercase tracking-[0.25em] text-violet">
                  {group.label}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-violet/30 to-transparent" />
              </div>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill) => {
                  const Icon = iconMap[skill];
                  return (
                    <div
                      key={skill}
                      data-skill-chip
                      className="glass glass-hover px-4 py-2.5 flex items-center gap-2.5 cursor-default"
                    >
                      {Icon && <Icon className="text-rust text-lg shrink-0" />}
                      <span className="font-mono text-sm text-bone">{skill}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
