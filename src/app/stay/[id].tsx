import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Share,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  Feather,
  Ionicons,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { colors, fonts, radius } from "@/theme";
import { sanityFetch, SanityPropertyDetail } from "@/lib/sanity";
import { PROPERTIES } from "@/data/properties";
import { posthog } from "@/lib/posthog";
import { PolicyModal } from "@/components";

export default function StayDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [stay, setStay] = useState<SanityPropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Policy Modal state
  const [policyModalVisible, setPolicyModalVisible] = useState(false);
  const [selectedPolicyType, setSelectedPolicyType] = useState<string>("house_rules");

  // Booking notice state
  const [showBookingNotice, setShowBookingNotice] = useState(false);

  // Load live property details from Sanity
  const loadStay = useCallback((propertyId: string) => {
    let isCancelled = false;

    const groqQuery = `
      *[_type == "property" && _id == $id][0] {
        _id,
        title,
        tagline,
        category,
        pricePerNight,
        cleaningFee,
        rating,
        reviewsCount,
        isFeatured,
        maxGuests,
        bedrooms,
        beds,
        baths,
        petFriendly,
        amenities,
        location,
        description,
        neighborhoodOverview,
        tags,
        checkInTime,
        checkOutTime,
        imageUrl,
        galleryUrls,
        staySpecificRules,
        host-> {
          name,
          avatarUrl,
          bio,
          isSuperhost,
          rating,
          reviewsCount,
          responseRate,
          responseTime,
          joinedDate
        },
        policies[]-> {
          _id,
          title,
          policyType,
          summary,
          content,
          icon
        }
      }
    `;

    sanityFetch<SanityPropertyDetail | null>(groqQuery, { id: propertyId })
      .then((result) => {
        if (isCancelled) return;
        if (result) {
          setStay(result);
          setLoading(false);
          posthog?.capture("stay_opened", {
            stay_id: result._id,
            title: result.title,
            category: result.category,
            price_per_night: result.pricePerNight,
            location: result.location?.displayAddress || "",
          });
        } else {
          // Fallback to local properties if not found by _id in Sanity
          const fallback = PROPERTIES.find((p) => p.id === propertyId);
          if (fallback) {
            const [city, state] = fallback.location.split(",").map((s) => s.trim());
            const fallbackDetail: SanityPropertyDetail = {
              _id: fallback.id,
              title: fallback.title,
              category: fallback.category,
              pricePerNight: fallback.pricePerNight,
              rating: fallback.rating,
              reviewsCount: fallback.reviewsCount,
              imageUrl: fallback.imageUrl,
              amenities: fallback.amenities,
              description: fallback.description,
              tags: fallback.tags,
              maxGuests: 4,
              bedrooms: 2,
              beds: 2,
              baths: 2,
              petFriendly: fallback.tags.includes("pet friendly"),
              location: {
                city: city || fallback.location,
                stateOrProvince: state || "",
                country: "USA",
                displayAddress: fallback.location,
              },
              host: {
                name: "Alex",
                avatarUrl:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
                isSuperhost: true,
                rating: 4.95,
                reviewsCount: 280,
              },
              policies: [
                {
                  _id: "pol-canc",
                  title: "Free cancellation",
                  policyType: "cancellation",
                  summary: "Full refund up to 7 days before check-in.",
                  content:
                    "Cancel up to 7 days before check-in for a full 100% refund. Cancellations made within 7 days receive a 50% refund minus the first night.",
                },
                {
                  _id: "pol-house",
                  title: "Standard House Rules",
                  policyType: "house_rules",
                  summary: "Quiet hours 10 PM - 8 AM. No smoking or unauthorized parties.",
                  content:
                    "Quiet hours are strictly enforced between 10:00 PM and 8:00 AM. Parties and events are not permitted. Please treat the home with care.",
                },
              ],
              staySpecificRules: [
                "Please remove outdoor shoes in the foyer",
                "Quiet hours begin strictly at 10 PM",
              ],
            };
            setStay(fallbackDetail);
            setLoading(false);
            posthog?.capture("stay_opened", {
              stay_id: fallbackDetail._id,
              title: fallbackDetail.title,
              category: fallbackDetail.category,
              price_per_night: fallbackDetail.pricePerNight,
              location: fallbackDetail.location?.displayAddress || "",
            });
          } else {
            setError("Stay not found.");
            setLoading(false);
          }
        }
      })
      .catch((err: unknown) => {
        if (isCancelled) return;
        console.error("Failed to load stay:", err);
        const fallback = PROPERTIES.find((p) => p.id === propertyId);
        if (fallback) {
          const [city, state] = fallback.location.split(",").map((s) => s.trim());
          setStay({
            _id: fallback.id,
            title: fallback.title,
            category: fallback.category,
            pricePerNight: fallback.pricePerNight,
            rating: fallback.rating,
            reviewsCount: fallback.reviewsCount,
            imageUrl: fallback.imageUrl,
            amenities: fallback.amenities,
            description: fallback.description,
            tags: fallback.tags,
            maxGuests: 4,
            bedrooms: 2,
            beds: 2,
            baths: 2,
            petFriendly: fallback.tags.includes("pet friendly"),
            location: {
              city: city || fallback.location,
              stateOrProvince: state || "",
              country: "USA",
              displayAddress: fallback.location,
            },
            host: {
              name: "Alex",
              avatarUrl:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
              isSuperhost: true,
              rating: 4.95,
              reviewsCount: 280,
            },
            policies: [
              {
                _id: "pol-canc",
                title: "Free cancellation",
                policyType: "cancellation",
                summary: "Full refund up to 7 days before check-in.",
                content:
                  "Cancel up to 7 days before check-in for a full 100% refund. Cancellations made within 7 days receive a 50% refund minus the first night.",
              },
            ],
          });
          setLoading(false);
        } else {
          setError("Unable to load stay details. Please check your connection.");
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    const cancel = loadStay(id);
    return cancel;
  }, [id, loadStay]);

  // Find cancellation policy
  const cancellationPolicy = useMemo(() => {
    return stay?.policies?.find((p) => p.policyType === "cancellation");
  }, [stay?.policies]);

  const handleShare = async () => {
    if (!stay) return;
    try {
      await Share.share({
        title: stay.title,
        message: `Check out ${stay.title} in ${stay.location?.displayAddress || "Roam"}!`,
        url: stay.imageUrl,
      });
    } catch {}
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => {
      const next = !prev;
      posthog?.capture(next ? "property_saved" : "property_unsaved", {
        stay_id: stay?._id || (id as string) || "",
      });
      return next;
    });
  };

  const openPolicies = (type: string) => {
    setSelectedPolicyType(type);
    setPolicyModalVisible(true);
    posthog?.capture("stay_policy_viewed", {
      stay_id: stay?._id || (id as string) || "",
      policy_type: type,
    });
  };

  const handleBookPress = () => {
    posthog?.capture("booking_attempted", {
      stay_id: stay?._id || (id as string) || "",
      price_per_night: stay?.pricePerNight || 0,
    });
    setShowBookingNotice(true);
    setTimeout(() => {
      setShowBookingNotice(false);
    }, 3500);
  };

  // Estimated 3 nights total
  const estimatedTotal = useMemo(() => {
    if (!stay) return 0;
    const nights = 3;
    const cleaning = stay.cleaningFee || 0;
    return stay.pricePerNight * nights + cleaning;
  }, [stay]);

  const totalPhotos = (stay?.galleryUrls?.length || 0) + 1;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 12,
          }}
        >
          Loading stay details...
        </Text>
      </View>
    );
  }

  if (error || !stay) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 24,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.surfaceGray,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="alert-triangle" size={28} color={colors.warning} />
        </View>
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: 18,
            color: colors.textPrimary,
            textAlign: "center",
          }}
        >
          {error || "Stay not found"}
        </Text>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: radius.full,
              backgroundColor: colors.surfaceGray,
            }}
          >
            <Text style={{ fontFamily: fonts.semiBold, color: colors.textPrimary }}>
              Go back
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (id) {
                setLoading(true);
                setError(null);
                loadStay(id);
              }
            }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: radius.full,
              backgroundColor: colors.primary,
            }}
          >
            <Text style={{ fontFamily: fonts.bold, color: colors.textPrimary }}>
              Retry
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar barStyle="light-content" />

      {/* Booking Notice Toast */}
      {showBookingNotice && (
        <Animated.View
          entering={FadeInDown.duration(200)}
          style={{
            position: "absolute",
            top: insets.top + 60,
            left: 20,
            right: 20,
            zIndex: 999,
            backgroundColor: "#0B0B1A",
            borderRadius: 16,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="sparkles" size={16} color="#0B0B1A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 14,
                color: "#FFFFFF",
              }}
            >
              Booking coming soon!
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 12.5,
                color: "#D1D5DB",
              }}
            >
              Direct reservations will be available in the next release.
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Floating Top Controls (Fixed Above Scroll) */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 8,
          left: 16,
          right: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 50,
        }}
      >
        {/* Back Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Feather name="chevron-left" size={24} color="#0B0B1A" />
        </Pressable>

        {/* Right Action Buttons */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          {/* Share Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share stay"
            onPress={handleShare}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Feather name="share" size={20} color="#0B0B1A" />
          </Pressable>

          {/* Favorite Heart Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? "Remove favorite" : "Add to favorites"}
            onPress={toggleFavorite}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "#EF4444" : "#0B0B1A"}
            />
          </Pressable>
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      >
        {/* Full-Bleed Hero Image */}
        <View style={{ width: "100%", height: 380, position: "relative" }}>
          <Image
            source={{ uri: stay.imageUrl }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          {/* Top Scrim Gradient Shadow */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: insets.top + 70,
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          />

          {/* Photo Counter Pill Badge */}
          <View
            style={{
              position: "absolute",
              bottom: 40,
              right: 20,
              backgroundColor: "rgba(11, 11, 26, 0.7)",
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 14,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 12.5,
                color: "#FFFFFF",
              }}
            >
              1 / {totalPhotos > 1 ? totalPhotos : 24}
            </Text>
          </View>
        </View>

        {/* Floating Rounded White Card Container */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            marginTop: -26,
            paddingHorizontal: 20,
            paddingTop: 24,
            gap: 20,
          }}
        >
          {/* Header Row: Title & Star Rating */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            {/* Title */}
            <View style={{ flex: 1, gap: 4 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 27,
                  lineHeight: 33,
                  letterSpacing: -0.6,
                  color: "#0B0B1A",
                }}
              >
                {stay.title}
              </Text>
            </View>

            {/* Rating Box */}
            <View
              style={{
                backgroundColor: "#F9FAFB",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 18,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#F3F4F6",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <FontAwesome name="star" size={15} color="#F59E0B" />
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 17,
                    color: "#0B0B1A",
                  }}
                >
                  {stay.rating ? stay.rating.toFixed(1) : "4.9"}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  color: "#6B7280",
                  marginTop: 2,
                }}
              >
                ({stay.reviewsCount || 342})
              </Text>
            </View>
          </View>

          {/* Location Pin & Name */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginTop: -6,
            }}
          >
            <Ionicons name="location-sharp" size={17} color="#0B0B1A" />
            <Text
              style={{
                fontFamily: fonts.semiBold,
                fontSize: 15,
                color: "#0B0B1A",
              }}
            >
              {stay.location?.displayAddress || "Lake Arrowhead, CA"}
            </Text>
          </View>

          {/* Amenity Icons Row (Matching Reference) */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 14,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#F3F4F6",
            }}
          >
            {/* Hot Tub */}
            <View style={{ alignItems: "center", gap: 6, flex: 1 }}>
              <MaterialIcons name="hot-tub" size={26} color="#0B0B1A" />
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 12,
                  color: "#0B0B1A",
                  textAlign: "center",
                }}
              >
                Hot Tub
              </Text>
            </View>

            {/* Pet Friendly */}
            <View style={{ alignItems: "center", gap: 6, flex: 1 }}>
              <Ionicons name="paw" size={24} color="#0B0B1A" />
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 12,
                  color: "#0B0B1A",
                  textAlign: "center",
                }}
              >
                Pet Friendly
              </Text>
            </View>

            {/* Fast Wi-Fi */}
            <View style={{ alignItems: "center", gap: 6, flex: 1 }}>
              <Feather name="wifi" size={24} color="#0B0B1A" />
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 12,
                  color: "#0B0B1A",
                  textAlign: "center",
                }}
              >
                Fast Wi-Fi
              </Text>
            </View>

            {/* Forest Views */}
            <View style={{ alignItems: "center", gap: 6, flex: 1 }}>
              <MaterialIcons name="terrain" size={26} color="#0B0B1A" />
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 12,
                  color: "#0B0B1A",
                  textAlign: "center",
                }}
              >
                Forest Views
              </Text>
            </View>
          </View>

          {/* Interactive Action Card 1: "Ask about policies" */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ask about policies"
            onPress={() => openPolicies("house_rules")}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F2EBFF",
              borderRadius: 22,
              padding: 16,
              gap: 14,
              borderWidth: 1,
              borderColor: "rgba(201, 180, 255, 0.45)",
              opacity: pressed ? 0.82 : 1,
            })}
          >
            {/* Lavender Speech Bubble Icon Box */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: "#E2D3FF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={22}
                color="#4338CA"
              />
            </View>

            {/* Text Details */}
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 16,
                  color: "#0B0B1A",
                }}
              >
                Ask about policies
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 13,
                  color: "#6B7280",
                  lineHeight: 18,
                }}
              >
                Cancellation, house rules, pets, check-in and more.
              </Text>
            </View>

            {/* Chevron Right */}
            <Feather name="chevron-right" size={20} color="#4338CA" />
          </Pressable>

          {/* Interactive Action Card 2: "Free cancellation" */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancellation details"
            onPress={() => openPolicies("cancellation")}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F2EBFF",
              borderRadius: 22,
              padding: 16,
              gap: 14,
              borderWidth: 1,
              borderColor: "rgba(201, 180, 255, 0.45)",
              opacity: pressed ? 0.82 : 1,
            })}
          >
            {/* Lavender Document Icon Box */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: "#E2D3FF",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="file-text" size={20} color="#4338CA" />
            </View>

            {/* Text Details */}
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 16,
                  color: "#0B0B1A",
                }}
              >
                {cancellationPolicy?.title || "Free cancellation"}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 13,
                  color: "#6B7280",
                  lineHeight: 18,
                }}
              >
                {cancellationPolicy?.summary ||
                  "Full refund up to 7 days before check-in."}
              </Text>
            </View>

            {/* Chevron Right */}
            <Feather name="chevron-right" size={20} color="#4338CA" />
          </Pressable>

          {/* Host Row Card */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              gap: 14,
            }}
          >
            {/* Host Avatar */}
            <Image
              source={{
                uri:
                  stay.host?.avatarUrl ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
              }}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: "#F3F4F6",
              }}
            />

            {/* Host Info */}
            <View style={{ flex: 1, gap: 3 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 16.5,
                  color: "#0B0B1A",
                }}
              >
                Hosted by {stay.host?.name || "Alex"}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <MaterialIcons name="workspace-premium" size={17} color="#EA580C" />
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: 13.5,
                    color: "#6B7280",
                  }}
                >
                  {stay.host?.isSuperhost !== false ? "Superhost" : "Host"}
                </Text>
              </View>
            </View>

            {/* Chevron Right */}
            <Feather name="chevron-right" size={20} color="#0B0B1A" />
          </View>

          {/* Description Section */}
          <View style={{ gap: 8, marginTop: 4 }}>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 18,
                color: "#0B0B1A",
              }}
            >
              About this stay
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 14.5,
                lineHeight: 22,
                color: "#4B5563",
              }}
            >
              {stay.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Booking Bar */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6",
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 16),
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.06)",
        }}
      >
        {/* Price Column */}
        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 3 }}>
            <Text
              style={{
                fontFamily: fonts.extraBold,
                fontSize: 22,
                color: "#0B0B1A",
              }}
            >
              ${stay.pricePerNight}
            </Text>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              / night
            </Text>
          </View>

          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 13,
              color: "#9CA3AF",
            }}
          >
            ${estimatedTotal} total
          </Text>
        </View>

        {/* Book This Stay Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Book this stay"
          onPress={handleBookPress}
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            borderRadius: radius.full,
            paddingHorizontal: 28,
            paddingVertical: 14,
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(255, 198, 41, 0.4)",
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 15.5,
              color: "#0B0B1A",
            }}
          >
            Book this stay
          </Text>
        </Pressable>
      </View>

      {/* Policy Details & House Rules Modal */}
      <PolicyModal
        visible={policyModalVisible}
        onClose={() => setPolicyModalVisible(false)}
        policies={stay.policies}
        staySpecificRules={stay.staySpecificRules}
        checkInTime={stay.checkInTime || "3:00 PM"}
        checkOutTime={stay.checkOutTime || "11:00 AM"}
        selectedPolicyType={selectedPolicyType}
      />
    </View>
  );
}
