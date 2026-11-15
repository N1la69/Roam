import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser, useClerk } from "@clerk/expo";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, radius, spacing, shadows } from "@/theme";
import {
  Button,
  InputField,
  FilterChip,
  ListingCard,
  Badge,
} from "@/components";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useClerk();

  const [signingOut, setSigningOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChip, setSelectedChip] = useState("All");

  const displayName =
    user?.firstName ||
    (user?.fullName ? user.fullName.split(" ")[0] : null) ||
    (user?.unsafeMetadata?.fullName as string | undefined)?.split(" ")[0] ||
    (user?.primaryEmailAddress?.emailAddress
      ? user.primaryEmailAddress.emailAddress.split("@")[0]
      : "Guest");

  const email = user?.primaryEmailAddress?.emailAddress || "";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xxl * 2,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: spacing.xs,
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: fonts.extraBold,
                fontSize: 30,
                letterSpacing: -1.2,
                color: colors.textPrimary,
              }}
            >
              roam
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 13,
                color: colors.textSecondary,
              }}
            >
              Find unforgettable stays
            </Text>
          </View>

          {/* Quick Sign Out Action */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Sign out"
            onPress={handleSignOut}
            disabled={signingOut}
            hitSlop={8}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: radius.full,
              backgroundColor: colors.surfaceGray,
              borderWidth: 1,
              borderColor: colors.border,
              opacity: pressed || signingOut ? 0.7 : 1,
            })}
          >
            <Feather name="log-out" size={16} color={colors.textSecondary} />
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 13,
                color: colors.textPrimary,
              }}
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </Text>
          </Pressable>
        </View>

        {/* User Welcome Card */}
        <View
          style={{
            backgroundColor: colors.surfaceGray,
            borderRadius: radius.xl,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
            gap: spacing.sm,
            boxShadow: shadows.sm,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 22,
                color: colors.textPrimary,
              }}
            >
              Hi, {displayName}!
            </Text>
            <Badge label="Authenticated" variant="new" />
          </View>

          {email ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
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
          ) : null}

          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 13,
              color: colors.textSecondary,
              lineHeight: 18,
              marginTop: 4,
            }}
          >
            Your session is secured with persistent keychain storage via Clerk.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={{ gap: spacing.xs }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 18,
              color: colors.textPrimary,
            }}
          >
            Describe your stay
          </Text>
          <InputField
            variant="search"
            placeholder="quiet pet friendly cabin with a hot tub..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Feather name="search" size={20} color={colors.textPrimary} />}
            rightIcon={<Feather name="sliders" size={18} color={colors.textPrimary} />}
          />
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm }}
        >
          {["All", "Cabins", "Under $300", "Pet Friendly", "Hot Tub", "Quiet"].map(
            (label) => (
              <FilterChip
                key={label}
                label={label}
                active={selectedChip === label}
                onPress={() => setSelectedChip(label)}
              />
            )
          )}
        </ScrollView>

        {/* Featured Stay Card */}
        <View style={{ gap: spacing.sm }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 18,
                color: colors.textPrimary,
              }}
            >
              Featured stay
            </Text>
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 13,
                color: colors.textSecondary,
              }}
            >
              Top recommendation
            </Text>
          </View>

          <ListingCard
            title="Modern Cabin with Hot Tub"
            location="Lake Arrowhead, CA"
            rating={4.9}
            reviewsCount={342}
            pricePerNight={280}
            amenities={["Hot Tub", "Pet Friendly"]}
            imageUrl="https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop"
          />
        </View>

        {/* Design System & Development Quick Links */}
        <View
          style={{
            marginTop: spacing.md,
            padding: spacing.md,
            backgroundColor: "#FFFFFF",
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
            gap: spacing.sm,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 15,
              color: colors.textPrimary,
            }}
          >
            Component Showcase
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 13,
              color: colors.textSecondary,
            }}
          >
            Preview all design tokens, inputs, alerts, chips, and policies in our design system.
          </Text>
          <Button
            title="Open Design System"
            variant="secondary"
            onPress={() => router.push("/design-system")}
            size="md"
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
    </SafeAreaView>
  );
}
