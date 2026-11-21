import { PROPERTIES, Property } from "@/data/properties";
import { posthog } from "@/lib/posthog";
import { sanityFetch, SanityProperty } from "@/lib/sanity";
import { colors, fonts } from "@/theme";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Amenity icon mapper
function AmenityIcon({ name }: { name: string }) {
  const lower = name.toLowerCase();
  if (lower.includes("tub") || lower.includes("spa")) {
    return <MaterialIcons name="hot-tub" size={13} color="#0B0B1A" />;
  }
  if (lower.includes("pet") || lower.includes("dog")) {
    return <Ionicons name="paw" size={13} color="#0B0B1A" />;
  }
  if (lower.includes("pool")) {
    return <Ionicons name="water-outline" size={13} color="#0B0B1A" />;
  }
  if (
    lower.includes("ocean") ||
    lower.includes("view") ||
    lower.includes("beach")
  ) {
    return <Feather name="eye" size={12} color="#0B0B1A" />;
  }
  if (lower.includes("fire") || lower.includes("hearth")) {
    return <Ionicons name="flame-outline" size={13} color="#0B0B1A" />;
  }
  return <Feather name="check" size={12} color="#0B0B1A" />;
}

function toSanityProperty(prop: Property): SanityProperty {
  const [city, state] = prop.location.split(",").map((s) => s.trim());
  return {
    _id: prop.id,
    title: prop.title,
    category: prop.category,
    pricePerNight: prop.pricePerNight,
    rating: prop.rating,
    reviewsCount: prop.reviewsCount,
    imageUrl: prop.imageUrl,
    amenities: prop.amenities,
    description: prop.description,
    tags: prop.tags,
    isFeatured: prop.isFeatured,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2,
    petFriendly:
      prop.tags.includes("pet friendly") ||
      prop.amenities.includes("Pet Friendly"),
    location: {
      city: city || prop.location,
      stateOrProvince: state || "",
      country: "USA",
      displayAddress: prop.location,
    },
  };
}

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string; category?: string }>();

  const [query, setQuery] = useState(() => params.q || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => params.category || "Cabins",
  );
  const [under300, setUnder300] = useState(false);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const [quietOnly, setQuietOnly] = useState(false);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [stays, setStays] = useState<SanityProperty[]>(() =>
    PROPERTIES.map(toSanityProperty),
  );
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true);

  // Fetch stays from Sanity Content Lake
  useEffect(() => {
    let isMounted = true;
    async function loadSanityStays() {
      try {
        setLoading(true);
        const groqQuery = `
          *[_type == "property"] | order(isFeatured desc, rating desc) {
            _id,
            title,
            slug,
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
            galleryUrls
          }
        `;
        const result = await sanityFetch<SanityProperty[]>(groqQuery);
        if (isMounted && result && result.length > 0) {
          setStays(result);
        }
      } catch {
        if (isMounted) {
          setStays(PROPERTIES.map(toSanityProperty));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadSanityStays();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter stays
  const filteredStays = useMemo(() => {
    return stays.filter((stay) => {
      if (selectedCategory && selectedCategory !== "All") {
        if (stay.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      if (under300 && stay.pricePerNight > 300) {
        return false;
      }

      if (
        petFriendlyOnly &&
        !stay.petFriendly &&
        !stay.amenities?.some((a) => a.toLowerCase().includes("pet")) &&
        !stay.tags?.some((t) => t.toLowerCase().includes("pet"))
      ) {
        return false;
      }

      if (
        quietOnly &&
        !stay.tags?.some((t) => t.toLowerCase().includes("quiet")) &&
        !stay.description?.toLowerCase().includes("quiet") &&
        !stay.title?.toLowerCase().includes("quiet")
      ) {
        return false;
      }

      if (query.trim()) {
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        const searchableText = [
          stay.title,
          stay.location?.city,
          stay.location?.stateOrProvince,
          stay.location?.displayAddress,
          stay.category,
          stay.description,
          ...(stay.tags || []),
          ...(stay.amenities || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesAll = terms.every((term) => searchableText.includes(term));
        if (!matchesAll) {
          return false;
        }
      }

      return true;
    });
  }, [stays, query, selectedCategory, under300, petFriendlyOnly, quietOnly]);

  // PostHog search tracking
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    const timer = setTimeout(() => {
      const resultCount = filteredStays.length;
      if (resultCount > 0) {
        posthog?.capture("search_results_found", {
          query: trimmedQuery,
          result_count: resultCount,
          category: selectedCategory,
          under_300: under300,
          pet_friendly: petFriendlyOnly,
          quiet_only: quietOnly,
        });
        posthog?.capture("search_performed", {
          query: trimmedQuery,
          result_count: resultCount,
          has_results: true,
        });
      } else {
        posthog?.capture("search_no_results", {
          query: trimmedQuery,
          result_count: 0,
          has_results: false,
          category: selectedCategory,
          under_300: under300,
          pet_friendly: petFriendlyOnly,
          quiet_only: quietOnly,
        });
        posthog?.capture("search_performed", {
          query: trimmedQuery,
          result_count: 0,
          has_results: false,
        });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [
    query,
    filteredStays.length,
    selectedCategory,
    under300,
    petFriendlyOnly,
    quietOnly,
  ]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = !prev[id];
      posthog?.capture(next ? "property_saved" : "property_unsaved", {
        property_id: id,
      });
      return { ...prev, [id]: next };
    });
  }, []);

  const handleCategoryPress = (cat: string) => {
    const next = selectedCategory === cat ? "All" : cat;
    setSelectedCategory(next);
    posthog?.capture("search_filter_toggled", {
      filter_type: "category",
      value: next,
    });
  };

  const handleUnder300Press = () => {
    setUnder300((prev) => {
      const next = !prev;
      posthog?.capture("search_filter_toggled", {
        filter_type: "under_300",
        value: next,
      });
      return next;
    });
  };

  const handlePetFriendlyPress = () => {
    setPetFriendlyOnly((prev) => {
      const next = !prev;
      posthog?.capture("search_filter_toggled", {
        filter_type: "pet_friendly",
        value: next,
      });
      return next;
    });
  };

  const handleQuietPress = () => {
    setQuietOnly((prev) => {
      const next = !prev;
      posthog?.capture("search_filter_toggled", {
        filter_type: "quiet",
        value: next,
      });
      return next;
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingTop: insets.top,
      }}
    >
      <StatusBar barStyle="dark-content" />

      {/* Top Navigation & Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 12,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#F3F4F6",
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.75 : 1,
          })}
        >
          <Feather name="chevron-left" size={24} color="#0B0B1A" />
        </Pressable>

        <View
          style={{
            flex: 1,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#F3F4F6",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            gap: 10,
          }}
        >
          <Feather name="search" size={20} color="#0B0B1A" />
          <TextInput
            style={{
              flex: 1,
              fontFamily: fonts.medium,
              fontSize: 15,
              color: "#0B0B1A",
              paddingVertical: 0,
            }}
            placeholder="Cabins in California"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query ? (
            <Pressable
              onPress={() => setQuery("")}
              hitSlop={8}
              accessibilityLabel="Clear search"
            >
              <Feather name="x" size={18} color="#6B7280" />
            </Pressable>
          ) : (
            <Feather name="sliders" size={18} color="#0B0B1A" />
          )}
        </View>
      </View>

      {/* Filter Chips Horizontal Scroll */}
      <View style={{ marginBottom: 14 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 8,
          }}
        >
          <Pressable
            accessibilityRole="button"
            onPress={() => handleCategoryPress("Cabins")}
            style={({ pressed }) => ({
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor:
                selectedCategory === "Cabins" ? colors.lavender : "#F3F4F6",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                fontFamily:
                  selectedCategory === "Cabins" ? fonts.semiBold : fonts.medium,
                fontSize: 14,
                color: "#0B0B1A",
              }}
            >
              Cabins
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleUnder300Press}
            style={({ pressed }) => ({
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: under300 ? colors.lavender : "#F3F4F6",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: under300 ? fonts.semiBold : fonts.medium,
                fontSize: 14,
                color: "#0B0B1A",
              }}
            >
              Under $300
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handlePetFriendlyPress}
            style={({ pressed }) => ({
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: petFriendlyOnly ? colors.lavender : "#F3F4F6",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: petFriendlyOnly ? fonts.semiBold : fonts.medium,
                fontSize: 14,
                color: "#0B0B1A",
              }}
            >
              Pet Friendly
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={handleQuietPress}
            style={({ pressed }) => ({
              paddingHorizontal: 18,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: quietOnly ? colors.lavender : "#F3F4F6",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                fontFamily: quietOnly ? fonts.semiBold : fonts.medium,
                fontSize: 14,
                color: "#0B0B1A",
              }}
            >
              Quiet
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Results Header: Count & Sort */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingBottom: 12,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: 16,
            color: "#0B0B1A",
          }}
        >
          {loading ? "Searching stays..." : `${filteredStays.length} stays`}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 14,
              color: "#6B7280",
            }}
          >
            Sort by{" "}
            <Text style={{ fontFamily: fonts.bold, color: "#0B0B1A" }}>
              Best match
            </Text>
          </Text>
          <Feather name="chevron-down" size={16} color="#0B0B1A" />
        </View>
      </View>

      {/* Property Cards List Feed */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 110,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0B0B1A" />
          </View>
        ) : filteredStays.length > 0 ? (
          filteredStays.map((stay, index) => {
            const isFav = !!favorites[stay._id];
            const locationStr =
              stay.location?.city && stay.location?.stateOrProvince
                ? `${stay.location.city}, ${stay.location.stateOrProvince}`
                : stay.location?.displayAddress || "California";

            const displayAmenities =
              stay.amenities && stay.amenities.length > 0
                ? stay.amenities.slice(0, 2)
                : ["Hot Tub", "Pet Friendly"];

            return (
              <Animated.View
                key={stay._id}
                entering={FadeInDown.duration(240).delay(index * 35)}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`View ${stay.title}`}
                  onPress={() => router.push(("/stay/" + stay._id) as any)}
                  style={({ pressed }) => ({
                    backgroundColor: "#FFFFFF",
                    borderRadius: 24,
                    padding: 12,
                    flexDirection: "row",
                    gap: 14,
                    borderWidth: 1,
                    borderColor: "#F3F4F6",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    opacity: pressed ? 0.96 : 1,
                  })}
                >
                  {/* Left: 124x124 Square Image */}
                  <Image
                    source={{
                      uri:
                        stay.imageUrl ||
                        "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=400&auto=format&fit=crop",
                    }}
                    style={{
                      width: 124,
                      height: 124,
                      borderRadius: 18,
                      backgroundColor: "#F3F4F6",
                    }}
                    resizeMode="cover"
                  />

                  {/* Right Details Column */}
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "space-between",
                      paddingVertical: 2,
                    }}
                  >
                    {/* Title + Favorite Heart Button */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 6,
                      }}
                    >
                      <Text
                        style={{
                          flex: 1,
                          fontFamily: fonts.bold,
                          fontSize: 16,
                          lineHeight: 21,
                          color: "#0B0B1A",
                        }}
                        numberOfLines={2}
                      >
                        {stay.title}
                      </Text>

                      <Pressable
                        onPress={() => toggleFavorite(stay._id)}
                        hitSlop={8}
                        accessibilityLabel={
                          isFav ? "Remove from favorites" : "Save to favorites"
                        }
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: "#F3F4F6",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons
                          name={isFav ? "heart" : "heart-outline"}
                          size={18}
                          color={isFav ? "#EF4444" : "#0B0B1A"}
                        />
                      </Pressable>
                    </View>

                    {/* Location Pin & Name */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Ionicons
                        name="location-sharp"
                        size={14}
                        color="#9CA3AF"
                      />
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: 13,
                          color: "#6B7280",
                        }}
                        numberOfLines={1}
                      >
                        {locationStr}
                      </Text>
                    </View>

                    {/* Star Rating & Review Count */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <FontAwesome name="star" size={13} color="#F59E0B" />
                      <Text
                        style={{
                          fontFamily: fonts.bold,
                          fontSize: 13,
                          color: "#0B0B1A",
                        }}
                      >
                        {stay.rating ? stay.rating.toFixed(1) : "4.9"}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: 13,
                          color: "#9CA3AF",
                        }}
                      >
                        ({stay.reviewsCount || 120})
                      </Text>
                    </View>

                    {/* Amenity Badges Row */}
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 6,
                        marginVertical: 2,
                      }}
                    >
                      {displayAmenities.map((amenity) => (
                        <View
                          key={amenity}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            backgroundColor: "#F3F4F6",
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12,
                          }}
                        >
                          <AmenityIcon name={amenity} />
                          <Text
                            style={{
                              fontFamily: fonts.medium,
                              fontSize: 11,
                              color: "#0B0B1A",
                            }}
                          >
                            {amenity}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Price Per Night */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "baseline",
                        gap: 3,
                        marginTop: 2,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fonts.extraBold,
                          fontSize: 18,
                          color: "#0B0B1A",
                        }}
                      >
                        ${stay.pricePerNight}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: 13,
                          color: "#6B7280",
                        }}
                      >
                        / night
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            );
          })
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
              gap: 16,
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#F3F4F6",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="search" size={32} color="#6B7280" />
            </View>
            <View style={{ alignItems: "center", gap: 6, maxWidth: 260 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 18,
                  color: "#0B0B1A",
                  textAlign: "center",
                }}
              >
                No stays match your search
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  color: "#6B7280",
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                Try searching for different keywords or resetting your active
                filters.
              </Text>
            </View>

            <Pressable
              onPress={() => {
                setQuery("");
                setSelectedCategory("All");
                setUnder300(false);
                setPetFriendlyOnly(false);
                setQuietOnly(false);
              }}
              style={{
                backgroundColor: "#0B0B1A",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 14,
                  color: "#FFFFFF",
                }}
              >
                Clear all filters
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
