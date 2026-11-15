/**
 * Roam Design System - Shadows
 * Uses modern React Native `boxShadow` strings.
 */
export const shadows = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
  card: "0 2px 8px rgba(0, 0, 0, 0.06)",
  raised: "0 4px 16px rgba(0, 0, 0, 0.10)",
  overlay: "0 8px 32px rgba(0, 0, 0, 0.16)",
  glass: "0 8px 24px rgba(0, 0, 0, 0.08)",
} as const;

export type ShadowToken = keyof typeof shadows;
