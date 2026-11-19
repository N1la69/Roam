import { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { useUser, useClerk } from "@clerk/expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "@/theme";
import { Button, ProfileRow, Badge } from "@/components";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();
  const insets = useSafeAreaInsets();
  const [signingOut, setSigningOut] = useState(false);

  const displayName =
    user?.firstName ||
    (user?.fullName ? user.fullName : null) ||
    (user?.unsafeMetadata?.fullName as string | undefined) ||
    "Joanna Smith";

  const email = user?.primaryEmailAddress?.emailAddress || "joanna@example.com";

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut();
      router.replace("/(auth)/sign-in");
    } catch {
      setSigningOut(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: Math.max(insets.top, 16),
      }}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xs,
          paddingBottom: insets.bottom + 100,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View
          style={{
            alignItems: "center",
            paddingVertical: spacing.md,
            gap: spacing.sm,
          }}
        >
          <View
            style={{
              width: 90,
              height: 90,
              borderRadius: radius.full,
              padding: 3,
              backgroundColor: colors.primary,
            }}
          >
            <Image
              source={{
                uri:
                  user?.imageUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
              }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: radius.full,
                backgroundColor: colors.surfaceGray,
              }}
            />
          </View>

          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 22,
              color: colors.textPrimary,
            }}
          >
            {displayName}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Feather name="mail" size={14} color={colors.textSecondary} />
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                color: colors.textSecondary,
              }}
            >
              {email}
            </Text>
          </View>

          <Badge label="Verified Guest" variant="guestFavorite" />
        </View>

        {/* Profile Settings Rows */}
        <View style={{ gap: spacing.sm }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 16,
              color: colors.textPrimary,
              paddingHorizontal: spacing.xs,
            }}
          >
            Account settings
          </Text>

          <ProfileRow
            label="Personal info"
            icon={<Feather name="user" size={20} color={colors.textPrimary} />}
          />
          <ProfileRow
            label="Payment methods"
            icon={<Feather name="credit-card" size={20} color={colors.textPrimary} />}
          />
          <ProfileRow
            label="Trips & bookings"
            icon={<Feather name="briefcase" size={20} color={colors.textPrimary} />}
            onPress={() => router.push("/(home)/trips" as Href)}
          />
          <ProfileRow
            label="Design system"
            icon={<Feather name="layers" size={20} color={colors.textPrimary} />}
            onPress={() => router.push("/design-system")}
          />
        </View>

        {/* Sign Out Button */}
        <Button
          title="Sign out"
          variant="secondary"
          onPress={handleSignOut}
          loading={signingOut}
          disabled={signingOut}
          size="lg"
        />
      </ScrollView>
    </View>
  );
}
