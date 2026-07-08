/**
 * Command registry for the Terminal Playground section.
 * Pure logic, no React — every command maps to a function returning the
 * lines to print (and optionally a side-effect action for the component
 * to perform). Add new commands by adding entries to `registry`.
 */

import { profile, skillGroups, projects, experience, type Project } from "./data";

export interface CommandResult {
  lines: string[];
  /** Side effects the terminal component executes after printing */
  action?: "clear" | "download-resume";
}

interface CommandEntry {
  /** Shown in `help` output; hidden entries (aliases) are omitted */
  desc?: string;
  run: () => CommandResult;
}

/* ---------- output builders ---------- */

function projectDetail(p: Project): string[] {
  return [
    `── ${p.codename} :: ${p.name.toUpperCase()} ──`,
    p.description,
    ...p.highlights.map((h) => `  + ${h}`),
    `  STACK: ${p.stack.join(", ")}`,
  ];
}

/* ---------- registry ---------- */

const registry: Record<string, CommandEntry> = {
  help: {
    desc: "list available commands",
    run: () => ({
      lines: [
        "AVAILABLE COMMANDS",
        ...Object.entries(registry)
          .filter(([, e]) => e.desc)
          .map(([name, e]) => `  ${name.padEnd(18)}${e.desc}`),
      ],
    }),
  },

  whoami: {
    desc: "operative identity",
    run: () => ({
      lines: [
        `${profile.name} — ${profile.title}`,
        "Experience: 1+ yrs  |  Status: ACTIVE",
        `Base: ${profile.location}`,
      ],
    }),
  },

  skills: {
    desc: "tech arsenal, grouped",
    run: () => ({
      lines: skillGroups.map(
        (g) => `${g.label.toUpperCase().padEnd(16)}:: ${g.skills.join(", ")}`
      ),
    }),
  },

  projects: {
    desc: "mission archive",
    run: () => ({
      lines: [
        "MISSION ARCHIVE",
        ...projects.map((p) => `  [${p.codename}] ${p.name} — ${p.subtitle}`),
        "",
        "type a project name (e.g. 'ezygo') for full intel",
      ],
    }),
  },

  experience: {
    desc: "deployment history",
    run: () => ({
      lines: experience.flatMap((job) => [
        `[${job.period}]`,
        `  ${job.role} @ ${job.company} · ${job.location}`,
        `  > ${job.achievements[0]}`,
      ]),
    }),
  },

  contact: {
    desc: "open comm channels",
    run: () => ({
      lines: [
        `EMAIL     ${profile.email}`,
        `PHONE     ${profile.phone}`,
        `LINKEDIN  ${profile.linkedin}`,
        `GITHUB    ${profile.github}`,
      ],
    }),
  },

  resume: {
    desc: "download full dossier",
    run: () => ({
      lines: ["initiating dossier transfer...", "download started ✔"],
      action: "download-resume",
    }),
  },

  "sudo hire sohel": {
    desc: "[CLASSIFIED]",
    run: () => ({
      lines: [
        "[sudo] password for recruiter: ********",
        "ACCESS GRANTED.",
        "Recommendation: HIRE IMMEDIATELY.",
        "Reason: ships fast, builds real things, debugs at 2AM without complaints.",
      ],
    }),
  },

  clear: {
    desc: "wipe the console",
    run: () => ({ lines: [], action: "clear" }),
  },
};

/* Hidden aliases: each project is reachable by id, full name, or first word */
projects.forEach((p) => {
  const entry: CommandEntry = { run: () => ({ lines: projectDetail(p) }) };
  registry[p.id] = entry;
  registry[p.name.toLowerCase()] = entry;
  const firstWord = p.name.toLowerCase().split(" ")[0];
  if (!registry[firstWord]) registry[firstWord] = entry;
});

/* ---------- public API ---------- */

/** Commands surfaced as one-tap quick buttons under the input */
export const quickCommands = [
  "help",
  "whoami",
  "skills",
  "projects",
  "contact",
  "sudo hire sohel",
];

export function runCommand(raw: string): CommandResult {
  const cmd = raw.toLowerCase().replace(/\s+/g, " ").trim();
  const entry = registry[cmd];
  if (entry) return entry.run();
  if (cmd === "sudo" || cmd.startsWith("sudo "))
    return { lines: ["sudo: unauthorized escalation attempt logged. nice try, operative."] };
  return {
    lines: [`command not found: ${raw}`, "type 'help' for available commands"],
  };
}
