/**
 * Roam Design System - Motion & Animation
 */
export const motion = {
  fast: 150, // touch feedback, toggles
  base: 250, // card transitions, modal entrance
  slow: 400, // page navigation, sheets
} as const;

export type MotionToken = keyof typeof motion;
