"use client";

import { useEffect, useState } from "react";

/**
 * Detects small/touch viewports so we can swap the heavy 3D scene
 * for a lightweight fallback. Defaults to `true` (mobile) until the
 * first client-side check so low-end devices never mount the Canvas.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
