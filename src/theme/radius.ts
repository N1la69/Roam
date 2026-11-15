/**
 * Roam Design System - Corner Radius
 * Non-capsule radii should always be paired with `borderCurve: "continuous"`.
 */
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
