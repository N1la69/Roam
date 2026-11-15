import {
  Pressable,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
  View,
} from "react-native";
import { colors, spacing, radius } from "@/theme";
import { ThemedText } from "./ThemedText";
import { ArrowRightIcon } from "./ArrowRightIcon";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  title: string;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showArrow?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const variantStyles = {
  primary: {
    backgroundColor: colors.primary,
    borderColor: "transparent",
    borderWidth: 0,
    textColor: colors.textPrimary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    textColor: colors.textPrimary,
  },
  ghost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
    textColor: colors.textPrimary,
  },
} as const;

const sizeStyles = {
  sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  md: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
} as const;

export function Button({
  variant = "primary",
  size = "md",
  title,
  loading,
  disabled,
  icon,
  rightIcon,
  showArrow,
  style,
  onPress,
}: ButtonProps) {
  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  const arrowSize = size === "sm" ? 16 : size === "lg" ? 22 : 18;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!(disabled || loading), busy: !!loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          borderWidth: currentVariant.borderWidth,
          borderRadius: radius.full,
          opacity: disabled ? 0.45 : pressed ? 0.8 : 1,
          ...currentSize,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={currentVariant.textColor} />
      ) : (
        <>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: spacing.sm,
            }}
          >
            {icon}
            <ThemedText
              variant="button"
              style={{
                color: currentVariant.textColor,
                fontSize: size === "sm" ? 14 : size === "lg" ? 17 : 16,
                fontWeight: "600",
              }}
            >
              {title}
            </ThemedText>
            {rightIcon && !showArrow && rightIcon}
          </View>

          {showArrow && (
            <View
              style={{
                position: "absolute",
                right: size === "sm" ? spacing.md : spacing.xl,
                top: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ArrowRightIcon size={arrowSize} color={currentVariant.textColor} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
