/**
 * Roam Design System - Colors
 * Derived directly from the Roam brand & component specification.
 */
export const colors = {
  // Brand
  primary: "#FFC629",
  primaryLight: "#FEF6E6",
  lavender: "#C9B4FF",
  lavenderLight: "#F3EFFF",
  lavenderBorder: "#EBE4FF",

  // Text
  textPrimary: "#0B0B1A",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  textWhite: "#FFFFFF",

  // Surfaces & Backgrounds
  surface: "#FFFFFF",
  surfaceGray: "#F4F5F7",
  surfaceDark: "#0B0B1A",

  // Borders & Dividers
  border: "#E5E7EB",
  borderDark: "#D1D5DB",

  // Glassmorphism / Blur overlays
  glass: "rgba(255, 255, 255, 0.7)",
  glassDark: "rgba(11, 11, 26, 0.7)",

  // Status & Feedback
  success: "#10B981",
  successBg: "#EAF7EE",
  error: "#EF4444",
  errorBg: "#FEEBED",
  warning: "#F59E0B",
  warningBg: "#FEF3C7",

  // Tags & Badges
  badge: {
    guestFavoriteBg: "#FEF6E6",
    guestFavoriteText: "#0B0B1A",
    guestFavoriteStar: "#F59E0B",
    newBg: "#E6F9F0",
    newText: "#059669",
    saleBg: "#FCEEF3",
    saleText: "#DB2777",
    superhostBg: "#EEF2FF",
    superhostText: "#4F46E5",
    neutralBg: "#F4F5F7",
    neutralText: "#0B0B1A",
  },
} as const;

export type ColorToken = keyof typeof colors;
