# 09 · Property Details Screen

Status: done

## Goal

Build the property details screen (`src/app/stay/[id].tsx`) matching the attached reference design exactly, wired with live Sanity Content Lake data (including host information, house rules, and cancellation policies), hook up navigation from Home and Search screens, display a coming-soon message when "Book this stay" is pressed, and track stay views and interactions in PostHog.

## Decisions

- **Route & Navigation**:
  - File: `src/app/stay/[id].tsx` inside the root Expo Router Stack so it naturally slides over the bottom tab bar.
  - Receives `id` route parameter (Sanity property `_id`).
  - Wire card taps in `src/app/(home)/index.tsx` (featured stay card, secondary stay cards) and `src/app/(home)/search.tsx` to navigate to `/(home)` / `/stay/${stay._id}`.
- **Design Alignment (Exact Match to Reference Image `media_1795258138094_97658662.jpg`)**:
  - **Hero Media Header**:
    - Full-bleed hero cover image with smooth aspect ratio and high resolution.
    - Top floating circular action controls with subtle drop shadows:
      - Left: White circular back button with chevron-left `<` (triggers `router.back()`).
      - Right: White circular share button (`Feather.share` or `Ionicons.share-outline`) and white circular favorite button (`Ionicons.heart` / `heart-outline`).
    - Bottom-right corner of image: Semi-transparent dark pill counter: `1 / {totalPhotos}` (e.g. `1 / 24`).
  - **Floating Detail Card**:
    - White rounded container overlapping hero image with continuous corner radius (`borderTopLeftRadius: 32`, `borderTopRightRadius: 32`, `-mt-6`).
    - **Header Row**:
      - Left: Stay Title in bold, extra-large typography (`fonts.bold`, 26px, dark text `#0B0B1A`).
      - Right: Star rating card with gold star `★ 4.9` (bold 18px) and `({reviewsCount})` review count in `colors.textSecondary` underneath.
    - **Location**:
      - Location pin icon in `#0B0B1A` with display address (e.g. `Lake Arrowhead, CA`).
    - **Amenity Highlights Row**:
      - 4 horizontal amenity columns matching reference:
        - Hot Tub: `MaterialIcons name="hot-tub"` + `Hot Tub`
        - Pet Friendly: `Ionicons name="paw"` + `Pet Friendly`
        - Fast Wi-Fi: `Feather name="wifi"` + `Fast Wi-Fi`
        - Forest Views / Mountain: `MaterialIcons name="terrain"` + `Forest Views`
  - **Interactive Policy & Knowledge Cards**:
    - **Card 1 ("Ask about policies")**:
      - Soft lavender rounded container (`colors.lavenderLight` / `#F0EBFF`).
      - Purple icon container with chat/speech bubble (`Ionicons name="chatbubble-ellipses-outline"`).
      - Title: `Ask about policies` (bold 16px).
      - Subtitle: `Cancellation, house rules, pets, check-in and more.`
      - Chevron right `>` on right.
      - Tapping opens a detailed Policy & House Rules bottom sheet/modal presenting word-for-word policy text from Sanity (`content`) and property `staySpecificRules`.
    - **Card 2 ("Free cancellation" / Cancellation Policy)**:
      - Soft lavender rounded container (`colors.lavenderLight` / `#F0EBFF`).
      - Purple icon container with document icon (`Feather name="file-text"`).
      - Title: Dynamic title from the property's cancellation policy (e.g. `Free cancellation` or `Moderate cancellation`).
      - Subtitle: Summary of cancellation terms (e.g. `Full refund up to 7 days before check-in.`).
      - Chevron right `>` on right.
      - Tapping opens the cancellation policy modal.
  - **Host Profile Row**:
    - Circular host avatar image (`width: 48, height: 48, borderRadius: 24`).
    - Host details: `Hosted by {host.name}` (bold 16px).
    - Host badge: Medal/pin icon + `Superhost` (or `Host`).
    - Chevron right `>` on right.
  - **Sticky Bottom Booking Bar**:
    - Fixed bottom container above safe area with white background and top border.
    - Left side: Price per night in extra-large bold typography (`${pricePerNight}` `/ night`) and computed total (`${total}` total).
    - Right side: Full-height rounded pill button in primary brand color (`colors.primary` / `#FFC629`): `Book this stay`.
    - Pressing button triggers a clean coming-soon alert/toast ("Booking is coming soon! Reservations will be available directly in Roam.").
- **Live Sanity Data Integration**:
  - Uses `sanityFetch<SanityPropertyDetail>` via `src/lib/sanity.ts`.
  - GROQ Query:
    ```groq
    *[_type == "property" && _id == $id][0] {
      _id,
      title,
      tagline,
      category,
      pricePerNight,
      cleaningFee,
      rating,
      reviewsCount,
      isFeatured,
      maxGuests,
      bedrooms,
      beds,
      baths,
      petFriendly,
      amenities,
      location,
      description,
      neighborhoodOverview,
      tags,
      checkInTime,
      checkOutTime,
      imageUrl,
      galleryUrls,
      staySpecificRules,
      host-> {
        name,
        avatarUrl,
        bio,
        isSuperhost,
        rating,
        reviewsCount,
        responseRate,
        responseTime
      },
      policies[]-> {
        _id,
        title,
        policyType,
        summary,
        content,
        icon
      }
    }
    ```
  - Graceful fallback: If network fails or offline, finds fallback property from `PROPERTIES` in `@/data/properties`.
- **PostHog Analytics Tracking**:
  - `stay_opened`: tracked on mount with `{ stay_id, title, category, price_per_night, location }`.
  - `stay_policy_viewed`: tracked when policy cards are tapped with `{ stay_id, policy_type }`.
  - `stay_favorite_toggled`: tracked when heart icon is pressed with `{ stay_id, is_favorite }`.
  - `booking_attempted`: tracked when "Book this stay" is pressed with `{ stay_id, price_per_night }`.
- **States Handled**:
  - Loading: Clean skeleton loader matching the layout structure.
  - Error: Friendly error view with retry button and back navigation.
  - Content loaded: Full animated view with Reanimated `FadeInDown`.

## Out of scope

- Full booking and payment checkout flow (button displays coming-soon notice per user instruction).
- AI Context Knowledge Base Q&A chat interface (handled in upcoming AI feature; policy modal displays exact Sanity policy text word-for-word).

## Steps

### 1. Extend Sanity Types (`src/lib/sanity.ts`)
- Add `SanityHost` and `SanityPolicy` interfaces.
- Extend `SanityProperty` (or define `SanityPropertyDetail`) to include resolved `host?: SanityHost`, `policies?: SanityPolicy[]`, and `staySpecificRules?: string[]`.

### 2. Implement Policy & House Rules Modal Component (`src/components/PolicyModal.tsx`)
- Create reusable modal/sheet component that displays word-for-word policy documents:
  - Cancellation policy with full refund conditions.
  - Standard house rules and quiet hours.
  - Pet guidelines (if applicable).
  - Check-in & check-out instructions.
  - Stay-specific house rules (e.g. mudroom boots, hot tub hours).
- Export from `src/components/index.ts`.

### 3. Build Property Details Screen (`src/app/stay/[id].tsx`)
- Implement full-screen details view:
  - Hero image with floating circular back, share, and heart buttons.
  - Photo count badge (`1 / {count}`).
  - Overlapping rounded white sheet with stay title, star rating, reviews count, and location.
  - Horizontal amenity highlights (Hot Tub, Pet Friendly, Fast Wi-Fi, Forest Views/Views).
  - Two lavender policy cards: "Ask about policies" and dynamic cancellation policy card.
  - Host row with avatar, name, and Superhost indicator.
  - Property description narrative.
  - Sticky bottom booking bar with nightly price, estimated total, and "Book this stay" button.
  - Coming-soon alert on booking button press.
  - PostHog `stay_opened` and interaction tracking.

### 4. Connect Navigation from Home & Search Screens
- Update `src/app/(home)/index.tsx`:
  - Wire featured stay card press -> `router.push('/stay/' + featuredStay._id)`.
  - Wire secondary stay cards press -> `router.push('/stay/' + stay._id)`.
- Update `src/app/(home)/search.tsx`:
  - Wire search listing cards press -> `router.push('/stay/' + stay._id)`.

### 5. Verification & Testing
- Type check: `npx tsc --noEmit`.
- Lint check: `npx expo lint`.
- Verify navigation from Home to stay details screen.
- Verify navigation from Search to stay details screen.
- Verify live Sanity data rendering (host, policies, amenities, photos).
- Verify PostHog events are dispatched properly.

## Verification

- `npx tsc --noEmit` passes with 0 errors.
- `npx expo lint` passes with 0 errors.
- Opening a stay loads live data from Sanity Content Lake (`http://localhost:8081/stay/...`).
- Tapping "Ask about policies" opens policy modal displaying exact house rules and cancellation policy text.
- Tapping "Book this stay" shows coming-soon alert.
- PostHog captures `stay_opened` event with correct metadata.

## AGENTS.md updates

- Document stay details route `src/app/stay/[id].tsx` and policy modal in Navigation and Content sections.

## Result

- Built `src/app/stay/[id].tsx` matching the reference design: full-bleed hero cover image, floating circular header action buttons, photo count pill, overlapping rounded card container, title, star rating, display address, horizontal amenity icons, dual lavender action cards ("Ask about policies" and dynamic cancellation policy), host profile row with superhost badge, and sticky bottom booking bar.
- Built `src/components/PolicyModal.tsx` displaying structured word-for-word Sanity policies, check-in/out hours, and stay-specific house rules.
- Connected live Sanity Content Lake data with GROQ query resolving `host->` and `policies[]->`, with graceful offline fallback.
- Wired card navigation from Home (`src/app/(home)/index.tsx`) and Search (`src/app/(home)/search.tsx`) to `/stay/${stay._id}`.
- Added coming-soon toast notice when "Book this stay" is tapped.
- Integrated PostHog tracking for `stay_opened`, `stay_policy_viewed`, `property_saved`, and `booking_attempted`.
- Verified type checking (`npx tsc --noEmit`) and linting (`npx eslint`) with 0 errors.
