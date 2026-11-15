import { useState } from "react";
import { View, Image, Pressable, ViewStyle, StyleProp } from "react-native";
import { Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { colors, radius, spacing, shadows } from "@/theme";
import { ThemedText } from "./ThemedText";
import { IconButton } from "./IconButton";

export interface ListingCardProps {
  title: string;
  location: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  imageUrl?: string;
  amenities?: string[];
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ListingCard({
  title,
  location,
  rating,
  reviewsCount,
  pricePerNight,
  imageUrl,
  amenities = ["Hot Tub", "Pet Friendly"],
  isFavorite = false,
  onFavoritePress,
  onPress,
  style,
}: ListingCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);

  const handleFavorite = () => {
    setFavorite((prev) => !prev);
    onFavoritePress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: colors.surface,
          borderRadius: radius.xl,
          borderCurve: "continuous",
          padding: spacing.md,
          boxShadow: shadows.card,
          opacity: pressed ? 0.95 : 1,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        {/* Thumbnail Image with Favorite Icon */}
        <View style={{ position: "relative", width: 120, height: 120 }}>
          <Image
            source={{
              uri:
                imageUrl ??
                "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=400&auto=format&fit=crop",
            }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: radius.lg,
              backgroundColor: colors.surfaceGray,
            }}
          />
          <View style={{ position: "absolute", top: 6, right: 6 }}>
            <IconButton
              size="sm"
              variant="glass"
              accessibilityLabel={favorite ? "Remove from favorites" : "Save to favorites"}
              icon={
                <Ionicons
                  name={favorite ? "heart" : "heart-outline"}
                  size={18}
                  color={favorite ? colors.error : colors.textPrimary}
                />
              }
              onPress={handleFavorite}
              style={{ width: 32, height: 32 }}
            />
          </View>
        </View>

        {/* Content details */}
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={{ gap: 2 }}>
            <ThemedText
              variant="caption"
              style={{
                fontWeight: "700",
                fontSize: 16,
                color: colors.textPrimary,
              }}
              numberOfLines={1}
            >
              {title}
            </ThemedText>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Feather name="map-pin" size={12} color={colors.textSecondary} />
              <ThemedText variant="footnote" style={{ color: colors.textSecondary }}>
                {location}
              </ThemedText>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
              <FontAwesome name="star" size={12} color={colors.primary} />
              <ThemedText
                variant="footnote"
                style={{ fontWeight: "700", color: colors.textPrimary }}
              >
                {rating.toFixed(1)}
              </ThemedText>
              <ThemedText variant="footnote" style={{ color: colors.textSecondary }}>
                ({reviewsCount})
              </ThemedText>
            </View>
          </View>

          {/* Amenities tags */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginVertical: 4 }}>
            {amenities.map((item) => (
              <View
                key={item}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: colors.surfaceGray,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: radius.sm,
                  borderCurve: "continuous",
                }}
              >
                {item.toLowerCase().includes("tub") ? (
                  <MaterialIcons name="hot-tub" size={12} color={colors.textPrimary} />
                ) : (
                  <Ionicons name="paw" size={12} color={colors.textPrimary} />
                )}
                <ThemedText variant="footnote" style={{ fontSize: 11, fontWeight: "500" }}>
                  {item}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* Price */}
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
            <ThemedText
              variant="caption"
              style={{ fontWeight: "800", fontSize: 17, color: colors.textPrimary }}
            >
              ${pricePerNight}
            </ThemedText>
            <ThemedText variant="footnote" style={{ color: colors.textSecondary }}>
              / night
            </ThemedText>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
