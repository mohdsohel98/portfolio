import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-mono text-xs text-steel/60">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-steel/40">
          [ end of transmission ]
        </p>
      </div>
    </footer>
  );
}
