import { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "@/theme";
import { Button, GoogleIcon } from "@/components";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface OnboardingSlide {
  id: string;
  location: string;
  imageUrl: string;
  title: string;
  description: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: "1",
    location: "Whistler, BC",
    imageUrl:
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop",
    title: "Find a stay that\nfits your story",
    description:
      "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.",
  },
  {
    id: "2",
    location: "Amalfi Coast, Italy",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    title: "Curated for peace\nand seclusion",
    description:
      "Handpicked stays featuring hot tubs, private decks, and pet-friendly spaces designed for quiet moments.",
  },
  {
    id: "3",
    location: "Kyoto, Japan",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    title: "Clear policies,\nno surprises",
    description:
      "Ask booking, pet, or cancellation questions and get exact answers sourced directly from verified host rules.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index >= 0 && index < SLIDES.length && index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  const handleGetStarted = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
      setActiveIndex(activeIndex + 1);
    } else {
      router.push("/(auth)/sign-in");
    }
  };

  const handleSkip = () => {
    router.push("/(auth)/sign-in");
  };

  const handleGoogleAuth = () => {
    router.push("/(auth)/sign-in");
  };

  const currentSlide = SLIDES[activeIndex];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E5E7EB" }}>
      <StatusBar barStyle="dark-content" />

      {/* Outer Phone Mock Container */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Top Header Row with Logo and Skip */}
        <View
          style={{
            position: "absolute",
            top: 12,
            left: 0,
            right: 0,
            zIndex: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: spacing.lg,
          }}
        >
          {/* Brand Wordmark */}
          <Text
            style={{
              fontFamily: fonts.extraBold,
              fontSize: 34,
              color: colors.textPrimary,
              letterSpacing: -1.5,
            }}
          >
            roam
          </Text>

          {/* Skip Pill Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
            onPress={handleSkip}
            style={({ pressed }) => [
              {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: radius.full,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 14,
                color: colors.textPrimary,
              }}
            >
              Skip
            </Text>
          </Pressable>
        </View>

        {/* Swipeable Hero Carousel */}
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={{
                  width: SCREEN_WIDTH,
                  height: SCREEN_HEIGHT * 0.65,
                  position: "relative",
                  paddingTop: 8,
                }}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 32,
                  }}
                  resizeMode="cover"
                />

                {/* Floating Location Pill */}
                <View
                  style={{
                    position: "absolute",
                    bottom: 60,
                    left: spacing.lg + 4,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    backgroundColor: "rgba(0, 0, 0, 0.48)",
                    borderWidth: 1,
                    borderColor: "rgba(255, 255, 255, 0.25)",
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: radius.full,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <Ionicons name="location-sharp" size={15} color="#FFFFFF" />
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: 13,
                      color: "#FFFFFF",
                      letterSpacing: 0.2,
                    }}
                  >
                    {item.location}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>

        {/* Bottom Curved Sheet */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            borderCurve: "continuous",
            paddingHorizontal: spacing.lg + 4,
            paddingTop: spacing.lg,
            paddingBottom: spacing.xl + 4,
            gap: spacing.md + 2,
            boxShadow: "0 -8px 30px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Pagination Indicators */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 2,
            }}
          >
            {SLIDES.map((_, idx) => {
              const isActive = idx === activeIndex;
              return (
                <View
                  key={idx}
                  style={{
                    height: 4.5,
                    width: isActive ? 34 : 18,
                    borderRadius: radius.full,
                    backgroundColor: isActive ? colors.lavender : colors.border,
                  }}
                />
              );
            })}
          </View>

          {/* Heading */}
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 32,
              lineHeight: 38,
              color: colors.textPrimary,
              letterSpacing: -0.6,
            }}
          >
            {currentSlide.title}
          </Text>

          {/* Body Description */}
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 15,
              lineHeight: 22,
              color: colors.textSecondary,
              marginBottom: 4,
            }}
          >
            {currentSlide.description}
          </Text>

          {/* Action Buttons */}
          <View style={{ gap: spacing.sm + 4 }}>
            {/* Primary Action Button */}
            <Button
              title="Get started"
              showArrow
              onPress={handleGetStarted}
              size="lg"
            />

            {/* Secondary Action Button - Google */}
            <Button
              variant="secondary"
              title="Continue with Google"
              icon={<GoogleIcon size={19} />}
              onPress={handleGoogleAuth}
              size="lg"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
