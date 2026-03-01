## Why

I play Spelling Bee most mornings. At some point I wondered: how hard is it to generate a good puzzle? Turns out, harder than the game itself.

The generator picks 7 random letters (2–3 vowels, 4–5 consonants), designates one as the center letter, then filters a 370,000-word dictionary for valid 4+ letter words that include the center. Most random letter sets produce garbage — either 3 valid words or 400. The quality gates reject anything outside 20–80 valid words with at least one pangram. It takes up to 100 attempts to find a set that makes a good puzzle.

The hint system has five types: word length distribution table, first letter reveal, definitions, two-letter start patterns, and a difficulty meter that splits remaining words into common vs. tricky. Hints are earned by finding words, and the rate scales with difficulty mode — Practice gives unlimited hints, Hard requires 3 words per hint.

Building it cross-platform (iOS, Android, web) with React Native taught me more about state management edge cases than any tutorial. Hexagonal tap targets at 100×110px, haptic feedback on native, full keyboard support on web, screen reader labels on every interactive element. Games are where platform differences stop being theoretical.

# Bee

A Spelling Bee word game. React Native + Expo, runs on iOS, Android, and web.

You get 7 letters. One is the center letter — every word must include it. Find as many 4+ letter words as you can. Pangrams (using all 7 letters) give bonus points. That's it.

## What's Here

- **Honeycomb grid** — tap hexagonal letters to build words
- **370k+ word dictionary** — real dictionary validation, not a toy list
- **5 hint types** — word length table, first letter, definitions, two-letter starts, difficulty meter
- **4 difficulty modes** — Practice (unlimited hints) through Hard (3 words per hint)
- **Persistent state** — close the app, come back, your progress is saved via AsyncStorage
- **Keyboard support** — full A-Z, Enter, Backspace, Space (shuffle) on web
- **Haptic feedback** — on mobile, you feel it
- **Accessibility** — WCAG AAA, 44px+ touch targets, ARIA labels, screen reader friendly

## Scoring

| Word | Points |
|------|--------|
| 4 letters | 1 |
| 5+ letters | 1 per letter |
| Pangram bonus | +7 |

10 ranks from Beginner (0%) to Queen Bee (100% of max score).

## Run It

```bash
pnpm install
pnpm dev
# Metro bundler on :8081 + Express backend
```

Web: `pnpm dev:metro` then open localhost:8081
iOS: `pnpm ios`
Android: `pnpm android`

## Tests

```bash
pnpm test
# 80 tests — game logic, hints, state, puzzle generation, accessibility, performance, keyboard nav
```

9 test files covering:
- Game logic (scoring, validation, ranks) — 16 tests
- Hint system (all 5 types) — 20 tests
- State management (save/load/persistence) — 14 tests
- Puzzle generation (letter mix, word count, pangrams) — 4 tests
- Accessibility, keyboard nav, error handling, performance, UI logic — 26 tests

## Stack

React Native 0.81 + Expo SDK 54, TypeScript 5.9, NativeWind (Tailwind), TanStack Query, Vitest, tRPC + Express backend, Drizzle ORM

## Structure

```
app/           — screens (Expo Router)
components/    — honeycomb grid, modals, score display, etc.
lib/           — game logic, hints, dictionary, state management
lib/__tests__/ — all 80 tests
server/        — Express + tRPC backend
assets/        — dictionary files (words_alpha.txt, dictionary.json)
```

## License

MIT
