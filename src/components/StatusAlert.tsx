import { useState } from "react";
import { View, Pressable, ViewStyle, StyleProp } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { ThemedText } from "./ThemedText";

export interface StatusAlertProps {
  type?: "success" | "error";
  message: string;
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function StatusAlert({
  type = "success",
  message,
  onDismiss,
  style,
}: StatusAlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const isSuccess = type === "success";
  const bg = isSuccess ? colors.successBg : colors.errorBg;
  const iconColor = isSuccess ? colors.success : colors.error;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: bg,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm + 4,
          borderRadius: radius.md,
          borderCurve: "continuous",
          gap: spacing.sm + 2,
        },
        style,
      ]}
    >
      <Ionicons
        name={isSuccess ? "checkmark-circle" : "alert-circle"}
        size={20}
        color={iconColor}
      />

      <ThemedText
        variant="caption"
        style={{
          flex: 1,
          color: colors.textPrimary,
          fontWeight: "500",
        }}
      >
        {message}
      </ThemedText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss alert"
        onPress={handleDismiss}
        hitSlop={8}
      >
        <Feather name="x" size={18} color={iconColor} />
      </Pressable>
    </View>
  );
}
