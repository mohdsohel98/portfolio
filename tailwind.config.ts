import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // "Ink & rust" palette — deep navy-black base, dusty terracotta
        // primary accent, muted violet secondary, warm neutrals for text
        void: "#0a0e14",
        abyss: "#0d1119",
        panel: "#111623",
        rust: "#c97b5d",
        ember: "#cf9a62",
        violet: "#a78bfa",
        steel: "#a49e92",
        bone: "#e8e3da",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "glow-rust": "0 0 20px rgba(201, 123, 93, 0.22)",
        "glow-violet": "0 0 20px rgba(167, 139, 250, 0.22)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blink: "blink 1.2s step-end infinite",
        "spin-slow": "spin 12s linear infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
