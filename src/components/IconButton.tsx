import {
  Pressable,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
} from "react-native";
import { colors, radius } from "@/theme";

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "surface" | "glass" | "primary";
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}

const sizeMap = {
  sm: { width: 36, height: 36, iconSize: 16 },
  md: { width: 44, height: 44, iconSize: 20 },
  lg: { width: 52, height: 52, iconSize: 24 },
} as const;

export function IconButton({
  icon,
  onPress,
  size = "md",
  variant = "outline",
  disabled,
  loading,
  accessibilityLabel,
  style,
}: IconButtonProps) {
  const dimensions = sizeMap[size];

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
        };
      case "surface":
        return {
          backgroundColor: colors.surfaceGray,
          borderColor: "transparent",
          borderWidth: 0,
        };
      case "glass":
        return {
          backgroundColor: colors.glass,
          borderColor: colors.border,
          borderWidth: 1,
        };
      case "primary":
        return {
          backgroundColor: colors.primary,
          borderColor: "transparent",
          borderWidth: 0,
        };
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: radius.full,
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
          ...getVariantStyle(),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.textPrimary} />
      ) : (
        icon
      )}
    </Pressable>
  );
}
