const appConfig = require("./app.json");

module.exports = ({ config }) => {
  const resolvedConfig = config ?? appConfig.expo;

  return {
    ...resolvedConfig,
    extra: {
      ...resolvedConfig.extra,
      posthogProjectToken: process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN,
      posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
    },
  };
};
