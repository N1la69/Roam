import { useState } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  Pressable,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing, fonts } from "@/theme";

export interface InputFieldProps extends TextInputProps {
  variant?: "form" | "search";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export function InputField({
  variant = "form",
  leftIcon,
  rightIcon,
  isPassword,
  onRightIconPress,
  containerStyle,
  style,
  ...props
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSearch = variant === "search";

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          height: isSearch ? 52 : 56,
          backgroundColor: isFocused ? colors.surface : colors.surfaceGray,
          borderRadius: isSearch ? radius.full : radius.lg,
          borderCurve: "continuous",
          borderWidth: 1.5,
          borderColor: isFocused ? colors.lavender : "transparent",
          paddingHorizontal: spacing.md,
          gap: spacing.sm + 2,
        },
        containerStyle,
      ]}
    >
      {leftIcon && <View style={{ alignItems: "center" }}>{leftIcon}</View>}

      <TextInput
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={isPassword && !showPassword}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[
          {
            flex: 1,
            fontFamily: fonts.regular,
            fontSize: 16,
            color: colors.textPrimary,
            paddingVertical: 0,
          },
          style,
        ]}
        {...props}
      />

      {isPassword ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          onPress={() => setShowPassword((prev) => !prev)}
          hitSlop={8}
        >
          <Feather
            name={showPassword ? "eye" : "eye-off"}
            size={18}
            color={colors.textSecondary}
          />
        </Pressable>
      ) : rightIcon ? (
        <Pressable
          accessibilityRole={onRightIconPress ? "button" : undefined}
          onPress={onRightIconPress}
          hitSlop={8}
        >
          {rightIcon}
        </Pressable>
      ) : null}
    </View>
  );
}
