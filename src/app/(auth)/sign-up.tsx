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
import { useSignUp } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, spacing } from "@/theme";
import {
  Button,
  StackedInputField,
  GoogleIcon,
  AppleIcon,
  StatusAlert,
} from "@/components";

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isSubmitting = loading || fetchStatus === "fetching";

  const handleSignUp = async () => {
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setErrorMsg("Please enter your full name");
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMsg("Please enter your email address");
      return;
    }

    const trimmedPassword = password.trim();
    if (!trimmedPassword) {
      setErrorMsg("Please enter a password");
      return;
    }

    if (trimmedPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      // Split name into first and last name
      const names = trimmedName.split(/\s+/);
      const firstName = names[0];
      const lastName = names.slice(1).join(" ") || undefined;

      const createParams: {
        emailAddress: string;
        password: string;
        firstName: string;
        lastName?: string;
        unsafeMetadata?: Record<string, unknown>;
      } = {
        emailAddress: trimmedEmail,
        password: trimmedPassword,
        firstName,
        lastName,
        unsafeMetadata: {
          fullName: trimmedName,
        },
      };

      // Create sign up attempt
      const { error: createError } = await signUp.create(createParams);
      if (createError) {
        setLoading(false);
        const message =
          createError.longMessage ||
          createError.message ||
          "Failed to create account. Please check your details.";
        setErrorMsg(message);
        return;
      }

      // Send verification code
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      setLoading(false);

      if (sendError) {
        const message =
          sendError.longMessage ||
          sendError.message ||
          "Failed to send verification code. Please try again.";
        setErrorMsg(message);
        return;
      }

      // Navigate to verification screen
      router.push({
        pathname: "/(auth)/verify",
        params: { email: trimmedEmail, flow: "sign-up" },
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
      {/* Required for Clerk Bot Protection / Turnstile challenge */}
      <View nativeID="clerk-captcha" />
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
              {"Create\nyour account"}
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 15,
                lineHeight: 22,
                color: colors.textSecondary,
              }}
            >
              Join roam to save your stays, get personalized recommendations and access them across all your devices.
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
              label="Full name"
              placeholder="e.g. Adrian Hajdin"
              value={fullName}
              onChangeText={(text) => {
                setErrorMsg("");
                setFullName(text);
              }}
              icon={<Feather name="user" size={20} color={colors.textPrimary} />}
            />

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
              error={errors?.fields?.emailAddress?.message}
            />

            <StackedInputField
              label="Password"
              placeholder="At least 8 characters"
              value={password}
              onChangeText={(text) => {
                setErrorMsg("");
                setPassword(text);
              }}
              isPassword
              icon={<Feather name="lock" size={20} color={colors.textPrimary} />}
              error={errors?.fields?.password?.message}
            />
          </View>

          {/* Primary Action Button */}
          <Button
            title="Create account"
            showArrow
            onPress={handleSignUp}
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
              {"Already have an account?"}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(auth)/sign-in")}
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
                Sign in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
