# 06 · Home Screen and Search Integration

Status: done

## Goal

Build the Home screen matching the design screenshot with realistic local rental property data, connect the one-sentence search prompt bar to a dedicated Search screen that filters and displays results, configure `NativeTabs` from `expo-router/unstable-native-tabs` for platform-native bottom navigation, and add subtle, high-performance UI-thread animations following `expo-animation` guidelines.

## Decisions

- **Bottom Navigation**: Use `NativeTabs` from `expo-router/unstable-native-tabs` in `src/app/(home)/_layout.tsx` with triggers for `index` (Home), `search` (Search), `trips` (Trips), and `profile` (Profile), using SF Symbols on iOS (`house.fill`, `magnifyingglass`, `calendar`, `person.fill`) and Material symbols on Android.
- **Home Screen Design**:
  - Top header: "roam" brand wordmark on the left and circular avatar on the right with yellow glow ring.
  - Header text: Greeting ("Hey, Joanna 👋" falling back to Clerk user first name), large bold headline ("Find your\nnext stay"), and circular search button on the right.
  - Stay Prompt / Search pill: Lavender (`#C9B4FF`) background pill with sparkle icon (`✦`), editable or tap-to-search text ("quiet pet friendly cabin with hot tub"), and circular up-right arrow button (`arrow-up-right`). Tapping it or submitting routes to `/(home)/search` with the query.
  - Category chips: Two rows matching design ("All Stays" active in Roam yellow `#FFC629`, "Cabins", "Beach", "City", "Villas"). Tapping a category toggles filtering on the feed.
  - Featured property card: Large rounded hero card matching design with high-resolution cabin photo, top-right `★ 4.9` badge, bottom-left location pin `📍 Lake Arrowhead, CA`, bold title "Modern Cabin\nwith Hot Tub", and white circular action button in bottom-right.
  - Scrollable feed showing multiple local property cards with smooth scrolling.
- **Search Screen (`src/app/(home)/search.tsx`)**:
  - Live search bar with clear button, accepting query parameter from Home.
  - Horizontal category filter chips.
  - Result count display (e.g. "4 stays found").
  - Filtered listing feed displaying full property details (price per night, amenities badges, rating, location).
  - Empty state with "Clear search" action when no properties match.
- **Property Dataset (`src/data/properties.ts`)**:
  - Structured local properties with IDs, titles, locations, prices, ratings, review counts, images (high-quality Unsplash cabin/villa/cottage images), categories, tags, and amenities.
- **Animations (`expo-animation` rules)**:
  - Reanimated UI-thread animations for subtle press feedback (`scale: 0.97`) on buttons and listing cards.
  - Staggered entrance animation for property cards using `FadeInDown.duration(300)`.
  - Animate only `transform` and `opacity`; no layout re-calculation or heavy animated dimensions.
  - Tab transitions maintain native platform behavior without sliding.

## Out of scope

- Direct booking checkout and payment processing (handled in later reservation phase).
- Remote Sanity studio synchronization (using local data store as specified).

## Steps

### 1. Create realistic local property data
Create `src/data/properties.ts` with 6 detailed rental properties, categories, filter helper functions, and TypeScript types (`Property`, `Category`).

### 2. Configure NativeTabs in `src/app/(home)/_layout.tsx`
Update `src/app/(home)/_layout.tsx` to keep the Clerk auth guard and wrap the home route group in `<NativeTabs>` with triggers for `index`, `search`, `trips`, and `profile`. Create stub screens for `trips.tsx` and `profile.tsx` (with sign-out action).

### 3. Build the Home screen in `src/app/(home)/index.tsx`
Implement the Home screen matching the screenshot:
- Header with wordmark and user avatar.
- Greeting ("Hey, Joanna 👋") + "Find your\nnext stay" headline + search icon button.
- Lavender AI prompt search pill with sparkles icon, query text, and up-right arrow navigation to search.
- Category pills matching layout and active Roam yellow token.
- Featured property hero card with badges, overlay text, and smooth press animations.
- Scrollable feed of stays with subtle Reanimated entrance animations.

### 4. Build the Search screen in `src/app/(home)/search.tsx`
Create the dedicated Search screen:
- Search input field accepting query params from home prompt.
- Category filter chips to refine results.
- Live filtering against property title, location, category, amenities, and tags.
- Detailed listing cards with price per night, rating, and amenity tags.
- Empty state with reset button when no stays match.

### 5. Verification and Closeout
Run `npx tsc --noEmit` and `npx eslint .`. Test search interaction and category filtering.

## Verification

- `npx tsc --noEmit` passes with 0 errors.
- `npx eslint .` passes with 0 errors and 0 warnings.
- Home screen layout matches the design screenshot (wordmark, avatar, headline, search button, prompt pill, category chips, hero cabin card).
- Tapping or typing into the search pill on Home navigates to `/search` with the query pre-filled.
- Search screen filters properties dynamically and displays matching results and empty state.
- `NativeTabs` renders native bottom tabs on iOS/Android and allows switching between Home, Search, Trips, and Profile.
- Reanimated press and entrance animations run smoothly on the UI thread without layout shifts.

## AGENTS.md updates

Update "Who owns what" and "Rules" with `NativeTabs` navigation structure and local property data store conventions.

## Result

Implemented the complete Home and Search experience:
1. `src/data/properties.ts`: Modeled realistic rental properties across California and Washington with categories, ratings, tags, and multi-token search filtering.
2. `src/app/(home)/index.tsx`: Rebuilt Home screen matching design exactly with wordmark, profile avatar, greeting, headline, search action button, lavender stay prompt pill with arrow button, category chips, hero cabin card, and smooth Reanimated feed animations.
3. `src/app/(home)/search.tsx`: Created search screen with live keyword and category filtering, results count, empty state, and listing cards.
4. `src/app/(home)/_layout.tsx`: Configured `NativeTabs` from `expo-router/unstable-native-tabs` with triggers for Home, Search, Trips, and Profile.
5. `src/app/(home)/trips.tsx` & `src/app/(home)/profile.tsx`: Added trips screen and profile screen with account settings and sign-out.
6. All TypeScript and ESLint checks pass with 0 errors.
