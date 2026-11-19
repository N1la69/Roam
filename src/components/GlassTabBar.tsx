import React from "react";
import { View, Text, Pressable, ViewStyle, StyleProp } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "@/theme";

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
    renderIcon: (isActive: boolean) => React.ReactNode;
  }[] = [
    {
      key: "home",
      label: "Home",
      renderIcon: (isActive) => (
        <Ionicons
          name={isActive ? "home" : "home-outline"}
          size={21}
          color={isActive ? "#0B0B1A" : "#4B5563"}
        />
      ),
    },
    {
      key: "search",
      label: "Search",
      renderIcon: (isActive) => (
        <Feather
          name="search"
          size={21}
          color={isActive ? "#0B0B1A" : "#4B5563"}
        />
      ),
    },
    {
      key: "trips",
      label: "Trips",
      renderIcon: (isActive) => (
        <Feather
          name="calendar"
          size={20}
          color={isActive ? "#0B0B1A" : "#4B5563"}
        />
      ),
    },
    {
      key: "profile",
      label: "Profile",
      renderIcon: (isActive) => (
        <Feather
          name="user"
          size={21}
          color={isActive ? "#0B0B1A" : "#4B5563"}
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
          backgroundColor: "#FFFFFF",
          borderColor: "rgba(0, 0, 0, 0.08)",
          borderWidth: 1,
          borderRadius: radius.full,
          paddingHorizontal: 12,
          paddingVertical: 8,
          height: 68,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 18,
          elevation: 12,
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
            accessibilityLabel={tab.label}
            onPress={() => onTabPress(tab.key)}
            hitSlop={8}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              opacity: pressed ? 0.75 : 1,
            })}
          >
            {/* Active Highlight Indicator Pill / Icon */}
            <View
              style={{
                width: isActive ? 48 : 36,
                height: 32,
                borderRadius: 16,
                backgroundColor: isActive ? colors.primary : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {tab.renderIcon(isActive)}
            </View>

            {/* Tab Label */}
            <Text
              style={{
                fontFamily: isActive ? fonts.bold : fonts.medium,
                fontSize: 11,
                color: isActive ? "#0B0B1A" : "#6B7280",
                letterSpacing: -0.2,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
