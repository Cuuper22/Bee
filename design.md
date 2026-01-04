# Spelling Bee Game - Mobile Interface Design

## Design Philosophy
This app follows Apple Human Interface Guidelines (HIG) to feel like a first-party iOS app. The design assumes **mobile portrait orientation (9:16)** and **one-handed usage**.

## Color Palette
- **Background**: Dark gray-900 (#111827) - main app background
- **Center Hexagon**: Yellow-400 (#F6C915) - required letter highlight
- **Outer Hexagons**: Gray-600 (#4B5563) - optional letters
- **Text**: White/Gray-300 for readability on dark background
- **Accents**: 
  - Purple for hints
  - Green for success messages
  - Red for error messages
  - Gold for pangrams

## Screen List

### 1. Home Screen (Main Game)
**Primary Content:**
- Honeycomb hexagon grid (7 hexagons: 1 center + 6 outer)
- Current word input display
- Score display with progress bar
- Current rank indicator
- Found words list (scrollable)
- Control buttons (Enter, Delete, Shuffle)

**Key Functionality:**
- Tap hexagons to build words
- Keyboard input support
- Submit words with Enter
- Delete letters with backspace
- Shuffle outer hexagons
- View found words
- Track score and rank progress

**Layout:**
- Top: Score, rank, and progress bar
- Middle: Honeycomb grid (largest touch targets)
- Below grid: Current word display
- Below word: Control buttons (Enter, Delete, Shuffle)
- Bottom: Found words list (collapsible)

### 2. Difficulty Selection Modal
**Primary Content:**
- List of difficulty modes (Practice, Easy, Normal, Hard)
- Description of hint unlock rates
- Current selection indicator

**Key Functionality:**
- Select difficulty mode
- See hint unlock rate explanation
- Confirm selection

### 3. Hint Modal
**Primary Content:**
- 5 hint type buttons:
  1. Word Length Table
  2. First Letter
  3. Definition
  4. Two-Letter Start
  5. Difficulty Meter
- Hint counter display
- Hint result display area

**Key Functionality:**
- Select hint type
- Display hint information
- Track remaining hints
- Close modal

### 4. Settings Modal
**Primary Content:**
- New puzzle button
- Difficulty mode selector
- Sound toggle
- Haptics toggle
- Dark mode toggle (optional)

**Key Functionality:**
- Generate new puzzle
- Change difficulty
- Toggle preferences

### 5. Success Animations
**Primary Content:**
- Confetti animation for pangrams
- Success messages for valid words
- Rank-up celebration

**Key Functionality:**
- Visual feedback for achievements
- Motivational messaging

## Key User Flows

### Flow 1: Start New Game
1. User opens app → Home screen loads
2. App generates puzzle (7 letters, validates word list)
3. Loading animation (flying bees) displays
4. Game board appears with honeycomb grid

### Flow 2: Play Word
1. User taps hexagons or types on keyboard → Letters appear in word display
2. User taps "Enter" or presses Enter key → Word validates
3. If valid:
   - Word added to found words list
   - Score updates with animation
   - Progress bar advances
   - Success message displays
   - If pangram: confetti animation plays
   - Hint counter increments (based on difficulty)
4. If invalid:
   - Error message displays (shake animation)
   - Word clears after 1 second

### Flow 3: Use Hint
1. User taps hint button → Hint modal opens
2. User sees available hints count
3. User taps hint type → Hint information displays
4. Hint counter decrements
5. User closes modal → Returns to game

### Flow 4: Shuffle Letters
1. User taps "Shuffle" or presses spacebar
2. Outer hexagons rearrange with animation
3. Center letter stays fixed

### Flow 5: New Puzzle
1. User opens settings → Taps "New Puzzle"
2. Confirmation prompt appears
3. User confirms → New puzzle generates
4. Game resets with new letters

## Interaction Design

### Touch Targets
- Hexagons: 70x70pt minimum (large enough for one-handed tapping)
- Control buttons: 44x44pt minimum (iOS standard)
- Hint buttons: Full width, 50pt height

### Animations
- Hexagon press: Scale to 0.95 with 80ms duration
- Letter entry: Fade in with 150ms duration
- Word submission: Slide up with 200ms duration
- Shuffle: Rotate and reposition with 300ms duration
- Success message: Fade in/out with 250ms duration
- Pangram confetti: 2-second burst animation
- Progress bar: Smooth width transition with 400ms duration

### Haptic Feedback
- Hexagon tap: Light impact
- Valid word: Success notification
- Invalid word: Error notification
- Pangram: Heavy impact
- Rank up: Success notification

## Technical Notes

### Data Storage
- Use AsyncStorage for:
  - Current puzzle state
  - Found words
  - Score and rank
  - User preferences (difficulty, sound, haptics)
  - Statistics (total words found, pangrams, etc.)

### Performance
- Pre-generate word list on puzzle creation
- Cache dictionary in memory
- Lazy load found words list (only render visible items)
- Optimize animations with react-native-reanimated

### Accessibility
- Large touch targets for one-handed use
- High contrast colors
- Clear visual feedback
- Keyboard support for typing
- VoiceOver support for screen readers
