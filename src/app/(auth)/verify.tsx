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
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import { useSignIn, useSignUp } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, spacing } from "@/theme";
import { posthog } from "@/lib/posthog";
import { Button, StatusAlert } from "@/components";

export default function VerificationScreen() {
  const router = useRouter();
  const { email, flow = "sign-up" } = useLocalSearchParams<{
    email?: string;
    flow?: "sign-in" | "sign-up";
  }>();

  const { signIn, fetchStatus: signInFetchStatus } = useSignIn();
  const { signUp, fetchStatus: signUpFetchStatus } = useSignUp();

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [countdown, setCountdown] = useState(45);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);

  const canResend = countdown === 0;
  const isFetching =
    loading ||
    signInFetchStatus === "fetching" ||
    signUpFetchStatus === "fetching";

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
    setResendSuccess(false);
    const newDigits = [...digits];

    // Handle paste or multi-character input
    if (value.length > 1) {
      const chars = value.replace(/\D/g, "").slice(0, 6).split("");
      chars.forEach((c, idx) => {
        if (idx < 6) newDigits[idx] = c;
      });
      setDigits(newDigits);
      const nextFocus = Math.min(chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    newDigits[index] = value.replace(/\D/g, "");
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

  const handleVerify = async () => {
    const code = digits.join("").trim();
    if (code.length < 6) {
      setErrorMsg("Please enter the complete 6-digit code");
      return;
    }

    setErrorMsg("");
    setResendSuccess(false);
    setLoading(true);

    try {
      if (flow === "sign-in") {
        const { error } = await signIn.emailCode.verifyCode({ code });

        if (error) {
          setLoading(false);
          const msg =
            error.longMessage ||
            error.message ||
            "Invalid verification code. Please try again.";
          setErrorMsg(msg);
          return;
        }

        if (signIn.status === "complete") {
          await signIn.finalize({
            navigate: ({ session }) => {
              if (session?.currentTask) return;
              router.replace("/(home)" as Href);
            },
          });
          posthog?.capture("sign_in_completed", { method: "email_code" });
        } else {
          setLoading(false);
          setErrorMsg(`Sign-in status: ${signIn.status}`);
        }
      } else {
        // Sign-up flow
        const { error } = await signUp.verifications.verifyEmailCode({ code });

        if (error) {
          setLoading(false);
          const msg =
            error.longMessage ||
            error.message ||
            "Invalid verification code. Please try again.";
          setErrorMsg(msg);
          return;
        }

        if (signUp.status === "complete") {
          await signUp.finalize({
            navigate: ({ session }) => {
              if (session?.currentTask) return;
              router.replace("/(home)" as Href);
            },
          });
          posthog?.capture("sign_up_completed", { method: "email_code" });
        } else {
          setLoading(false);
          setErrorMsg(`Sign-up status: ${signUp.status}`);
        }
      }
    } catch (err: unknown) {
      setLoading(false);
      const e = err as Error;
      setErrorMsg(e?.message || "Verification failed. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!canResend || isFetching) return;
    setErrorMsg("");
    setResendSuccess(false);
    setLoading(true);

    try {
      if (flow === "sign-in") {
        const { error } = await signIn.emailCode.sendCode();
        setLoading(false);
        if (error) {
          const msg = error.longMessage || error.message || "Failed to resend code";
          setErrorMsg(msg);
          return;
        }
      } else {
        const { error } = await signUp.verifications.sendEmailCode();
        setLoading(false);
        if (error) {
          const msg = error.longMessage || error.message || "Failed to resend code";
          setErrorMsg(msg);
          return;
        }
      }

      posthog?.capture("verification_code_resent", { flow });
      setResendSuccess(true);
      setCountdown(45);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      setLoading(false);
      const e = err as Error;
      setErrorMsg(e?.message || "Failed to resend code. Please try again.");
    }
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
              {"Enter confirmation\ncode"}
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 15,
                lineHeight: 22,
                color: colors.textSecondary,
              }}
            >
              {"A 6-digit code was sent to "}
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  color: colors.textPrimary,
                }}
              >
                {email || "your email"}
              </Text>
            </Text>
          </View>

          {/* Status Alerts */}
          {errorMsg ? (
            <StatusAlert
              type="error"
              message={errorMsg}
              onDismiss={() => setErrorMsg("")}
            />
          ) : null}

          {resendSuccess ? (
            <StatusAlert
              type="success"
              message="A new 6-digit code has been sent to your email."
              onDismiss={() => setResendSuccess(false)}
            />
          ) : null}

          {/* 6 Digit Input Boxes */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 8,
              marginVertical: spacing.sm,
            }}
          >
            {digits.map((digit, index) => {
              const isFocused = focusedIndex === index;
              const isFilled = digit.length > 0;

              return (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(val) => handleDigitChange(val, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => setFocusedIndex(index)}
                  keyboardType="number-pad"
                  maxLength={index === 0 ? 6 : 1}
                  selectTextOnFocus
                  style={{
                    flex: 1,
                    height: 58,
                    borderRadius: 16,
                    borderWidth: isFocused ? 2 : 1,
                    borderColor: isFocused
                      ? colors.lavender
                      : isFilled
                      ? colors.textPrimary
                      : colors.border,
                    backgroundColor: colors.surfaceGray,
                    textAlign: "center",
                    fontSize: 22,
                    fontFamily: fonts.bold,
                    color: colors.textPrimary,
                  }}
                />
              );
            })}
          </View>

          {/* Primary Action Button */}
          <Button
            title="Continue"
            showArrow
            onPress={handleVerify}
            loading={isFetching}
            disabled={isFetching || digits.join("").length < 6}
            size="lg"
          />

          {/* Resend Code Section */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 6,
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
              {"Didn't receive the code?"}
            </Text>
            {canResend ? (
              <Pressable
                accessibilityRole="button"
                onPress={handleResend}
                hitSlop={8}
                disabled={isFetching}
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
                  fontFamily: fonts.semiBold,
                  fontSize: 14,
                  color: colors.textSecondary,
                }}
              >
                Resend in {formatTimer(countdown)}
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
