# Bee

A spelling bee game. You get some letters, you make words. That is it.

Built with React Native (Expo) so it runs on iOS, Android, and web from the same codebase.

## Running It

```bash
pnpm install
pnpm dev
```

This starts both the Express backend and Expo dev server. The app opens on web at localhost:8081. For mobile, scan the QR code with Expo Go or run `pnpm android` / `pnpm ios`.

### Other Commands

```bash
pnpm test          # vitest
pnpm lint          # eslint
pnpm format        # prettier
pnpm db:push       # generate + run drizzle migrations
pnpm check         # typecheck
```

## Tech Stack

- **App**: React Native 0.81 + Expo 54, NativeWind (Tailwind for RN), expo-router
- **Server**: Express + tRPC
- **Database**: MySQL via Drizzle ORM
- **State**: TanStack Query + tRPC React Query
- **Auth**: JWT (jose)
- **Testing**: Vitest
- **Deploy**: Expo EAS

## Project Structure

```
app/           # Expo Router pages (tabs, oauth, dev tools)
components/    # UI - honeycomb grid, word display, score, hints, settings
hooks/         # useAuth, useColors, useColorScheme
server/        # Express + tRPC routers, Drizzle DB config
shared/        # Shared types/utils between app and server
lib/           # Client-side tRPC setup
drizzle/       # Migration files
scripts/       # QR code generator, utilities
tests/         # Test files
```

## How It Works

You get a honeycomb grid of letters with one required center letter. Find as many valid words as you can using those letters. Words must be 4+ letters and always include the center letter. Letters can be reused.

Difficulty settings, score tracking, hints if you get stuck.

## License

MIT
