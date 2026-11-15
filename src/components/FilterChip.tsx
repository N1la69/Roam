import { Pressable, ViewStyle, StyleProp } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { ThemedText } from "./ThemedText";

export interface FilterChipProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  activeColor?: "lavender" | "primary";
  style?: StyleProp<ViewStyle>;
}

export function FilterChip({
  label,
  active = false,
  onPress,
  icon,
  activeColor = "lavender",
  style,
}: FilterChipProps) {
  const activeBg = activeColor === "lavender" ? colors.lavender : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs + 2,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: radius.full,
          backgroundColor: active ? activeBg : colors.surfaceGray,
          opacity: pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      {icon}
      <ThemedText
        variant="caption"
        style={{
          color: colors.textPrimary,
          fontSize: 14,
        }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}
