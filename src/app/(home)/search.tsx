import { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "@/theme";
import {
  InputField,
  FilterChip,
  ListingCard,
  Button,
} from "@/components";
import {
  CATEGORIES,
  PropertyCategory,
  filterProperties,
} from "@/data/properties";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string; category?: string }>();

  const [query, setQuery] = useState(() => params.q || "");
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory>(
    () => (params.category as PropertyCategory) || "All"
  );

  const filteredStays = useMemo(() => {
    return filterProperties(query, selectedCategory);
  }, [query, selectedCategory]);

  const handleClear = () => {
    setQuery("");
    setSelectedCategory("All");
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

      {/* Header & Search Input */}
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xs,
          paddingBottom: spacing.sm,
          gap: spacing.md,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: fonts.extraBold,
              fontSize: 26,
              letterSpacing: -1,
              color: colors.textPrimary,
            }}
          >
            Search Stays
          </Text>

          {query || selectedCategory !== "All" ? (
            <Pressable onPress={handleClear} hitSlop={8}>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontSize: 14,
                  color: colors.textSecondary,
                  textDecorationLine: "underline",
                }}
              >
                Reset
              </Text>
            </Pressable>
          ) : null}
        </View>

        <InputField
          variant="search"
          placeholder="Try 'quiet pet friendly cabin' or location..."
          value={query}
          onChangeText={setQuery}
          leftIcon={<Feather name="search" size={20} color={colors.textPrimary} />}
          rightIcon={
            query ? (
              <Pressable onPress={() => setQuery("")} hitSlop={8}>
                <Feather name="x" size={18} color={colors.textSecondary} />
              </Pressable>
            ) : (
              <Feather name="sliders" size={18} color={colors.textPrimary} />
            )
          }
        />

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm }}
        >
          {CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.id}
              label={cat.label}
              active={selectedCategory === cat.id}
              onPress={() => setSelectedCategory(cat.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Results List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.md,
          paddingBottom: insets.bottom + 100,
          gap: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Results Count Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 2,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontSize: 14,
              color: colors.textSecondary,
            }}
          >
            {filteredStays.length === 1
              ? "1 stay found"
              : `${filteredStays.length} stays found`}
          </Text>

          {query ? (
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 13,
                color: colors.lavender,
              }}
            >
              matching &quot;{query}&quot;
            </Text>
          ) : null}
        </View>

        {/* Property Cards Feed */}
        {filteredStays.length > 0 ? (
          filteredStays.map((stay, index) => (
            <Animated.View
              key={stay.id}
              entering={FadeInDown.duration(280).delay(index * 40)}
            >
              <ListingCard
                title={stay.title}
                location={stay.location}
                rating={stay.rating}
                reviewsCount={stay.reviewsCount}
                pricePerNight={stay.pricePerNight}
                imageUrl={stay.imageUrl}
                amenities={stay.amenities.slice(0, 2)}
                onPress={() => {
                  // In real app, navigates to stay details
                }}
              />
            </Animated.View>
          ))
        ) : (
          /* Empty State */
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: spacing.xxl,
              gap: spacing.md,
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: radius.full,
                backgroundColor: colors.surfaceGray,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Feather name="search" size={32} color={colors.textSecondary} />
            </View>

            <View style={{ alignItems: "center", gap: 6, maxWidth: 260 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 18,
                  color: colors.textPrimary,
                  textAlign: "center",
                }}
              >
                No stays match your criteria
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  color: colors.textSecondary,
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                Try adjusting your search keywords or switching category filters.
              </Text>
            </View>

            <Button
              title="View all stays"
              variant="secondary"
              onPress={handleClear}
              size="md"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
