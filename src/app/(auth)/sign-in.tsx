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
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, spacing } from "@/theme";
import { Button, StackedInputField, GoogleIcon, AppleIcon } from "@/components";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Mocked successful sign in -> navigates to app
      router.push("/design-system");
    }, 400);
  };

  const handleSocialAuth = () => {
    router.push("/design-system");
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

          {/* Stacked Form Fields */}
          <View style={{ gap: spacing.md }}>
            <StackedInputField
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Feather name="mail" size={20} color={colors.textPrimary} />}
            />

            <StackedInputField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
              icon={<Feather name="lock" size={20} color={colors.textPrimary} />}
            />

            <Pressable style={{ alignSelf: "flex-end" }} hitSlop={8}>
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
            loading={loading}
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
