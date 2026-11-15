import { Pressable, View, ViewStyle, StyleProp } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { ThemedText } from "./ThemedText";

export interface PolicyCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function PolicyCard({
  title,
  description,
  icon,
  onPress,
  style,
}: PolicyCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderColor: colors.lavenderBorder,
          borderWidth: 1.5,
          borderRadius: radius.lg,
          borderCurve: "continuous",
          padding: spacing.md,
          gap: spacing.md,
          opacity: pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.md,
          borderCurve: "continuous",
          backgroundColor: colors.lavenderLight,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText
          variant="caption"
          style={{
            fontWeight: "700",
            color: colors.textPrimary,
          }}
        >
          {title}
        </ThemedText>
        <ThemedText
          variant="footnote"
          style={{
            color: colors.textSecondary,
          }}
          numberOfLines={2}
        >
          {description}
        </ThemedText>
      </View>

      <Feather name="chevron-right" size={20} color={colors.lavender} />
    </Pressable>
  );
}
