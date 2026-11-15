import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  Pressable,
  ViewStyle,
  StyleProp,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, fonts } from "@/theme";

export interface StackedInputFieldProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function StackedInputField({
  label,
  icon,
  isPassword = false,
  error,
  containerStyle,
  style,
  ...props
}: StackedInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  const hasError = Boolean(error);

  return (
    <View style={{ gap: 4 }}>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: isFocused ? colors.surface : colors.surfaceGray,
            borderRadius: 20,
            borderCurve: "continuous",
            borderWidth: 1.5,
            borderColor: hasError
              ? colors.error
              : isFocused
              ? colors.lavender
              : "transparent",
            paddingVertical: 12,
            paddingHorizontal: 16,
            gap: 14,
          },
          containerStyle,
        ]}
      >
        {/* Left Icon */}
        {icon && (
          <View style={{ width: 24, alignItems: "center", justifyContent: "center" }}>
            {icon}
          </View>
        )}

        {/* Label & Input Stack */}
        <View style={{ flex: 1, gap: 2 }}>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 14,
              lineHeight: 18,
              color: colors.textPrimary,
            }}
          >
            {label}
          </Text>

          <TextInput
            ref={inputRef}
            secureTextEntry={isPassword && !showPassword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholderTextColor={colors.textSecondary}
            style={[
              {
                fontFamily: fonts.regular,
                fontSize: 15,
                color: colors.textPrimary,
                padding: 0,
                margin: 0,
              },
              style,
            ]}
            {...props}
          />
        </View>

        {/* Password Eye Toggle */}
        {isPassword && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={8}
            style={{ padding: 4 }}
          >
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={18}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </Pressable>

      {hasError ? (
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 12,
            color: colors.error,
            paddingHorizontal: 8,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
