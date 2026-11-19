import { View, Text, StatusBar, ScrollView } from "react-native";
import { useRouter, Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "@/theme";
import { Button } from "@/components";

export default function TripsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
          paddingTop: spacing.md,
          paddingBottom: insets.bottom + 100,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Empty state illustration container */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: radius.full,
            backgroundColor: colors.surfaceGray,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Feather name="calendar" size={36} color={colors.textSecondary} />
        </View>

        {/* Text */}
        <View style={{ alignItems: "center", gap: spacing.xs, maxWidth: 280 }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 22,
              color: colors.textPrimary,
              textAlign: "center",
            }}
          >
            No trips booked yet
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
            When you book your next cabin, beach house, or villa, your itinerary will show up here.
          </Text>
        </View>

        {/* Action Button */}
        <Button
          title="Explore stays"
          onPress={() => router.push("/(home)" as Href)}
          size="md"
          showArrow
          style={{ width: 200 }}
        />
      </ScrollView>
    </View>
  );
}
