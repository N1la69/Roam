# 10 · Ask About This Stay Chat Screen

Status: done

## Goal

Build the "Ask about this stay" chat screen (`src/app/stay/[id]/ask.tsx`) opened from the property details screen, allowing guests to ask questions about booking, policies, amenities, and house rules. Display each reply as structured topic answer cards with clear source labels (strictly no hallucinated paragraphs), enable topic chips to immediately send questions when tapped, and style the input with a message icon using realistic sample messages and stay data.

## Decisions

- **Route & Navigation**:
  - File: `src/app/stay/[id]/ask.tsx` inside the root Expo Router Stack.
  - Linked from `src/app/stay/[id].tsx` via the "Ask about policies" card (`router.push('/stay/' + stay._id + '/ask')`).
  - Top header includes back button (`router.back()`), property/host avatar, title ("Ask about this stay"), and a "Verified stay facts" badge.
- **Answer Presentation (Strict Word-for-Word Topic Cards)**:
  - In alignment with Roam core policy: *"Answer text: none generated. Answers show the stay's own fields and policy text word for word, with their source. No LLM runs in the app."*
  - Instead of conversational prose or written paragraphs, assistant responses render as **structured topic answer cards**:
    - **Topic Header**: Policy/topic badge with icon (`shield` for Cancellation, `clock` for Check-in, `paw` for Pets, `file-text` for House Rules, `hot-tub` for Hot Tub/Amenities).
    - **Topic Title**: Bold headline (e.g. "Cancellation Policy", "House Rules & Quiet Hours", "Self Check-In", "Pet Guidelines").
    - **Verbatim Policy Text**: The exact text from the stay's Sanity policies or property fields.
    - **Source Label Badge**: Prominently displayed source footer, e.g. `Source: Moderate Cancellation Policy (Roam Terms)` or `Source: Stay House Rules & Amenities Specification`.
- **Topic Quick-Prompt Chips**:
  - Horizontal chip scroll bar displaying popular questions:
    - `Cancellation policy`
    - `Check-in & checkout`
    - `Pet friendly?`
    - `Quiet hours & parties`
    - `Hot tub guidelines`
    - `Wi-Fi details`
  - Tapping a chip immediately posts that question as a user message and triggers the corresponding structured topic answer card(s).
- **Chat Input Bar**:
  - Left icon inside the input: Message icon (`Ionicons name="chatbubble-ellipses-outline"`).
  - Placeholder: `Ask a question about this stay...`.
  - Right action button: Circular send button (`Feather name="arrow-up"` or `Feather name="send"`) in brand primary color.
  - Keyboard avoiding container for iOS and responsive layout for web/mobile.
- **Sample Messages & Local Matching**:
  - Initial conversation starts with a welcoming system message and quick guidance.
  - When a guest submits a question (or taps a chip), the screen matches topics against the current stay's live Sanity policies (`policies[]`) and property details (`staySpecificRules`, `amenities`, `checkInTime`, `checkOutTime`, `cancellation`).
  - If a topic matches, it renders the exact factual answer card with source label.
  - If no topic matches, it provides a factual "Not specified in stay data" card with guidance to contact Roam support or host directly.
- **Analytics & Tracking**:
  - Track `ask_chat_opened` with `{ stay_id: stay._id, title: stay.title }`.
  - Track `ask_question_sent` with `{ stay_id: stay._id, query: string, source: 'chip' | 'input' }`.
  - Track `ask_topic_card_viewed` with `{ stay_id: stay._id, topic: string }`.

## Out of scope

- Live TypeSafe AI Jev integration / Sanity Context backend endpoint (user requested: *"Use sample messages for now with no backend"*).
- Direct host-to-guest peer-to-peer messaging (this screen is dedicated to stay policy & factual Q&A).

## Steps

### 1. Build Stay Chat Screen (`src/app/stay/[id]/ask.tsx`)
- Implement the full screen with:
  - Header: Back button `<` + Host/stay miniature thumbnail + title and subtitle.
  - Chat message list with user query bubbles and assistant reply cards.
  - Topic Answer Card component with topic icon, badge, verbatim content, and source attribution label.
  - Quick-prompt topic chips horizontal scroller.
  - Input field featuring message icon on the left, clear button, and send button on the right.
  - KeyboardAvoidingView / safe area padding.
  - Keyword/topic resolver mapping questions to the stay's Sanity data.

### 2. Connect Entry Point in Property Details (`src/app/stay/[id].tsx`)
- Update the first lavender card on `src/app/stay/[id].tsx`:
  - Change `onPress={() => openPolicies("house_rules")}` to `onPress={() => router.push(("/stay/" + stay._id + "/ask") as any)}`.
  - Keep the cancellation policy card opening `PolicyModal` for instant direct modal viewing.

### 3. Verification & Testing
- Run `npx tsc --noEmit` to verify type safety.
- Run `npx eslint` on `src/app/stay/[id]/ask.tsx` and `src/app/stay/[id].tsx`.
- Test opening the chat from the property details screen.
- Test tapping each topic chip (Cancellation, Check-in, Pets, House rules, Hot tub) and verifying structured answer card generation.
- Test typing custom questions in the input.

## Verification

- `npx tsc --noEmit` passes with 0 errors.
- `npx eslint` passes with 0 errors.
- Tapping "Ask about policies" on property details opens `/stay/[id]/ask`.
- Tapping topic chips sends questions and renders topic answer cards with source labels.
- Message icon is visible inside the chat input.
- Typing in the input and pressing send generates the corresponding topic answer card.

## AGENTS.md updates

- Document `src/app/stay/[id]/ask.tsx` in Navigation and Policy knowledge sections.

## Result

- Built the complete "Ask about this stay" chat screen at `src/app/stay/[id]/ask.tsx`.
- Implemented structured topic answer cards with verbatim policy and stay content alongside source labels (no hallucinated paragraphs).
- Enabled 6 quick-prompt topic chips that immediately submit questions when tapped.
- Styled input pill with message icon (`Ionicons chatbubble-ellipses-outline`), clear button, and send button.
- Wired entry navigation from the "Ask about policies" card on `src/app/stay/[id].tsx`.
- Added PostHog analytics for screen opening and question submissions.
- Verified TypeScript (`npx tsc --noEmit`) and ESLint (`npx eslint src/`) with 0 errors.
