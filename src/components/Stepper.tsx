import { View, Pressable, ViewStyle, StyleProp } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { ThemedText } from "./ThemedText";

export interface StepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  style?: StyleProp<ViewStyle>;
}

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  step = 1,
  style,
}: StepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surfaceGray,
          borderRadius: radius.full,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          gap: spacing.md,
          alignSelf: "flex-start",
        },
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrement"
        disabled={!canDecrement}
        onPress={() => canDecrement && onChange(value - step)}
        hitSlop={6}
        style={({ pressed }) => ({
          opacity: !canDecrement ? 0.3 : pressed ? 0.6 : 1,
          padding: spacing.xs,
        })}
      >
        <Feather name="minus" size={16} color={colors.textPrimary} />
      </Pressable>

      <ThemedText
        variant="caption"
        style={{
          fontWeight: "700",
          color: colors.textPrimary,
          minWidth: 20,
          textAlign: "center",
        }}
      >
        {value}
      </ThemedText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increment"
        disabled={!canIncrement}
        onPress={() => canIncrement && onChange(value + step)}
        hitSlop={6}
        style={({ pressed }) => ({
          opacity: !canIncrement ? 0.3 : pressed ? 0.6 : 1,
          padding: spacing.xs,
        })}
      >
        <Feather name="plus" size={16} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}
