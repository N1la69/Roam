import { Pressable, View, ViewStyle, StyleProp } from "react-native";
import { colors, radius } from "@/theme";

export interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ToggleSwitch({
  value,
  onValueChange,
  disabled,
  style,
}: ToggleSwitchProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={({ pressed }) => [
        {
          width: 52,
          height: 32,
          borderRadius: radius.full,
          backgroundColor: value ? colors.primary : colors.border,
          padding: 3,
          justifyContent: "center",
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: radius.full,
          backgroundColor: colors.surface,
          alignSelf: value ? "flex-end" : "flex-start",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
        }}
      />
    </Pressable>
  );
}
