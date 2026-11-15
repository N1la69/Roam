import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, spacing } from "@/theme";
import { Button } from "@/components";

export default function VerificationScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [countdown, setCountdown] = useState(45);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const canResend = countdown === 0;
  const inputRefs = useRef<(React.ComponentRef<typeof TextInput> | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleDigitChange = (value: string, index: number) => {
    setErrorMsg("");
    const newDigits = [...digits];

    // Handle paste or single char
    if (value.length > 1) {
      const chars = value.slice(0, 6).split("");
      chars.forEach((c, idx) => {
        if (idx < 6) newDigits[idx] = c;
      });
      setDigits(newDigits);
      const nextFocus = Math.min(chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: { nativeEvent: { key: string } },
    index: number
  ) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = digits.join("");
    if (code.length < 6) {
      setErrorMsg("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Mocked successful verification -> navigates to app
      router.push("/design-system");
    }, 600);
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(45);
    setDigits(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.sm,
            paddingBottom: spacing.xxl,
            gap: spacing.lg,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Navigation Bar */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: spacing.xs,
            }}
          >
            {/* Circular Back Button */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              hitSlop={12}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: 22,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Feather name="chevron-left" size={20} color={colors.textPrimary} />
            </Pressable>

            {/* Brand Wordmark */}
            <Text
              style={{
                fontFamily: fonts.extraBold,
                fontSize: 28,
                letterSpacing: -1.2,
                color: colors.textPrimary,
              }}
            >
              roam
            </Text>
          </View>

          {/* Title & Subtitle */}
          <View style={{ gap: spacing.xs + 2, marginTop: spacing.xs }}>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 36,
                lineHeight: 40,
                color: colors.textPrimary,
                letterSpacing: -0.8,
              }}
            >
              {"Verify your\naccount"}
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 15,
                lineHeight: 22,
                color: colors.textSecondary,
              }}
            >
              {`We sent a 6-digit verification code to `}
              <Text style={{ fontFamily: fonts.semiBold, color: colors.textPrimary }}>
                {email || "your email address"}
              </Text>
              {`. Enter it below to complete your registration.`}
            </Text>
          </View>

          {/* 6-Digit OTP Input Box Row */}
          <View style={{ marginVertical: spacing.sm }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              {digits.map((digit, idx) => {
                const isFocused = focusedIndex === idx;
                const isFilled = digit.length > 0;

                return (
                  <TextInput
                    key={idx}
                    ref={(el) => {
                      inputRefs.current[idx] = el;
                    }}
                    value={digit}
                    onChangeText={(val) => handleDigitChange(val, idx)}
                    onKeyPress={(e) => handleKeyPress(e, idx)}
                    onFocus={() => setFocusedIndex(idx)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    style={{
                      flex: 1,
                      height: 56,
                      borderRadius: 16,
                      borderCurve: "continuous",
                      backgroundColor: isFocused || isFilled ? colors.surface : colors.surfaceGray,
                      borderWidth: 1.5,
                      borderColor: isFocused ? colors.lavender : isFilled ? colors.border : "transparent",
                      textAlign: "center",
                      fontFamily: fonts.bold,
                      fontSize: 22,
                      color: colors.textPrimary,
                    }}
                  />
                );
              })}
            </View>

            {errorMsg ? (
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 13,
                  color: colors.error,
                  marginTop: spacing.sm,
                  textAlign: "center",
                }}
              >
                {errorMsg}
              </Text>
            ) : null}
          </View>

          {/* Resend Code Section */}
          <View style={{ alignItems: "center", gap: 4 }}>
            {canResend ? (
              <Pressable
                accessibilityRole="button"
                onPress={handleResend}
                hitSlop={8}
              >
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 14,
                    color: colors.textPrimary,
                    textDecorationLine: "underline",
                  }}
                >
                  Resend code
                </Text>
              </Pressable>
            ) : (
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  color: colors.textSecondary,
                }}
              >
                {`Resend code in ${formatTimer(countdown)}`}
              </Text>
            )}
          </View>

          {/* Primary Action Button */}
          <Button
            title="Verify and continue"
            showArrow
            onPress={handleVerify}
            loading={loading}
            size="lg"
            style={{ marginTop: spacing.xs }}
          />

          {/* Footer Back link */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              marginTop: spacing.xs,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                color: colors.textSecondary,
              }}
            >
              Wrong email address?
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              hitSlop={8}
            >
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 14,
                  color: colors.textPrimary,
                  textDecorationLine: "underline",
                }}
              >
                Change email
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
