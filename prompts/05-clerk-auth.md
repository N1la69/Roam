# 05 · Clerk Authentication Integration

Status: done

## Goal

Integrate Clerk into the Roam application using `@clerk/expo` and `expo-secure-store`, connect to Clerk's MCP server, replace mocked authentication on our custom screens with real Clerk email OTP sign-up, sign-in, and verification code flows, implement persistent keychain sessions, configure protected route guards, and provide a sign-out experience on the authenticated home screen.

## Decisions

- **MCP Server:** Configure Clerk's remote MCP server at `https://mcp.clerk.com/mcp` globally in `~/.gemini/config/mcp_config.json` and in `.agents/mcp_config.json`.
- **SDK & Storage:**
  - Install `@clerk/expo` and `expo-secure-store` via `npx expo install`.
  - Add `"expo-secure-store"` and `"@clerk/expo"` to `app.json` plugins.
  - Wrap root layout in `ClerkProvider` with `tokenCache` from `@clerk/expo/token-cache` for persistent keychain sessions.
- **Environment & Keys:**
  - Pulled development keys from the linked Clerk application (`app_3M97KNldka4oKl0R0KwnQpMLGiX`) into `.env`: `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`.
  - Documented in `.env.example` without values.
  - `.env` excluded in `.gitignore`.
- **Custom Auth Screens (`src/app/(auth)/`):**
  - `sign-up.tsx`:
    - Collects email (and optional name/password).
    - Calls `signUp.create({ emailAddress })` and `signUp.verifications.sendEmailCode()`.
    - Handles errors using Clerk reactive errors (`errors.fields.email_address`, etc.).
    - Navigates to `/(auth)/verify?email=...&flow=sign-up`.
  - `sign-in.tsx`:
    - Prioritizes email OTP: calls `signIn.emailCode.sendCode({ emailAddress })`.
    - Navigates to `/(auth)/verify?email=...&flow=sign-in`.
    - Displays errors from Clerk.
  - `verify.tsx`:
    - Collects 6-digit OTP code using existing stacked boxes.
    - If `flow === "sign-in"`: calls `signIn.emailCode.verifyCode({ code })`.
    - If `flow === "sign-up"`: calls `signUp.verifications.verifyEmailCode({ code })`.
    - On `complete`: calls `finalize({ navigate })` to route into the protected app (`/(home)`).
    - Resend code triggers `signIn.emailCode.sendCode()` or `signUp.verifications.sendEmailCode()`.
- **Protected Routes & Structure:**
  - `src/app/(auth)/_layout.tsx`: Public route guard. When `isLoaded && isSignedIn`, redirects with `<Redirect href="/(home)" />`.
  - `src/app/(home)/_layout.tsx`: Protected route guard. When `isLoaded && !isSignedIn`, redirects with `<Redirect href="/(auth)/sign-in" />`.
  - `src/app/(home)/index.tsx`: Authenticated home screen showing user greeting, current email, rental search bar, listing card, and a Sign Out button calling `useClerk().signOut()`.
  - `src/app/index.tsx`: Onboarding screen. When already signed in, redirects directly to `/(home)`.
- **Sign-Out:**
  - Invokes `signOut()` from `useClerk()`.
  - Token cache is cleared and user is redirected to `/(auth)/sign-in`.

## Out of scope

- Production Apple Developer Team ID configuration (Apple button will note development mode or fall back gracefully).
- SMS phone authentication (using email OTP as requested).

## Steps

### 1. Install dependencies and configure plugins
Install `@clerk/expo` and `expo-secure-store` using `npx expo install`.
Add plugins to `app.json`.

### 2. Configure ClerkProvider & TokenCache in root layout
Update `src/app/_layout.tsx` to wrap the application in `ClerkProvider` with `tokenCache` from `@clerk/expo/token-cache`.

### 3. Implement Clerk custom flows in `src/app/(auth)/`
- Update `sign-up.tsx` using `useSignUp()` with `emailCode`.
- Update `sign-in.tsx` using `useSignIn()` with `emailCode`.
- Update `verify.tsx` to handle code verification for both sign-up and sign-in, with `finalize` and resend logic.

### 4. Create protected group `src/app/(home)/`
- Create `src/app/(home)/_layout.tsx` with layout guard redirecting signed-out users to `/(auth)/sign-in`.
- Create `src/app/(home)/index.tsx` displaying user details (`useUser()`), Roam search & listing cards, and Sign Out action (`useClerk().signOut()`).
- Update `src/app/(auth)/_layout.tsx` to redirect signed-in users to `/(home)`.
- Update `src/app/index.tsx` onboarding to redirect signed-in users to `/(home)`.

### 5. Verification and Closeout
Run `npx tsc --noEmit` and `npx eslint .`.
Verify full end-to-end auth loop: Onboarding -> Sign up -> Code verification -> Protected home -> Sign out.

## Verification

- `npx tsc --noEmit` exits with 0.
- `npx eslint .` exits with 0.
- App mounts `ClerkProvider` with persistent `tokenCache` without errors.
- Unauthenticated users cannot access `/(home)` and are redirected to sign-in.
- Authenticated users cannot access `/(auth)` and are redirected to `/(home)`.
- Sign-out terminates the session and returns user to sign-in.

## AGENTS.md updates

Update "Who owns what" and "Rules" with Clerk Expo provider, tokenCache, and route protection pattern.

## Result

Integrated `@clerk/expo` with `expo-secure-store` token caching in `src/app/_layout.tsx`. Replaced mock authentication in `src/app/(auth)/sign-up.tsx`, `src/app/(auth)/sign-in.tsx`, and `src/app/(auth)/verify.tsx` with Clerk's modern method-based API (`signUp.create`, `signUp.verifications.sendEmailCode`/`verifyEmailCode`, `signIn.emailCode.sendCode`/`verifyCode`, `finalize`). Added route guards in `src/app/(auth)/_layout.tsx`, `src/app/(home)/_layout.tsx`, and `src/app/index.tsx`. Built protected home screen in `src/app/(home)/index.tsx` featuring user greeting, session badge, rental search, listing preview, and sign-out. All type checks and lint checks pass cleanly.
