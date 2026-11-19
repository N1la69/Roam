import { useAuth } from "@clerk/expo";
import { Redirect, Tabs, useRouter, Href } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme";
import { GlassTabBar, TabKey } from "@/components";

export default function HomeLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state }) => {
        const currentRoute = state.routes[state.index]?.name;
        let activeTab: TabKey = "home";
        if (currentRoute === "search") activeTab = "search";
        else if (currentRoute === "trips") activeTab = "trips";
        else if (currentRoute === "profile") activeTab = "profile";

        const handleTabPress = (tab: TabKey) => {
          if (tab === "home") {
            router.push("/(home)" as Href);
          } else if (tab === "search") {
            router.push("/(home)/search" as Href);
          } else if (tab === "trips") {
            router.push("/(home)/trips" as Href);
          } else if (tab === "profile") {
            router.push("/(home)/profile" as Href);
          }
        };

        return (
          <View
            style={{
              position: "absolute",
              bottom: Math.max(insets.bottom, 16),
              left: 20,
              right: 20,
              alignItems: "center",
            }}
          >
            <GlassTabBar
              activeTab={activeTab}
              onTabPress={handleTabPress}
              style={{ width: "100%", maxWidth: 400 }}
            />
          </View>
        );
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="trips" options={{ title: "Trips" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
