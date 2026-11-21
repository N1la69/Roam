import { Platform } from "react-native";
import Constants from "expo-constants";
import PostHog from "posthog-react-native";

const extra = Constants.expoConfig?.extra;
const projectToken = extra?.posthogProjectToken as string | undefined;
const host = extra?.posthogHost as string | undefined;

function reportMissingConfiguration(variableName: string) {
  const message = `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`;

  if (__DEV__) {
    throw new Error(message);
  }

  console.warn(message);
}

if (!projectToken) {
  reportMissingConfiguration("EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN");
}

if (!host) {
  reportMissingConfiguration("EXPO_PUBLIC_POSTHOG_HOST");
}

export const posthog =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        captureAppLifecycleEvents: true,
        customStorage:
          Platform.OS === "web"
            ? {
                getItem: (key: string) => {
                  try {
                    return typeof window !== "undefined"
                      ? window.localStorage.getItem(key)
                      : null;
                  } catch {
                    return null;
                  }
                },
                setItem: (key: string, value: string) => {
                  try {
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem(key, value);
                    }
                  } catch {}
                },
              }
            : undefined,
        logs: {
          serviceName: "roam-mobile",
          environment: __DEV__ ? "development" : "production",
          serviceVersion: Constants.expoConfig?.version,
        },
        errorTracking: {
          autocapture: {
            uncaughtExceptions: true,
            unhandledRejections: true,
          },
        },
      })
    : undefined;

// Only purpose-written calls through this logger are exported as PostHog logs.
export const posthogLogger = posthog?.logger;

