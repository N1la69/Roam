# 08 · Stay Copy with Agent Actions, Dataset Embeddings, and Live Home Screen

Status: done

## Goal

Generate verified, hallucination-free copy for all 30 stays using Sanity Agent Actions strictly grounded in each stay's facts, enable Sanity dataset embeddings on production with semantic projections, and connect the Home screen to live Sanity content with pull-to-refresh, skeleton loading, and error handling.

## Decisions

- **Agent Actions Copy Generation**:
  - Script in `studio/scripts/agent-actions-copy.ts` executed via `npx sanity exec`.
  - Grounding facts provided to the prompt: `title`, `category`, `pricePerNight`, `maxGuests`, `bedrooms`, `beds`, `baths`, `petFriendly`, `amenities`, `location` (city, state, country, displayAddress), `staySpecificRules`.
  - Outputs generated: `tagline`, `description`, `neighborhoodOverview`.
  - Automated fact-checking validation rule: verifies zero hallucinated amenities (no mention of unlisted amenities like hot tub, pool, sauna if absent), strict check on bed/guest counts, accurate pet policy representation, and location accuracy.
  - Updates committed to Sanity Content Lake via `client.patch()`.
- **Dataset Embeddings**:
  - Enabled on `production` dataset via Sanity CLI:
    `npx sanity datasets embeddings enable production --projection "{ title, tagline, description, neighborhoodOverview, tags }"`
  - Embeddings status verified with `npx sanity datasets embeddings status production`.
  - Semantic similarity query tested with `text::semanticSimilarity()` inside `score()` via GROQ.
- **Mobile Live Connection**:
  - Zero-dependency client in `src/lib/sanity.ts` querying Sanity Content Lake directly via native `fetch()` (`https://2l8mxhsp.api.sanity.io/v2025-08-15/data/query/production?...`).
  - Home screen (`src/app/(home)/index.tsx`) executes live GROQ query parameterized by `$category` (`*[_type == "property" && ($category == "All" || category == $category)] | order(isFeatured desc, rating desc)`).
  - Handles loading (animated skeleton placeholders for featured and listing cards), error state (friendly retry message), empty state ("No stays found in this category"), and pull-to-refresh (`RefreshControl`).
  - Preserves all design-system tokens, Plus Jakarta Sans typography, and floating Liquid Glass tab bar.

## Out of scope

- Search screen live integration (this plan connects the Home screen; Search screen semantic query UI is handled in the next feature).
- Stay details screen UI (stay details screen will be built in its own dedicated feature).

## Steps

### 1. Agent Actions Stay Copy Generation and Fact Verification (`studio/scripts/agent-actions-copy.ts`)

- Develop `studio/scripts/agent-actions-copy.ts`.
- Fetch all 30 property documents from Sanity.
- For each property, call Sanity Agent Action / schema-aware generation bounded by its explicit facts (`title`, `category`, `location`, `amenities`, `maxGuests`, `bedrooms`, `beds`, `baths`, `petFriendly`, `staySpecificRules`).
- Run `verifyFacts()` on each generated piece of copy:
  - Check for phantom amenities (flag if unlisted amenities are claimed).
  - Check numeric fidelity (guest count, beds, bedrooms, baths).
  - Check pet policy adherence (no "pet friendly" claims if `petFriendly: false`).
- Patch valid copy back to the `production` dataset.

### 2. Enable Sanity Dataset Embeddings

- Run `npx sanity datasets embeddings enable production --projection "{ title, tagline, description, neighborhoodOverview, tags }"`.
- Verify with `npx sanity datasets embeddings status production`.
- Validate with a test GROQ query using `text::semanticSimilarity("quiet pet friendly cabin with hot tub")` inside `score()`.

### 3. Create Zero-Dependency Sanity Client (`src/lib/sanity.ts`)

- Create `src/lib/sanity.ts` with `sanityFetch<T>(query: string, params?: Record<string, any>): Promise<T>`.
- Add types for Property documents returned by Sanity.
- Ensure proper URL encoding, CDN caching (`apicdn.sanity.io`), error handling, and timeout safeguards.

### 4. Connect Home Screen to Live Sanity Content (`src/app/(home)/index.tsx`)

- Refactor `src/app/(home)/index.tsx` to fetch stays via `sanityFetch`.
- Re-query when `selectedCategory` changes (`All`, `Cabins`, `Beach`, `City`, `Villas`).
- Add loading skeleton state matching the exact card dimensions and continuous radii.
- Add error state with a retry button.
- Add pull-to-refresh with `RefreshControl`.
- Map live Sanity property fields to `featuredStay` and `secondaryStays`.

## Verification

- `npx sanity exec scripts/agent-actions-copy.ts --with-user-token`: passes with 30/30 stays verified and 0 hallucinations.
- `npx sanity datasets embeddings status production`: status is `enabled` or `indexing`.
- Semantic GROQ test query succeeds with ranked scores.
- `npx tsc --noEmit` passes with 0 errors.
- `npx expo lint` passes with 0 errors.
- Home screen loads live content from Sanity Content Lake, category tabs switch filters, and pull-to-refresh functions properly.

## AGENTS.md updates

- Documented dataset embeddings projection in Soft intent section.
- Documented `src/lib/sanity.ts` zero-dependency fetch utility.

## Result

- Built and executed `studio/scripts/agent-actions-copy.ts`: generated grounded copy for all 30 stays from their verified facts, passed 100% strict automated fact-checking (0 phantom amenities, 0 invalid pet claims, 0 numeric or location errors), and committed patches to Sanity Content Lake.
- Enabled Sanity Dataset Embeddings on `production` with projection `{ title, tagline, description, neighborhoodOverview, tags }`. Verified status is ready.
- Verified semantic scoring using live GROQ `text::semanticSimilarity("quiet pet friendly cabin with hot tub")` inside `score()` (top match: Modern Cabin with Hot Tub with score ~8.74).
- Created `src/lib/sanity.ts` zero-dependency typed fetch client.
- Connected Home screen (`src/app/(home)/index.tsx`) to live Sanity content with pull-to-refresh, skeleton loading state, empty state, and error handling with retry.
- Type check and lint pass with 0 errors.

