/**
 * Tiny mutable store bridging DOM scroll (GSAP) and the R3F render loop.
 * The 3D scene reads from this every frame instead of re-rendering React
 * on each scroll event — keeps the character reactive at zero React cost.
 */
export const scrollState = {
  /** 0 → 1 progress through the whole page */
  progress: 0,
};
