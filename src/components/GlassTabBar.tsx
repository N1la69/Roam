import { View, Pressable, ViewStyle, StyleProp } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, shadows } from "@/theme";
import { ThemedText } from "./ThemedText";

export type TabKey = "home" | "search" | "trips" | "profile";

export interface GlassTabBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
  style?: StyleProp<ViewStyle>;
}

export function GlassTabBar({
  activeTab,
  onTabPress,
  style,
}: GlassTabBarProps) {
  const tabs: {
    key: TabKey;
    label: string;
    icon: (active: boolean) => React.ReactNode;
  }[] = [
    {
      key: "home",
      label: "Home",
      icon: (active) => (
        <Ionicons
          name={active ? "home" : "home-outline"}
          size={20}
          color={colors.textPrimary}
        />
      ),
    },
    {
      key: "search",
      label: "Search",
      icon: (active) => (
        <Feather
          name="search"
          size={20}
          color={active ? colors.textPrimary : colors.textSecondary}
        />
      ),
    },
    {
      key: "trips",
      label: "Trips",
      icon: (active) => (
        <Feather
          name="calendar"
          size={20}
          color={active ? colors.textPrimary : colors.textSecondary}
        />
      ),
    },
    {
      key: "profile",
      label: "Profile",
      icon: (active) => (
        <Feather
          name="user"
          size={20}
          color={active ? colors.textPrimary : colors.textSecondary}
        />
      ),
    },
  ];

  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: colors.glass,
          borderColor: "rgba(255, 255, 255, 0.6)",
          borderWidth: 1.5,
          borderRadius: radius.full,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs + 2,
          boxShadow: shadows.glass,
          minHeight: 64,
        },
        style,
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onTabPress(tab.key)}
            style={({ pressed }) => [
              {
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: isActive ? spacing.md : spacing.sm + 2,
                paddingVertical: spacing.sm,
                borderRadius: radius.full,
                backgroundColor: isActive ? colors.primary : "transparent",
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            {tab.icon(isActive)}
            {isActive && (
              <ThemedText
                variant="footnote"
                style={{
                  fontWeight: "700",
                  color: colors.textPrimary,
                }}
              >
                {tab.label}
              </ThemedText>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
