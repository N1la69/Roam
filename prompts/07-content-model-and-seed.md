# 07 · Content Model and Seeding

Status: done

## Goal

Design and deploy a comprehensive Sanity content model for Roam (stays, hosts, and shared policies) matching existing screens, search requirements, and detail view specifications, and seed 30 realistic, diverse stays safe to run idempotently.

## Decisions

- **Property schema (`property`)**:
  - Exact filter fields (typed): `category` (Cabins | Beach | City | Villas), `pricePerNight` (number), `cleaningFee` (number), `maxGuests` (number), `bedrooms` (number), `beds` (number), `baths` (number), `petFriendly` (boolean), `amenities` (array of strings with predefined options matching filters: `hot_tub`, `pet_friendly`, `pool`, `fast_wifi`, `ev_charger`, `fireplace`, `ac`, `workspace`, `sauna`, `mountain_view`, `oceanfront`, `patio`, etc.).
  - Structured location: `location` object containing `city`, `stateOrProvince`, `country`, `displayAddress` (e.g. "Lake Arrowhead, CA"), and `coordinates` (`geopoint`).
  - Descriptive ranking fields directly on property (for dataset embeddings via `text::semanticSimilarity()` inside `score()`): `title`, `tagline`, `description`, `neighborhoodOverview`, and `tags` (e.g. "quiet", "cozy", "secluded", "stargazing", "minimalist", "scandinavian").
  - Media: `mainImage` (image with alt and hotspot) and `gallery` (array of images with alt text).
  - Check-in/out: `checkInTime` (e.g. "3:00 PM") and `checkOutTime` (e.g. "11:00 AM").
  - References: `host` (reference to `host`), `policies` (array of references to `policy`), and `staySpecificRules` (array of strings).
  - Social proof: `rating` (number) and `reviewsCount` (number), `isFeatured` (boolean).
- **Host schema (`host`)**:
  - Shared reusable document referenced by properties.
  - Fields: `name`, `slug`, `avatar` (image), `bio` (text), `isSuperhost` (boolean), `rating` (number), `reviewsCount` (number), `responseRate` (string), `responseTime` (string), `joinedDate` (string).
- **Policy schema (`policy`)**:
  - Shared document referenced by properties and ready for Sanity Context Knowledge Base (AI policy Q&A).
  - Fields: `title`, `slug`, `policyType` (cancellation, house_rules, check_in, safety, pet_policy), `summary` (short overview for cards), `content` (exact text for policy answers), `icon` (string for UI icon mapping).
- **Idempotent seeding**:
  - Script in `studio/scripts/seed.ts` (or `scripts/seed-sanity.ts`).
  - Uses `@sanity/client`. To respect "Let Sanity generate document IDs", the seed script queries documents by unique `slug.current` or `seedKey`: if a document already exists, it updates/patches it; if it does not exist, it creates it with `client.create()`.
  - Seeds 6-8 diverse hosts, 6 core policies, and 30 realistic stays across Cabins, Beach, City, and Villas with high-quality Unsplash imagery.
- **Sanity deployment**:
  - Export schemas in `studio/schemaTypes/index.ts` and register in `studio/sanity.config.ts`.
  - Validate schema definitions with `sanity typegen` or schema build.
  - Studio can be deployed via `npx sanity deploy` or verified with `npm run build` in `studio/`.

## Out of scope

- Building the stay details screen UI (this plan only defines the data model and seeds the data).
- Replacing local mockup data in `src/app/(home)/index.tsx` with live Sanity GROQ fetching (handled in the upcoming search/data fetching feature).
- Embedding dataset indexing / Sanity Context Knowledge Base endpoint setup (separate AI integration step).

## Steps

### 1. Define Sanity Schemas (`studio/schemaTypes/`)

Create schema definitions following Sanity best practices (`defineType`, `defineField`, `defineArrayMember`, strict typing, icons from `@sanity/icons`):
- `studio/schemaTypes/property.ts`: The main stay schema with typed filter fields, embeddings text, media gallery, and references.
- `studio/schemaTypes/host.ts`: The shared host profile schema.
- `studio/schemaTypes/policy.ts`: The shared policy document schema.
- `studio/schemaTypes/objects/location.ts`: Reusable location object with coordinates.
- Register all schemas in `studio/schemaTypes/index.ts` and ensure `studio/sanity.config.ts` compiles cleanly.

### 2. Verify Studio Build and TypeCheck

- Run `npm run build` in `studio/` to verify schema compilation and syntax.
- Verify TypeScript types compile with no errors.

### 3. Create Idempotent Seed Script (`studio/scripts/seed.ts`)

- Develop `studio/scripts/seed.ts` containing:
  - 6 shared policies (Flexible Cancellation, Moderate Cancellation, Strict Cancellation, Quiet Hours & House Rules, Pet Guidelines, Smoke-Free Property).
  - 6-8 shared hosts with authentic bios, superhost badges, response rates, and avatar images.
  - 30 realistic stays with rich descriptions (quiet cabins, beach cottages, city skyline lofts, luxury desert villas), typed amenities, exact prices, guest capacities, and coordinates.
- Idempotency logic: checks existing documents by `slug.current`; updates if found, creates if missing.
- Reads `SANITY_API_WRITE_TOKEN` or active CLI session token to execute mutations via `@sanity/client`.

### 4. Execute Seeding & Validate Content

- Run seed script against the `production` dataset (`projectId: '2l8mxhsp'`).
- Verify via GROQ queries that exactly 30 stays, 6-8 hosts, and 6 policies exist and references resolve correctly.
- Re-run the seed script a second time to verify idempotency (ensuring count remains 30 stays, 0 duplicate records).

## Verification

- `studio` schema builds without errors (`npm run build` in `studio`).
- GROQ query checks:
  - `count(*[_type == "property"]) == 30`
  - `count(*[_type == "host"]) >= 6`
  - `count(*[_type == "policy"]) >= 6`
  - All properties resolve their `host->` reference and `policies[]->` references.
  - All properties have required typed filter fields (`pricePerNight`, `maxGuests`, `bedrooms`, `baths`, `petFriendly`, `amenities`, `category`).
- Re-running the seed script completes with 0 duplicates created.

## AGENTS.md updates

- Documented `property`, `host`, and `policy` schemas and `studio/scripts/seed.ts` in Content section.

## Result

- Created `property`, `host`, `policy`, and `location` schemas in `studio/schemaTypes/`.
- Verified Studio build passes cleanly (`sanity build`).
- Implemented and executed idempotent seed script (`studio/scripts/seed.ts`).
- Seeded 6 shared policies, 6 shared hosts, and 30 realistic stays across Cabins, Beach, City, and Villas with full metadata and Unsplash imagery.
- Confirmed idempotency: running the seed a second time resulted in 0 duplicates (0 created, 30 updated).

