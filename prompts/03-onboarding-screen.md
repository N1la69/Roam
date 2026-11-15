# 03 · Onboarding Screen & Auth Navigation

Status: done

## Goal

Build the onboarding screen matching the reference design with an interactive 3-slide Unsplash stay carousel, custom location glass pill, curved bottom content card with lavender pagination indicators, and hook up navigation into custom authentication screens (`/sign-in` and `/sign-up`) built with the Roam design system.

## Decisions

- **Route layout:**
  - `src/app/index.tsx`: The primary onboarding screen matching the reference design.
  - `src/app/(auth)/sign-in.tsx`: Custom sign-in screen using Roam design system primitives (Google button, email/password `InputField`, primary "Sign in" button).
  - `src/app/(auth)/sign-up.tsx`: Custom sign-up screen with name, email, password fields and link back to sign-in.
  - `src/app/design-system.tsx`: Preserves the 15-panel design system showcase from plan 02 so developers can continue referencing and testing components.
- **Onboarding Carousel Content (3 slides with Unsplash images):**
  - **Slide 1 (matching reference screenshot):**
    - Location: "Whistler, BC"
    - Image: Luxury mountain cabin deck overlooking lake and mountains at sunset (`https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1200&auto=format&fit=crop`)
    - Headline: "Find a stay that fits your story"
    - Subtitle: "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip."
  - **Slide 2:**
    - Location: "Amalfi Coast, Italy"
    - Image: Oceanfront villa with sun terrace and Mediterranean view (`https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop`)
    - Headline: "Curated for peace and seclusion"
    - Subtitle: "Handpicked stays featuring hot tubs, private decks, and pet-friendly spaces designed for quiet moments."
  - **Slide 3:**
    - Location: "Kyoto, Japan"
    - Image: Serene modern architectural retreat nestled in nature (`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop`)
    - Headline: "Clear policies, no surprises"
    - Subtitle: "Ask booking, pet, or cancellation questions and get exact answers sourced directly from verified host rules."
- **Visual Styling (exact match to reference):**
  - Header: Left bold "roam" logo (`PlusJakartaSans_800ExtraBold`), Right pill "Skip" button (`rgba(255,255,255,0.85)` surface).
  - Image card: Large continuous-radius image container with bottom-left location pill (frosted dark glass `rgba(0,0,0,0.45)`, border `rgba(255,255,255,0.25)`, pin icon + location name).
  - Bottom card: Asymmetric curved top (`borderTopLeftRadius: 36`, `borderTopRightRadius: 36`, white surface), containing:
    - Pagination indicators: Active lavender pill (`#C9B4FF`, width 32px), Inactive light gray pills (`#E5E7EB`, width 18px).
    - Headline: `fontSize: 32`, `lineHeight: 38`, `PlusJakartaSans_700Bold`, `colors.textPrimary`.
    - Body copy: `fontSize: 15`, `lineHeight: 22`, `PlusJakartaSans_400Regular`, `colors.textSecondary`.
    - "Get started" button: `colors.primary` (`#FFC629`), text `#0B0B1A`, right arrow icon.
    - "Continue with Google" button: `colors.surface`, border `colors.border`, Google "G" icon.
- **Interactions & Navigation:**
  - Swiping between slides updates the image, location pill, headline, body text, and pagination indicator.
  - "Skip" navigates directly to `/(auth)/sign-in`.
  - "Continue with Google" navigates to `/(auth)/sign-in`.
  - "Get started" advances the carousel if on slides 1 or 2, and navigates to `/(auth)/sign-in` on the last slide (or can immediately navigate to auth).

## Out of scope

- Production OAuth token exchange with Google / Clerk backend credentials (auth screens provide the complete UI flow and are ready for Clerk API route verification).

## Steps

### 1. Relocate Design System gallery to `src/app/design-system.tsx`
Move the existing 15-panel showcase from `index.tsx` to `design-system.tsx` so the design tokens and component test bench remain intact.

### 2. Build the Onboarding Screen in `src/app/index.tsx`
Implement the swipeable 3-slide carousel matching the reference design, including the header ("roam" logo and "Skip" button), Unsplash hero images, floating glass location pill, curved bottom sheet, lavender pagination indicators, "Get started" button with arrow, and "Continue with Google" button.

### 3. Build Authentication Screens in `src/app/(auth)/`
Create `src/app/(auth)/_layout.tsx`, `src/app/(auth)/sign-in.tsx`, and `src/app/(auth)/sign-up.tsx` styled with Roam Design System components.

### 4. Verification and Closeout
Run `npx tsc --noEmit` and `npx eslint .`.
Verify smooth navigation from onboarding to sign-in and sign-up.

## Verification

- `npx tsc --noEmit` exits with 0.
- `npx eslint .` exits with 0.
- Onboarding screen matches the Whistler reference design layout, typography, and colors.
- "Skip", "Get started", and "Continue with Google" smoothly navigate to the authentication flow.
- "Sign in" and "Sign up" toggle back and forth smoothly.

## AGENTS.md updates

Update "Who owns what" to note the onboarding and custom auth routes structure.

## Result

- Built the swipeable 3-slide onboarding screen matching the reference design in `src/app/index.tsx` (Whistler, BC sunset deck Unsplash image, floating glass location pill, curved bottom card, lavender pagination indicators, "Get started", and "Continue with Google").
- Preserved the design system showcase in `src/app/design-system.tsx`.
- Created custom authentication flow in `src/app/(auth)/_layout.tsx`, `src/app/(auth)/sign-in.tsx`, and `src/app/(auth)/sign-up.tsx` using Roam design system primitives.
- Verified smooth type check and lint passes.

Update "Who owns what" to note the onboarding and custom auth routes structure.
