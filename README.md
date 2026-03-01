# Bee - Spelling Bee Game

A cross-platform Spelling Bee word game built with React Native and Expo. Find words using 7 letters, with one letter required in every word. Test your vocabulary skills across multiple difficulty modes.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Tests](https://img.shields.io/badge/tests-80%20passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)
![Production](https://img.shields.io/badge/production-ready-success)

## Features

### Core Gameplay
- **Honeycomb Interface**: Tap hexagonal letters to form words
- **Word Validation**: Real-time checking against a comprehensive dictionary (370k+ words)
- **Scoring System**: 
  - 4-letter words: 1 point
  - 5+ letter words: 1 point per letter
  - Pangrams (using all 7 letters): +7 bonus points
- **Rank Progression**: 10 ranks from Beginner to Queen Bee
- **Found Words Tracking**: Keep track of all discovered words

### Difficulty Modes
- **Practice**: Unlimited hints for learning
- **Easy**: 1 hint per word found
- **Normal**: 1 hint per 2 words found (default)
- **Hard**: 1 hint per 3 words found

### Hint System
Five types of hints to help you progress:
- **Word Length**: Table showing how many words of each length exist
- **First Letter**: Reveals the first letter of a random word
- **Definition**: Shows the definition and a rhyme for a word
- **Two-Letter Start**: Reveals the first two letters of a word
- **Difficulty Meter**: Shows count of common vs. tricky words

### UI/UX Polish
- **Persistent State**: Game automatically saves progress via AsyncStorage
- **Error Boundary**: Graceful error handling with recovery options
- **Animations**: Smooth transitions, success messages, confetti for pangrams
- **Haptic Feedback**: Tactile response on mobile devices
- **Keyboard Support**: Full keyboard controls on web (Enter, Backspace, Space, A-Z)
- **Accessibility**: WCAG AAA compliant, proper ARIA labels, 44px+ touch targets
- **Sound Toggle**: Optional audio feedback
- **Shuffle**: Rearrange outer letters for fresh perspective

## Tech Stack

- **Frontend**: React Native 0.81.5 + Expo SDK 54
- **Navigation**: Expo Router 6
- **Styling**: Tailwind CSS via NativeWind 4
- **State Management**: TanStack Query (React Query)
- **Backend**: Express.js + tRPC for type-safe API
- **Database**: MySQL via Drizzle ORM
- **Testing**: Vitest (80 tests: unit, integration, accessibility, performance)
- **Language**: TypeScript 5.9
- **Error Handling**: React Error Boundary for crash recovery

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm 9+ (or npm/yarn)
- iOS Simulator (for iOS) or Android Studio (for Android)

### Installation

```bash
# Clone the repository
git clone https://github.com/Cuuper22/Bee.git
cd Bee

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

This will start:
- Metro bundler on port 8081 (configurable via `EXPO_PORT`)
- Express backend in watch mode

### Running on Devices

#### Web
```bash
pnpm dev:metro
# Open http://localhost:8081 in your browser
```

#### iOS
```bash
pnpm ios
# or: npx expo run:ios
```

#### Android
```bash
pnpm android
# or: npx expo run:android
```

#### Expo Go (Quick Preview)
```bash
npx expo start
# Scan QR code with Expo Go app
```

## Project Structure

```
Bee/
├── app/                    # React Native screens (Expo Router)
│   ├── (tabs)/            # Tab-based navigation
│   │   └── index.tsx      # Main game screen
│   └── _layout.tsx        # Root layout
├── components/            # Reusable UI components
│   ├── honeycomb-grid.tsx # Hexagonal letter grid
│   ├── hint-modal.tsx     # Hint selection UI
│   ├── score-display.tsx  # Score and rank tracker
│   └── ...
├── lib/                   # Game logic and utilities
│   ├── game-logic.ts      # Core puzzle/validation logic
│   ├── hint-system.ts     # Hint generation
│   ├── game-state.ts      # AsyncStorage persistence
│   ├── dictionary-service.ts # Word list loading
│   └── __tests__/         # Unit tests (54 tests)
├── assets/                # Static files
│   ├── words_alpha.txt    # Dictionary (370k+ words)
│   └── dictionary.json    # Word definitions
├── server/                # Express backend (tRPC)
├── drizzle/               # Database migrations
└── tests/                 # Integration tests
```

## Game Rules

1. **Word Requirements**:
   - Minimum 4 letters
   - Must include the center letter
   - Can only use the 7 available letters
   - Letters can be repeated

2. **Scoring**:
   - 4-letter word = 1 point
   - 5+ letter word = word length in points
   - Pangram (all 7 letters) = +7 bonus

3. **Ranks** (based on % of max score):
   - Beginner (0%)
   - Good Start (2%)
   - Moving Up (5%)
   - Good (8%)
   - Solid (15%)
   - Nice (25%)
   - Great (40%)
   - Amazing (50%)
   - Genius (70%)
   - Queen Bee (100%)

## Testing

Run the test suite:
```bash
pnpm test
```

Current test coverage:
- 80 passing tests
- Unit tests for game logic, hint system, state management
- Integration tests for puzzle generation
- Accessibility and keyboard navigation tests
- Performance optimization tests
- UI component logic tests
- Error handling tests

Run type checking:
```bash
pnpm check
```

## Scripts

- `pnpm dev` - Start Metro bundler + backend
- `pnpm test` - Run test suite
- `pnpm check` - TypeScript type checking
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm ios` - Run on iOS simulator
- `pnpm android` - Run on Android emulator
- `pnpm build` - Build backend for production

## Configuration

### Environment Variables
Create a `.env` file in the root:
```env
EXPO_PORT=8081
NODE_ENV=development
DATABASE_URL=mysql://user:pass@localhost:3306/bee
```

### App Configuration
Edit `app.config.ts` to customize app name, icon, colors, etc.

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`pnpm test`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details

## Acknowledgments

- Dictionary sourced from [dwyl/english-words](https://github.com/dwyl/english-words)
- Inspired by The New York Times Spelling Bee
- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)

## Support

- Report bugs: [GitHub Issues](https://github.com/Cuuper22/Bee/issues)
- Questions: Open a discussion on GitHub

---

Built with ❤️ by Cuuper22
