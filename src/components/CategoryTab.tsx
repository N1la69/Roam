import { Pressable, ViewStyle, StyleProp } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { ThemedText } from "./ThemedText";

export interface CategoryTabProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function CategoryTab({
  label,
  icon,
  active = false,
  onPress,
  style,
}: CategoryTabProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          gap: spacing.xs + 2,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 2,
          borderRadius: radius.full,
          backgroundColor: active ? colors.primary : colors.surfaceGray,
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
          fontWeight: active ? "600" : "500",
        }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}
