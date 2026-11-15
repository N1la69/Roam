# 04 · Auth Screens Redesign & Verification Flow

Status: done

## Goal

Redesign the sign-up, sign-in, and verification screens to match the reference design exactly: stacked label-over-input fields with lavender focus outlines, circular back button, "roam" header wordmark, primary yellow button with anchored right arrow, Google and Apple SSO buttons, 6-digit OTP verification with timer, and mocked navigation flows connecting onboarding, sign-up, verification, and sign-in.

## Decisions

- **Visual styling (matching reference design):**
  - **Header:** Circular back button `<` (`width: 42, height: 42, borderRadius: full, borderWidth: 1, borderColor: colors.border`) on the left, bold "roam" wordmark (`fontSize: 28, fontFamily: fonts.extraBold`) on the right.
  - **Title:** Large bold Geometric Sans (`PlusJakartaSans_700Bold`, `fontSize: 36, lineHeight: 40`), e.g., "Create\nyour account" and "Welcome\nback".
  - **Subtitle:** `PlusJakartaSans_400Regular`, `fontSize: 15, lineHeight: 22, color: colors.textSecondary`.
  - **Stacked Input Fields (`StackedInputField`):**
    - Container: `backgroundColor: colors.surfaceGray` (`#F4F5F7`), `borderRadius: 20`, padding `14px 16px`.
    - Active / focused: `backgroundColor: colors.surface` (`#FFFFFF`), `borderColor: colors.lavender` (`#C9B4FF`), `borderWidth: 1.5`.
    - Left icon: `Feather` icons (`user`, `mail`, `lock`) centered vertically.
    - Content stack: Top line is field label (`fontSize: 14, fontFamily: fonts.medium, color: colors.textPrimary`), bottom line is `TextInput` placeholder/value (`fontSize: 15, fontFamily: fonts.regular, color: colors.textPrimary`).
    - Right icon: Password eye toggle.
  - **Primary Button:** "Create account" / "Sign in" / "Verify and continue" with right arrow anchored on right edge, full capsule, `backgroundColor: colors.primary` (`#FFC629`).
  - **Divider:** "or" with hairline border lines.
  - **Social Buttons:** Full capsule secondary buttons for "Continue with Google" (4-color Google "G") and "Continue with Apple" (Apple logo).
  - **Footer:** Tappable switchers ("Already have an account? Sign in" and "Don't have an account? Sign up").
- **Verification Screen (`/(auth)/verify`):**
  - Displays target email passed from sign-up.
  - 6 individual OTP digit boxes with auto-advance on entry, backspace fallback, and active lavender border `#C9B4FF`.
  - Countdown timer for "Resend code in 0:45" with resend action once elapsed.
  - "Verify and continue" primary button.
  - Mocked authentication navigates to the app showcase (`/design-system`).
- **Mocked Auth Flow:**
  - Onboarding -> Sign up / Sign in.
  - Sign up -> Verify -> App.
  - Sign in -> App.
  - Sign up <-> Sign in toggle directly.

## Out of scope

- Live Clerk API authentication / SMS sending (all interactions are mocked with realistic feedback and state handling).

## Steps

### 1. Create `StackedInputField` and `AppleIcon` components
Build `src/components/StackedInputField.tsx` with stacked label and input layout, lavender focus state, and eye password toggle.
Build `src/components/AppleIcon.tsx` rendering the Apple logo.
Export them in `src/components/index.ts`.

### 2. Redesign Sign-Up Screen (`src/app/(auth)/sign-up.tsx`)
Implement the exact layout from the reference: circular back button, "roam" header, "Create your account" title, stacked inputs for Full name, Email address, Password, "Create account" button with arrow, "or" divider, Google & Apple SSO buttons, and footer link. Wire submit to navigate to `/verify`.

### 3. Build Verification Screen (`src/app/(auth)/verify.tsx`)
Create 6-digit OTP code entry with auto-focus, backspace handling, resend timer, and submit to `/design-system`.

### 4. Redesign Sign-In Screen (`src/app/(auth)/sign-in.tsx`)
Match the visual language: circular back button, "roam" header, "Welcome back" title, stacked inputs for Email address and Password, "Forgot password?" link, "Sign in" button with arrow, Google & Apple SSO buttons, and footer link to Sign up.

### 5. Verification and Closeout
Run `npx tsc --noEmit` and `npx eslint .`.
Test complete end-to-end flow from onboarding through sign-up, verification, and sign-in.

## Verification

- `npx tsc --noEmit` exits with 0.
- `npx eslint .` exits with 0.
- Sign-up matches the reference screenshot (circular back button, stacked label fields, lavender focus outline, yellow button with arrow, Google and Apple buttons).
- Verification screen accepts 6 digits with auto-advance and countdown timer.
- Sign-in matches the new stacked aesthetic and switches smoothly to sign-up.

## AGENTS.md updates

Update "Who owns what" to reflect the authentication screens and verification route in `src/app/(auth)/`.

## Result

- Built `src/components/StackedInputField.tsx` with stacked label and input layout, lavender focus state, and eye password toggle.
- Built `src/components/AppleIcon.tsx` for social auth.
- Redesigned `src/app/(auth)/sign-up.tsx` matching the reference design layout (circular back button, "roam" header, "Create your account" title, stacked inputs, yellow button with arrow, Google and Apple SSO buttons, footer link).
- Built 6-digit OTP verification screen in `src/app/(auth)/verify.tsx` with auto-focus, digit forwarding, backspace navigation, resend countdown timer, and submit navigation.
- Redesigned `src/app/(auth)/sign-in.tsx` with mirrored stacked aesthetics and "Forgot password?" link.
- Verified clean `npx tsc --noEmit` and `npx eslint .`.
