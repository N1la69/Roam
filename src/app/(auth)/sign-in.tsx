import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { useSignIn } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, spacing } from "@/theme";
import { posthog } from "@/lib/posthog";
import {
  Button,
  StackedInputField,
  GoogleIcon,
  AppleIcon,
  StatusAlert,
} from "@/components";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isSubmitting = loading || fetchStatus === "fetching";

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg("Please enter your email address");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      // If user provided a password, try email + password first
      if (password.trim()) {
        const { error: passError } = await signIn.password({
          emailAddress: trimmedEmail,
          password: password.trim(),
        });

        if (!passError && signIn.status === "complete") {
          await signIn.finalize({
            navigate: ({ session }) => {
              if (session?.currentTask) return;
              router.replace("/(home)" as Href);
            },
          });
          posthog?.capture("sign_in_completed", { method: "password" });
          setLoading(false);
          return;
        }

        // If password was rejected with an error, display it
        if (passError) {
          setLoading(false);
          const msg =
            passError.longMessage ||
            passError.message ||
            "Incorrect email or password";
          setErrorMsg(msg);
          return;
        }
      }

      // Default strategy: Email OTP verification code
      const { error: codeError } = await signIn.emailCode.sendCode({
        emailAddress: trimmedEmail,
      });

      setLoading(false);

      if (codeError) {
        const msg =
          codeError.longMessage ||
          codeError.message ||
          "Could not send sign-in code. Please try again.";
        setErrorMsg(msg);
        return;
      }

      // Route to verify screen
      router.push({
        pathname: "/(auth)/verify",
        params: { email: trimmedEmail, flow: "sign-in" },
      });
    } catch (err: unknown) {
      setLoading(false);
      const e = err as Error;
      setErrorMsg(e?.message || "An unexpected error occurred. Please try again.");
    }
  };

  const handleSocialAuth = () => {
    router.push("/(home)" as Href);
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
              {"Welcome\nback"}
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 15,
                lineHeight: 22,
                color: colors.textSecondary,
              }}
            >
              Sign in to save your stays, get personalized recommendations and access them across all your devices.
            </Text>
          </View>

          {/* Status Alert for Errors */}
          {errorMsg ? (
            <StatusAlert
              type="error"
              message={errorMsg}
              onDismiss={() => setErrorMsg("")}
            />
          ) : null}

          {/* Stacked Form Fields */}
          <View style={{ gap: spacing.md }}>
            <StackedInputField
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setErrorMsg("");
                setEmail(text);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Feather name="mail" size={20} color={colors.textPrimary} />}
              error={errors?.fields?.identifier?.message}
            />

            <StackedInputField
              label="Password (optional for email code)"
              placeholder="Enter your password or leave blank for OTP"
              value={password}
              onChangeText={(text) => {
                setErrorMsg("");
                setPassword(text);
              }}
              isPassword
              icon={<Feather name="lock" size={20} color={colors.textPrimary} />}
              error={errors?.fields?.password?.message}
            />

            <Pressable
              style={{ alignSelf: "flex-end" }}
              hitSlop={8}
              onPress={async () => {
                if (!email.trim()) {
                  setErrorMsg("Enter your email address to reset password");
                  return;
                }
                const { error } = await signIn.resetPasswordEmailCode.sendCode();
                if (error) {
                  setErrorMsg(error.longMessage || error.message);
                } else {
                  router.push({
                    pathname: "/(auth)/verify",
                    params: { email: email.trim(), flow: "sign-in" },
                  });
                }
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 13,
                  color: colors.textPrimary,
                }}
              >
                Forgot password?
              </Text>
            </Pressable>
          </View>

          {/* Primary Action Button */}
          <Button
            title="Sign in"
            showArrow
            onPress={handleSignIn}
            loading={isSubmitting}
            disabled={isSubmitting}
            size="lg"
          />

          {/* Divider */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
              marginVertical: spacing.xs,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                color: colors.textSecondary,
              }}
            >
              or
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>

          {/* Social Auth Buttons */}
          <View style={{ gap: spacing.md }}>
            <Button
              variant="secondary"
              title="Continue with Google"
              icon={<GoogleIcon size={19} />}
              onPress={handleSocialAuth}
              size="lg"
            />

            <Button
              variant="secondary"
              title="Continue with Apple"
              icon={<AppleIcon size={20} />}
              onPress={handleSocialAuth}
              size="lg"
            />
          </View>

          {/* Footer Switcher */}
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
              {"Don't have an account?"}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(auth)/sign-up")}
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
                Sign up
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
