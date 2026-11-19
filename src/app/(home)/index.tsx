import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Pressable,
  Image,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { useUser } from "@clerk/expo";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "@/theme";
import {
  CATEGORIES,
  PropertyCategory,
  PROPERTIES,
  filterProperties,
} from "@/data/properties";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>("All");
  const defaultPrompt = "quiet pet friendly cabin with hot tub";

  const displayName =
    user?.firstName ||
    (user?.fullName ? user.fullName.split(" ")[0] : null) ||
    (user?.unsafeMetadata?.fullName as string | undefined)?.split(" ")[0] ||
    "Joanna";

  const userAvatar =
    user?.imageUrl ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";

  const filteredStays = filterProperties("", selectedCategory);
  const featuredStay = filteredStays[0] || PROPERTIES[0];
  const secondaryStays = filteredStays.slice(1);

  const handleSearchNavigation = (queryText: string) => {
    router.push({
      pathname: "/(home)/search" as any,
      params: { q: queryText, category: selectedCategory },
    });
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
        {/* Top Header Bar (Below Status Bar & Dynamic Island) */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: spacing.xs,
          }}
        >
          {/* Brand Wordmark */}
          <Text
            style={{
              fontFamily: fonts.extraBold,
              fontSize: 32,
              letterSpacing: -1.2,
              color: colors.textPrimary,
            }}
          >
            roam
          </Text>

          {/* User Profile Avatar with Yellow Glow Ring */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            onPress={() => router.push("/(home)/profile" as Href)}
            style={({ pressed }) => ({
              width: 50,
              height: 50,
              borderRadius: 25,
              padding: 2.5,
              backgroundColor: colors.primary,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Image
              source={{ uri: userAvatar }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 25,
                backgroundColor: colors.surfaceGray,
              }}
            />
          </Pressable>
        </View>

        {/* Greeting & Headline Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <View style={{ gap: 4 }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 16,
                color: colors.textSecondary,
              }}
            >
              Hey, {displayName} 👋
            </Text>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 36,
                lineHeight: 40,
                color: colors.textPrimary,
                letterSpacing: -1,
              }}
            >
              {"Find your\nnext stay"}
            </Text>
          </View>

          {/* Search Icon Action Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search stays"
            onPress={() => handleSearchNavigation("")}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: colors.surfaceGray,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.75 : 1,
            })}
          >
            <Feather name="search" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Stay Prompt / AI Search Bar Pill */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search prompt"
          onPress={() => handleSearchNavigation(defaultPrompt)}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: colors.lavender,
            borderRadius: radius.full,
            paddingLeft: 18,
            paddingRight: 8,
            height: 56,
            borderWidth: 1,
            borderColor: "rgba(195, 175, 255, 0.4)",
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              gap: 10,
              marginRight: 8,
            }}
          >
            <Ionicons name="sparkles" size={18} color="#0B0B1A" />
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.medium,
                fontSize: 14.5,
                color: "#0B0B1A",
                flex: 1,
              }}
            >
              {defaultPrompt}
            </Text>
          </View>

          {/* Circular Arrow Up-Right Button */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.08,
              shadowRadius: 2,
            }}
          >
            <Feather name="arrow-up-right" size={20} color="#0B0B1A" />
          </View>
        </Pressable>

        {/* Category Pills (Row 1 & Row 2 Matching Design) */}
        <View style={{ gap: spacing.sm }}>
          {/* Row 1: All Stays, Cabins, Beach */}
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            {CATEGORIES.slice(0, 3).map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: radius.full,
                    backgroundColor: isActive ? colors.primary : colors.surfaceGray,
                    borderWidth: 1,
                    borderColor: isActive ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  {cat.id === "All" && (
                    <Ionicons
                      name="home"
                      size={16}
                      color={isActive ? colors.textPrimary : colors.textSecondary}
                    />
                  )}
                  {cat.id === "Cabins" && (
                    <MaterialIcons
                      name="cabin"
                      size={17}
                      color={isActive ? colors.textPrimary : colors.textSecondary}
                    />
                  )}
                  {cat.id === "Beach" && (
                    <MaterialIcons
                      name="beach-access"
                      size={16}
                      color={isActive ? colors.textPrimary : colors.textSecondary}
                    />
                  )}
                  <Text
                    style={{
                      fontFamily: isActive ? fonts.bold : fonts.semiBold,
                      fontSize: 14,
                      color: colors.textPrimary,
                    }}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Row 2: City, Villas */}
          <View style={{ flexDirection: "row", gap: spacing.sm }}>
            {CATEGORIES.slice(3, 5).map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: radius.full,
                    backgroundColor: isActive ? colors.primary : colors.surfaceGray,
                    borderWidth: 1,
                    borderColor: isActive ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  {cat.id === "City" && (
                    <MaterialIcons
                      name="location-city"
                      size={16}
                      color={isActive ? colors.textPrimary : colors.textSecondary}
                    />
                  )}
                  {cat.id === "Villas" && (
                    <MaterialIcons
                      name="villa"
                      size={16}
                      color={isActive ? colors.textPrimary : colors.textSecondary}
                    />
                  )}
                  <Text
                    style={{
                      fontFamily: isActive ? fonts.bold : fonts.semiBold,
                      fontSize: 14,
                      color: colors.textPrimary,
                    }}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Featured Stay Hero Card (Matching Design Screenshot Exactly) */}
        {featuredStay && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ${featuredStay.title}`}
            onPress={() => handleSearchNavigation(featuredStay.title)}
            style={({ pressed }) => ({
              width: "100%",
              height: 380,
              borderRadius: 28,
              overflow: "hidden",
              position: "relative",
              backgroundColor: colors.surfaceGray,
              transform: [{ scale: pressed ? 0.985 : 1 }],
            })}
          >
            {/* Background Image */}
            <Image
              source={{ uri: featuredStay.imageUrl }}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
              }}
              resizeMode="cover"
            />

            {/* Gradient Scrim Backdrop */}
            <View
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "60%",
                backgroundColor: "rgba(0, 0, 0, 0.45)",
              }}
            />

            {/* Top-Right Rating Badge */}
            <View
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: "#FFFFFF",
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: radius.full,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.12,
                shadowRadius: 4,
              }}
            >
              <Ionicons name="star" size={15} color="#0B0B1A" />
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 14,
                  color: colors.textPrimary,
                }}
              >
                {featuredStay.rating}
              </Text>
            </View>

            {/* Bottom Card Content */}
            <View
              style={{
                position: "absolute",
                bottom: 22,
                left: 20,
                right: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              {/* Location & Title */}
              <View style={{ flex: 1, gap: 4, marginRight: 12 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="location-sharp" size={14} color="#FFFFFF" />
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: 13,
                      color: "#FFFFFF",
                      textShadowColor: "rgba(0,0,0,0.5)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    }}
                  >
                    {featuredStay.location}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 26,
                    lineHeight: 30,
                    color: "#FFFFFF",
                    letterSpacing: -0.5,
                    textShadowColor: "rgba(0,0,0,0.6)",
                    textShadowOffset: { width: 0, height: 1 },
                    textShadowRadius: 3,
                  }}
                >
                  {featuredStay.title}
                </Text>
              </View>

              {/* Circular Action Button */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#FFFFFF",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                }}
              >
                <Feather name="chevron-right" size={24} color="#000000" />
              </View>
            </View>
          </Pressable>
        )}

        {/* Secondary Stays (Scrollable Feed) */}
        {secondaryStays.map((stay, idx) => (
          <Animated.View
            key={stay.id}
            entering={FadeInDown.duration(300).delay(idx * 60)}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`View ${stay.title}`}
              onPress={() => handleSearchNavigation(stay.title)}
              style={({ pressed }) => ({
                width: "100%",
                height: 240,
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
                backgroundColor: colors.surfaceGray,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              })}
            >
              <Image
                source={{ uri: stay.imageUrl }}
                style={{ width: "100%", height: "100%", position: "absolute" }}
                resizeMode="cover"
              />
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "55%",
                  backgroundColor: "rgba(0, 0, 0, 0.45)",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 14,
                  right: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: "#FFFFFF",
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  borderRadius: radius.full,
                }}
              >
                <Ionicons name="star" size={13} color="#0B0B1A" />
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 13,
                    color: colors.textPrimary,
                  }}
                >
                  {stay.rating}
                </Text>
              </View>
              <View
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: 12,
                      color: "#FFFFFF",
                    }}
                  >
                    📍 {stay.location}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: 20,
                      color: "#FFFFFF",
                    }}
                  >
                    {stay.title}
                  </Text>
                </View>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 15,
                    color: "#FFFFFF",
                  }}
                >
                  ${stay.pricePerNight}{" "}
                  <Text style={{ fontFamily: fonts.regular, fontSize: 12 }}>/ night</Text>
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}
