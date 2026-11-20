import "../../global.css";
import { useEffect, useRef } from "react";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Feather, Ionicons, FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { ClerkProvider, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "@/lib/posthog";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in .env");
}

SplashScreen.preventAutoHideAsync();

function PostHogIdentity() {
  const { isLoaded, user } = useUser();
  const identifiedUserId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!user?.id) {
      identifiedUserId.current = undefined;
      return;
    }

    if (identifiedUserId.current === user.id) {
      return;
    }

    posthog?.identify(user.id, {
      $set: {
        ...(user.primaryEmailAddress?.emailAddress
          ? { email: user.primaryEmailAddress.emailAddress }
          : {}),
        ...(user.firstName ? { first_name: user.firstName } : {}),
        ...(user.lastName ? { last_name: user.lastName } : {}),
        ...(user.fullName ? { name: user.fullName } : {}),
      },
    });
    identifiedUserId.current = user.id;
  }, [isLoaded, user]);

  return null;
}

export default function RootLayout() {
  const pathname = usePathname();
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    ...Feather.font,
    ...Ionicons.font,
    ...FontAwesome.font,
    ...FontAwesome5.font,
    ...MaterialIcons.font,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    posthog?.screen(pathname);
  }, [pathname]);

  if (!loaded && !error) {
    return null;
  }

  const app = (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <PostHogIdentity />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F4F5F7" },
        }}
      />
    </ClerkProvider>
  );

  return posthog ? (
    <PostHogProvider client={posthog} autocapture={{ captureScreens: false }}>
      {app}
    </PostHogProvider>
  ) : app;
}
