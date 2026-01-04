/**
 * Game state management with AsyncStorage persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Puzzle, DifficultyMode, DIFFICULTY_CONFIGS } from './game-logic';

const STORAGE_KEY = '@spelling_bee_game_state';
const PREFERENCES_KEY = '@spelling_bee_preferences';

export interface Preferences {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  difficulty: DifficultyMode;
}

const DEFAULT_PREFERENCES: Preferences = {
  soundEnabled: true,
  hapticsEnabled: true,
  difficulty: 'normal',
};

/**
 * Save game state to AsyncStorage
 */
export async function saveGameState(state: GameState): Promise<void> {
  try {
    const jsonValue = JSON.stringify(state);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/**
 * Load game state from AsyncStorage
 */
export async function loadGameState(): Promise<GameState | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue === null) {
      return null;
    }
    return JSON.parse(jsonValue);
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

/**
 * Clear game state from AsyncStorage
 */
export async function clearGameState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
}

/**
 * Save preferences to AsyncStorage
 */
export async function savePreferences(preferences: Preferences): Promise<void> {
  try {
    const jsonValue = JSON.stringify(preferences);
    await AsyncStorage.setItem(PREFERENCES_KEY, jsonValue);
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}

/**
 * Load preferences from AsyncStorage
 */
export async function loadPreferences(): Promise<Preferences> {
  try {
    const jsonValue = await AsyncStorage.getItem(PREFERENCES_KEY);
    if (jsonValue === null) {
      return DEFAULT_PREFERENCES;
    }
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(jsonValue) };
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Create initial game state
 */
export function createInitialGameState(puzzle: Puzzle, difficulty: DifficultyMode): GameState {
  return {
    puzzle,
    foundWords: [],
    score: 0,
    rank: 'Beginner',
    hintsAvailable: difficulty === 'practice' ? 999 : 0,
    difficulty,
  };
}

/**
 * Calculate hints available based on difficulty and words found
 */
export function calculateHintsAvailable(
  wordsFound: number,
  difficulty: DifficultyMode,
  hintsUsed: number = 0
): number {
  const config = DIFFICULTY_CONFIGS[difficulty];
  
  if (config.wordsPerHint === 0) {
    return 999; // Unlimited
  }
  
  const hintsEarned = Math.floor(wordsFound / config.wordsPerHint);
  return Math.max(0, hintsEarned - hintsUsed);
}
