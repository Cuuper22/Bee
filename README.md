## Why

I like the NYT Spelling Bee. I wanted a version with better hints, adjustable difficulty, and actual accessibility (WCAG AAA). Also wanted to build something in React Native that runs everywhere — iOS, Android, web — from a single codebase with 80 tests proving it works.

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
