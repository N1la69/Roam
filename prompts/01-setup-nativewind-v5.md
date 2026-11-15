# 01 · Setup NativeWind v5

Status: done

## Goal

Install and configure NativeWind v5 RC0 (`nativewind@5.0.0-rc.0` and `react-native-css@3.1.0-rc.0`) with Tailwind CSS v4 in the Expo project so that components can be styled using Tailwind `className` utility props across native and web platforms.

## Decisions

- **Package versions:** Pin exact versions as required by the NativeWind v5 documentation: `nativewind@5.0.0-rc.0`, `react-native-css@3.1.0-rc.0`, `tailwindcss@4.1.12`, `@tailwindcss/postcss@4.1.12`, `postcss`, and `lightningcss@1.30.1`.
- **Lightningcss override:** Add `"overrides": { "lightningcss": "1.30.1" }` to `package.json` to prevent AST deserialization errors with Metro.
- **PostCSS config:** Create `postcss.config.mjs` with the `@tailwindcss/postcss` plugin.
- **Global CSS location:** Place `global.css` at the project root with the unlayered utilities layout specified in the v5 docs (`tailwindcss/theme.css`, `tailwindcss/preflight.css`, `tailwindcss/utilities.css`, `nativewind/theme`).
- **Metro config:** Create `metro.config.js` wrapping `getDefaultConfig(__dirname)` from `expo/metro-config` with `withNativewind(config)`.
- **Root Layout import:** Import `../../global.css` once at the top of `src/app/_layout.tsx`.
- **TypeScript:** Create `nativewind-env.d.ts` in root with `/// <reference types="react-native-css/types" />` and `declare module "*.css";` for full TypeScript typing of `className` and CSS module imports.
- **System Appearance:** Keep `"userInterfaceStyle": "automatic"` in `app.json`.
- **Sample Screen:** Update `src/app/index.tsx` with NativeWind utility classes to verify runtime compilation and type checking.

## Out of scope

- Custom theme tokens or design system colors (deferred to dedicated design system work).
- Modifying custom Babel configurations (NativeWind v5 relies on standard `babel-preset-expo` and Metro integration, not Babel plugins).

## Steps

### 1. Install dependencies and configure package overrides
Install exact NativeWind and React Native CSS versions:
`npm install --save-exact nativewind@5.0.0-rc.0 react-native-css@3.1.0-rc.0`
Install Tailwind and PostCSS dev dependencies:
`npm install --save-dev --save-exact tailwindcss@4.1.12 @tailwindcss/postcss@4.1.12 postcss lightningcss@1.30.1`
Add `lightningcss` override to `package.json`.

### 2. Create PostCSS config and global.css
Create `postcss.config.mjs` exporting `@tailwindcss/postcss`.
Create `global.css` at root with:
```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";

@import "nativewind/theme";
```

### 3. Create Metro configuration
Create `metro.config.js` using `expo/metro-config` wrapped with `nativewind/metro`:
```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = withNativewind(config);
```

### 4. Wire Root Layout and TypeScript declarations
Import `../../global.css` in `src/app/_layout.tsx`.
Create `nativewind-env.d.ts` referencing `react-native-css/types` and typing `*.css`.

### 5. Update index screen and verify
Update `src/app/index.tsx` to use Tailwind utility classes via `className`.
Run `npx tsc --noEmit` and `npx expo lint` to ensure zero type errors and clean linting.

## Verification

- `npx tsc --noEmit` completes cleanly with no type errors on `className` or CSS imports.
- `npx expo lint` passes without errors.
- Dependencies in `package.json` match the exact RC specification.

## AGENTS.md updates

Add styling section under "Who owns what" / "Expo":
- **Styling:** NativeWind v5 RC0 + Tailwind CSS v4. Styles are imported in `src/app/_layout.tsx` via `global.css`.

## Result

Successfully installed and configured NativeWind v5 RC0 (`nativewind@5.0.0-rc.0` and `react-native-css@3.1.0-rc.0`) with Tailwind CSS v4 (`tailwindcss@4.1.12`, `@tailwindcss/postcss@4.1.12`, `lightningcss@1.30.1` overridden). Configured `postcss.config.mjs`, `metro.config.js`, `global.css`, `nativewind-env.d.ts`, and imported in `src/app/_layout.tsx`. Verified with `npx tsc --noEmit` and `npx expo lint`.
