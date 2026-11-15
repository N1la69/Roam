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

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: "/(auth)/verify",
        params: { email: email.trim() || "you@example.com" },
      });
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

          {/* Stacked Form Fields */}
          <View style={{ gap: spacing.md }}>
            <StackedInputField
              label="Full name"
              placeholder="e.g. Adrian Hajdin"
              value={fullName}
              onChangeText={setFullName}
              icon={<Feather name="user" size={20} color={colors.textPrimary} />}
            />

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
              placeholder="At least 8 characters"
              value={password}
              onChangeText={setPassword}
              isPassword
              icon={<Feather name="lock" size={20} color={colors.textPrimary} />}
            />
          </View>

          {/* Primary Action Button */}
          <Button
            title="Create account"
            showArrow
            onPress={handleSignUp}
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
