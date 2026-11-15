import { View, ViewStyle, StyleProp } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { ThemedText } from "./ThemedText";

export type BadgeVariant =
  | "guestFavorite"
  | "new"
  | "sale"
  | "superhost"
  | "neutral";

export interface BadgeProps {
  variant?: BadgeVariant;
  label?: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const badgeVariants = {
  guestFavorite: {
    bg: colors.badge.guestFavoriteBg,
    text: colors.badge.guestFavoriteText,
    defaultLabel: "Guest favorite",
    hasStar: true,
  },
  new: {
    bg: colors.badge.newBg,
    text: colors.badge.newText,
    defaultLabel: "New",
    hasStar: false,
  },
  sale: {
    bg: colors.badge.saleBg,
    text: colors.badge.saleText,
    defaultLabel: "20% off",
    hasStar: false,
  },
  superhost: {
    bg: colors.badge.superhostBg,
    text: colors.badge.superhostText,
    defaultLabel: "Superhost",
    hasStar: false,
  },
  neutral: {
    bg: colors.badge.neutralBg,
    text: colors.badge.neutralText,
    defaultLabel: "",
    hasStar: false,
  },
} as const;

export function Badge({
  variant = "neutral",
  label,
  icon,
  style,
}: BadgeProps) {
  const current = badgeVariants[variant];
  const displayLabel = label ?? current.defaultLabel;

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs,
          backgroundColor: current.bg,
          paddingHorizontal: spacing.sm + 2,
          paddingVertical: spacing.xs,
          borderRadius: radius.sm,
          borderCurve: "continuous",
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      {current.hasStar ? (
        <FontAwesome name="star" size={12} color={colors.badge.guestFavoriteStar} />
      ) : icon ? (
        icon
      ) : null}

      <ThemedText
        variant="footnote"
        style={{
          color: current.text,
          fontWeight: "600",
          fontSize: 12,
        }}
      >
        {displayLabel}
      </ThemedText>
    </View>
  );
}
