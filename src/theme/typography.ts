import { TextStyle } from "react-native";
import { colors } from "./colors";

/**
 * Roam Design System - Typography
 * Implements the Geometric Sans (Plus Jakarta Sans) scale specified in the design.
 */
export const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
} as const;

export const type = {
  display: {
    fontSize: 56,
    lineHeight: 56,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    letterSpacing: -1.5,
  },
  heading: {
    fontSize: 30,
    lineHeight: 36,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: fonts.semiBold,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  button: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  caption: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  footnote: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof type;
