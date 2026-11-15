# 02 · Design System

Status: done

## Goal

Implement the complete Roam design system derived from the reference design, including color tokens, typography ramp (Plus Jakarta Sans geometric sans), 4-point spacing grid, continuous corner radii, shadows, motion, Tailwind v4 `@theme` integration, and reusable UI primitives covering all 15 reference sections.

## Decisions

- **Token structure:** Place canonical TypeScript tokens in `src/theme/` (`colors.ts`, `spacing.ts`, `typography.ts`, `radius.ts`, `shadows.ts`, `motion.ts`, `index.ts`) per `.agents/skills/expo-design-system/SKILL.md`.
- **NativeWind integration:** Mirror tokens into `global.css` via Tailwind v4 `@theme` directive so developers can use both `className="bg-primary text-text-primary rounded-xl"` and programmatic `colors.primary`.
- **Typography:** Install `@expo-google-fonts/plus-jakarta-sans` to match the "Geometric Sans" typeface in the reference (Bold 700, SemiBold 600, Medium 500, Regular 400).
- **Icons:** Install `@expo/vector-icons` for cross-platform vector iconography (Feather, Ionicons, MaterialCommunityIcons).
- **Colors:**
  - `primary`: `#FFC629` (Primary Yellow)
  - `primaryLight`: `#FEF6E6`
  - `lavender`: `#C9B4FF` (Lavender secondary & active chip)
  - `lavenderLight`: `#F3EFFF`
  - `textPrimary`: `#0B0B1A` (Headings, primary text)
  - `textSecondary`: `#6B7280` (Body, secondary labels)
  - `surface`: `#FFFFFF` (Cards, sheets, modals)
  - `surfaceGray`: `#F4F5F7` (App background, input fields)
  - `border`: `#E5E7EB` (Dividers, borders)
  - `glass`: `rgba(255, 255, 255, 0.7)` (Glass blur surfaces)
  - Status/badges: `success` (`#10B981` / `#EAF7EE`), `error` (`#EF4444` / `#FEEBED`), `badgeNew` (`#10B981` / `#E6F9F0`), `badgeSale` (`#EC4899` / `#FCEEF3`), `badgeSuperhost` (`#6366F1` / `#EEF2FF`).
- **Corner Radii:** `sm: 8`, `md: 12`, `lg: 16`, `xl: 24`, `full: 9999`, always paired with `borderCurve: "continuous"`.
- **Reusable Primitives in `src/components/`:**
  - `ThemedText`: Typography variant mapper (`display`, `heading`, `title`, `body`, `button`, `caption`, `footnote`).
  - `Button`: Primary yellow button with optional arrow, Secondary white button with optional leading icon, supporting `sm`/`md`/`lg`, press feedback, loading, and disabled states.
  - `IconButton`: Circular bordered icon button.
  - `InputField`: Search capsule, form text input with lavender focus outline, and secure password input with visibility toggle.
  - `FilterChip` & `CategoryTab`: Pill filters and category tabs with active/inactive states.
  - `Badge`: Status/attribute tags (`guestFavorite`, `new`, `discount`, `superhost`, `neutral`).
  - `StatusAlert`: Inline feedback banners (`success`, `error`) with icons and dismiss action.
  - `PolicyCard`: Expandable/tappable policy summary card with purple accent box.
  - `ProfileRow`: Settings/menu row with icon and chevron.
  - `SegmentedControl`: Pill mode switch (e.g. List vs Map).
  - `ToggleSwitch` & `Stepper`: Value adjusting controls with Roam styling.
  - `ListingCard`: Complete rental preview card (photo, heart button, title, location, rating, amenity chips, price).
- **Showcase Screen:** Replace `src/app/index.tsx` with a scrollable design system gallery demonstrating every token and component from panels 01–15.

## Out of scope

- Backend data fetching and Sanity integration (covered in subsequent search and stay features).
- Audio/haptic feedback integration (handled in animation/interaction pass).

## Steps

### 1. Install dependencies
Install `@expo-google-fonts/plus-jakarta-sans` and `@expo/vector-icons` using `npx expo install`.

### 2. Create design tokens in `src/theme/`
Create `colors.ts`, `spacing.ts`, `typography.ts`, `radius.ts`, `shadows.ts`, `motion.ts`, and `index.ts`.

### 3. Update `global.css` with Tailwind v4 `@theme`
Declare color, spacing, radius, and font variables in `@theme` in `global.css`.

### 4. Load fonts in root layout
Update `src/app/_layout.tsx` to load Plus Jakarta Sans weights using `useFonts` with a splash screen guard.

### 5. Build reusable components in `src/components/`
- Build `ThemedText`
- Build `Button` and `IconButton`
- Build `InputField`
- Build `FilterChip` and `CategoryTab`
- Build `Badge`
- Build `StatusAlert`
- Build `PolicyCard` and `ProfileRow`
- Build `SegmentedControl`, `ToggleSwitch`, and `Stepper`
- Build `ListingCard`

### 6. Create Design System Showcase in `src/app/index.tsx`
Assemble an interactive showcase featuring all 15 sections from the reference image.

### 7. Verification and Closeout
Run `npx tsc --noEmit` and `npx eslint .`.
Verify all visual elements, fonts, colors, and components render cleanly.

## Verification

- `npx tsc --noEmit` exits with 0.
- `npx eslint .` exits with 0.
- All 15 design system panels from the reference image are represented in the showcase screen.

## AGENTS.md updates

Add design system token conventions and component guidelines to "Who owns what" and "Rules".

## Result

All 15 sections from the reference design system have been successfully implemented:
- Design tokens created in `src/theme/` (colors, spacing, typography, radius, shadows, motion, index).
- Tailwind v4 `@theme` variables configured in `global.css`.
- Plus Jakarta Sans loaded in `src/app/_layout.tsx` via `expo-splash-screen` and `useFonts`.
- Reusable UI primitives created in `src/components/` (`ThemedText`, `Button`, `IconButton`, `InputField`, `FilterChip`, `CategoryTab`, `Badge`, `StatusAlert`, `PolicyCard`, `ProfileRow`, `SegmentedControl`, `ToggleSwitch`, `Stepper`, `ListingCard`, `GlassTabBar`).
- Interactive catalog created in `src/app/index.tsx` covering all 15 panels.
- Verified with clean `npx tsc --noEmit` and `npx eslint .`.
