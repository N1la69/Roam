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
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { colors, fonts, spacing } from "@/theme";
import { Button, InputField, ThemedText } from "@/components";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // In a real app this verifies with Clerk; for now navigate back to index or design system
      router.push("/design-system");
    }, 800);
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
            paddingTop: spacing.md,
            paddingBottom: spacing.xxl,
            gap: spacing.lg,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header navigation bar */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={() => router.back()}
              hitSlop={12}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.surfaceGray,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Feather name="arrow-left" size={20} color={colors.textPrimary} />
            </Pressable>

            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 26,
                letterSpacing: -1,
                color: colors.textPrimary,
              }}
            >
              roam
            </Text>

            <View style={{ width: 40 }} />
          </View>

          {/* Heading */}
          <View style={{ gap: spacing.xs, marginTop: spacing.sm }}>
            <ThemedText
              variant="heading"
              style={{ fontSize: 30, lineHeight: 36, color: colors.textPrimary }}
            >
              Welcome back
            </ThemedText>
            <ThemedText
              variant="body"
              style={{ color: colors.textSecondary, fontSize: 15 }}
            >
              Sign in to manage your saved stays, bookings, and policies.
            </ThemedText>
          </View>

          {/* Google SSO Button */}
          <Button
            variant="secondary"
            title="Continue with Google"
            icon={<FontAwesome5 name="google" size={17} color="#EA4335" />}
            onPress={() => router.push("/design-system")}
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
            <ThemedText variant="footnote" style={{ color: colors.textMuted }}>
              or with email
            </ThemedText>
            <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          </View>

          {/* Form Fields */}
          <View style={{ gap: spacing.md }}>
            <InputField
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={
                <Feather name="mail" size={18} color={colors.textSecondary} />
              }
            />

            <InputField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              isPassword
              leftIcon={
                <Feather name="lock" size={18} color={colors.textSecondary} />
              }
            />

            <Pressable style={{ alignSelf: "flex-end" }} hitSlop={8}>
              <ThemedText
                variant="footnote"
                style={{ color: colors.textPrimary, fontWeight: "600" }}
              >
                Forgot password?
              </ThemedText>
            </Pressable>
          </View>

          {/* Primary Action Button */}
          <Button
            title="Sign in"
            onPress={handleSignIn}
            loading={loading}
            size="lg"
          />

          {/* Bottom Switcher */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              marginTop: spacing.md,
            }}
          >
            <ThemedText
              variant="caption"
              style={{ color: colors.textSecondary }}
            >
              {"Don't have an account?"}
            </ThemedText>
            <Pressable
              onPress={() => router.push("/(auth)/sign-up")}
              hitSlop={8}
            >
              <ThemedText
                variant="caption"
                style={{
                  color: colors.textPrimary,
                  fontWeight: "700",
                  textDecorationLine: "underline",
                }}
              >
                Sign up
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
