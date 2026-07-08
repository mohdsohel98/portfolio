import { ReactNode } from "react";

/**
 * Glass panel with HUD-style corner brackets — the signature framing
 * element of the "operative HQ" theme.
 */
export default function HudPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const bracket = "absolute w-4 h-4 border-rust/60 pointer-events-none";
  return (
    <div className={`relative glass ${className}`}>
      <span className={`${bracket} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${bracket} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${bracket} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${bracket} bottom-0 right-0 border-b-2 border-r-2`} />
      {children}
    </div>
  );
}
