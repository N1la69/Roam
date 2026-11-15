import { Pressable, View, ViewStyle, StyleProp } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { ThemedText } from "./ThemedText";

export interface ProfileRowProps {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ProfileRow({
  label,
  icon,
  onPress,
  showChevron = true,
  style,
}: ProfileRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
          borderRadius: radius.md,
          borderCurve: "continuous",
          gap: spacing.md,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <View style={{ width: 24, alignItems: "center" }}>{icon}</View>

      <ThemedText
        variant="caption"
        style={{
          flex: 1,
          fontWeight: "600",
          color: colors.textPrimary,
        }}
      >
        {label}
      </ThemedText>

      {showChevron && (
        <Feather name="chevron-right" size={18} color={colors.textSecondary} />
      )}
    </Pressable>
  );
}
