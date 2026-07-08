"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsapConfig";
import { runCommand, quickCommands } from "@/lib/terminalCommands";
import { profile } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import HudPanel from "./HudPanel";

interface TermLine {
  id: number;
  /** cmd = echoed user input, out = command response */
  type: "cmd" | "out";
  text: string;
}

/** ms between typewriter ticks / characters revealed per tick */
const TYPE_INTERVAL = 12;
const CHARS_PER_TICK = 2;

const WELCOME = [
  "booting secure shell...",
  "connection established.",
  "welcome, recruiter. type 'help' to explore this operative's profile.",
];

/**
 * Terminal Playground — fake interactive shell for exploring the profile.
 * Pure DOM/CSS: the typewriter effect is a small queue engine — completed
 * lines live in state, the line currently being "typed" reveals
 * CHARS_PER_TICK characters per tick, then moves to the completed list.
 */
export default function TerminalPlayground() {
  const root = useRef<HTMLElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [lines, setLines] = useState<TermLine[]>([]);
  const [typing, setTypingState] = useState<TermLine | null>(null);
  const [shown, setShown] = useState(0); // chars revealed of `typing`
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);

  // Mutable machinery kept out of React state so handlers stay allocation-free
  const queue = useRef<TermLine[]>([]);
  const typingRef = useRef<TermLine | null>(null);
  const nextId = useRef(0);
  const history = useRef<string[]>([]);
  const histIdx = useRef(0);
  const welcomed = useRef(false);

  const nid = () => nextId.current++;

  const setTyping = (l: TermLine | null) => {
    typingRef.current = l;
    setTypingState(l);
  };

  /** Start typing the next queued line if the typewriter is idle */
  const pump = useCallback(() => {
    if (typingRef.current) return;
    const next = queue.current.shift();
    if (next) {
      setShown(0);
      setTyping(next);
    }
  }, []);

  const enqueue = useCallback(
    (texts: string[], type: TermLine["type"] = "out") => {
      queue.current.push(...texts.map((text) => ({ id: nid(), type, text })));
      pump();
    },
    [pump]
  );

  /** Instantly finish whatever is mid-type (called before running a new command) */
  const flushPending = useCallback(() => {
    const add: TermLine[] = [];
    if (typingRef.current) {
      add.push(typingRef.current);
      setTyping(null);
    }
    add.push(...queue.current);
    queue.current = [];
    if (add.length) setLines((l) => [...l, ...add]);
  }, []);

  // Typewriter tick: reveal characters, promote finished lines, pull the next
  useEffect(() => {
    if (!typing) return;
    if (shown >= typing.text.length) {
      setLines((l) => [...l, typing]);
      setTyping(null);
      const id = setTimeout(pump, 40); // slight beat between lines
      return () => clearTimeout(id);
    }
    const id = setTimeout(
      () => setShown((s) => Math.min(s + CHARS_PER_TICK, typing.text.length)),
      TYPE_INTERVAL
    );
    return () => clearTimeout(id);
  }, [typing, shown, pump]);

  // Auto-scroll the output as lines appear / characters type on
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, shown]);

  const submit = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      flushPending();
      // Echo the command instantly (real terminals don't type your input back)
      setLines((l) => [...l, { id: nid(), type: "cmd", text }]);
      history.current.push(text);
      histIdx.current = history.current.length;
      setInput("");

      const result = runCommand(text);
      if (result.action === "clear") {
        queue.current = [];
        setTyping(null);
        setLines([]);
        return;
      }
      if (result.action === "download-resume") {
        const a = document.createElement("a");
        a.href = profile.resumeFile;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      enqueue(result.lines);
    },
    [enqueue, flushPending]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit(input);
    } else if (e.key === "ArrowUp") {
      // Walk back through command history
      e.preventDefault();
      if (histIdx.current > 0) {
        histIdx.current--;
        setInput(history.current[histIdx.current] ?? "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx.current < history.current.length) {
        histIdx.current++;
        setInput(history.current[histIdx.current] ?? "");
      }
    }
  };

  // Entrance animation + one-time welcome boot sequence on first scroll into view
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Scrubbed entrance: the window rises and scales up with scroll
      gsap.fromTo(
        "[data-term-anim]",
        { y: 80, opacity: 0, scale: 0.96 },
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

      ScrollTrigger.create({
        trigger: root.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          if (welcomed.current) return;
          welcomed.current = true;
          enqueue(WELCOME);
        },
      });
    }, root);
    return () => ctx.revert();
  }, [enqueue]);

  const lineColor = (t: TermLine["type"]) =>
    t === "cmd" ? "text-white" : "text-rust/80";

  return (
    <section id="terminal" ref={root} className="relative py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <SectionHeading code="SEC.05 — CONSOLE" title="Terminal Playground" />

        <div data-term-anim>
          <HudPanel className="overflow-hidden shadow-glow-rust border-rust/25">
            {/* Window header bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.03]">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-400/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <p className="flex-1 text-center font-mono text-xs text-steel/80 select-none">
                sohel@dev:~/portfolio
              </p>
            </div>

            {/* Output area */}
            <div className="relative">
              {/* subtle scanlines over the output only */}
              <div className="terminal-scanlines absolute inset-0 pointer-events-none" />
              <div
                ref={outputRef}
                role="log"
                aria-live="polite"
                data-lenis-prevent
                className="h-72 md:h-80 overflow-y-auto overscroll-contain px-4 py-4 font-mono text-[13px] leading-relaxed space-y-1"
                onClick={() => inputRef.current?.focus()}
              >
                {lines.map((l) => (
                  <p key={l.id} className={`whitespace-pre-wrap ${lineColor(l.type)}`}>
                    {l.type === "cmd" && <span className="text-violet mr-2">❯</span>}
                    {l.text || " "}
                  </p>
                ))}
                {/* Line currently being typed, with block cursor */}
                {typing && (
                  <p className={`whitespace-pre-wrap ${lineColor(typing.type)}`}>
                    {typing.text.slice(0, shown)}
                    <span className="text-rust animate-blink">▊</span>
                  </p>
                )}
              </div>
            </div>

            {/* Input row */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10 bg-white/[0.02]">
              <span className="font-mono text-rust select-none">&gt;</span>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  aria-label="Terminal command input"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="w-full bg-transparent font-mono text-sm text-white outline-none"
                  style={{ caretColor: "#c97b5d" }}
                  placeholder=""
                />
                {/* Idle blinking block cursor — hidden once focused (real caret takes over) */}
                {!focused && input === "" && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-sm text-rust animate-blink pointer-events-none">
                    ▊
                  </span>
                )}
              </div>
            </div>
          </HudPanel>
        </div>

        {/* Quick-command buttons — primary path on touch devices */}
        <div data-term-anim className="mt-5 flex flex-wrap gap-2">
          {quickCommands.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => {
                submit(cmd);
                inputRef.current?.focus();
              }}
              className="glass glass-hover px-3.5 py-2 font-mono text-xs text-rust/90 tracking-wider"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
