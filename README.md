# Bee

Cross-platform spelling bee game. React Native (Expo) frontend, Express backend, MySQL database.

## What It Is

A mobile spelling bee app. Words come at you, you spell them, you get points. Built as a monorepo with a shared TypeScript codebase.

## Stack

- **Frontend**: React Native + Expo (iOS, Android, web)
- **Backend**: Express.js + tRPC (type-safe API)
- **Database**: MySQL via Drizzle ORM
- **Testing**: Vitest
- **Styling**: Tailwind CSS (NativeWind)
- **State**: TanStack Query

## Running It

```bash
pnpm install
pnpm dev          # starts Metro bundler + backend
```

For native builds:
```bash
npx expo run:ios
npx expo run:android
```

## Project Structure

```
Bee/
  app/          # React Native screens + navigation
  server/       # Express backend + Drizzle ORM
  components/   # Shared UI components
  hooks/        # Custom React hooks
  lib/          # Utilities
  drizzle/      # DB migrations
```

## License

MIT
