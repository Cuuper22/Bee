/**
 * Game logic for Spelling Bee puzzle generation and word validation
 */

export interface Puzzle {
  letters: string[]; // 7 letters: [centerLetter, ...outerLetters]
  centerLetter: string;
  outerLetters: string[];
  validWords: string[];
  pangrams: string[];
  maxScore: number;
}

export interface GameState {
  puzzle: Puzzle | null;
  foundWords: string[];
  score: number;
  rank: string;
  hintsAvailable: number;
  difficulty: DifficultyMode;
}

export type DifficultyMode = 'practice' | 'easy' | 'normal' | 'hard';

export interface DifficultyConfig {
  name: string;
  description: string;
  wordsPerHint: number; // 0 means unlimited
}

export const DIFFICULTY_CONFIGS: Record<DifficultyMode, DifficultyConfig> = {
  practice: {
    name: 'Practice',
    description: 'Unlimited hints',
    wordsPerHint: 0,
  },
  easy: {
    name: 'Easy',
    description: '1 word = 1 hint',
    wordsPerHint: 1,
  },
  normal: {
    name: 'Normal',
    description: '2 words = 1 hint',
    wordsPerHint: 2,
  },
  hard: {
    name: 'Hard',
    description: '3 words = 1 hint',
    wordsPerHint: 3,
  },
};

export const RANKS = [
  { name: 'Beginner', threshold: 0 },
  { name: 'Good Start', threshold: 0.02 },
  { name: 'Moving Up', threshold: 0.05 },
  { name: 'Good', threshold: 0.08 },
  { name: 'Solid', threshold: 0.15 },
  { name: 'Nice', threshold: 0.25 },
  { name: 'Great', threshold: 0.4 },
  { name: 'Amazing', threshold: 0.5 },
  { name: 'Genius', threshold: 0.7 },
  { name: 'Queen Bee', threshold: 1.0 },
];

/**
 * Calculate score for a word
 */
export function calculateWordScore(word: string, isPangram: boolean): number {
  if (word.length === 4) {
    return isPangram ? 1 + 7 : 1;
  }
  return isPangram ? word.length + 7 : word.length;
}

/**
 * Calculate rank based on score percentage
 */
export function calculateRank(score: number, maxScore: number): string {
  const percentage = maxScore > 0 ? score / maxScore : 0;
  
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (percentage >= RANKS[i].threshold) {
      return RANKS[i].name;
    }
  }
  
  return RANKS[0].name;
}

/**
 * Get progress percentage for current rank
 */
export function getRankProgress(score: number, maxScore: number): {
  currentRank: string;
  percentage: number;
  nextRank: string | null;
  nextThreshold: number | null;
} {
  const scorePercentage = maxScore > 0 ? score / maxScore : 0;
  
  let currentRankIndex = 0;
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (scorePercentage >= RANKS[i].threshold) {
      currentRankIndex = i;
      break;
    }
  }
  
  const currentRank = RANKS[currentRankIndex];
  const nextRankIndex = currentRankIndex + 1;
  const nextRank = nextRankIndex < RANKS.length ? RANKS[nextRankIndex] : null;
  
  let percentage = 0;
  if (nextRank) {
    const rangeStart = currentRank.threshold;
    const rangeEnd = nextRank.threshold;
    const rangeSize = rangeEnd - rangeStart;
    const progress = scorePercentage - rangeStart;
    percentage = rangeSize > 0 ? (progress / rangeSize) * 100 : 100;
  } else {
    percentage = 100;
  }
  
  return {
    currentRank: currentRank.name,
    percentage: Math.min(100, Math.max(0, percentage)),
    nextRank: nextRank?.name || null,
    nextThreshold: nextRank?.threshold || null,
  };
}

/**
 * Validate if a word is valid for the current puzzle
 */
export function isValidWord(
  word: string,
  centerLetter: string,
  availableLetters: string[],
  validWords: string[]
): { valid: boolean; reason?: string } {
  // Normalize to lowercase
  const normalizedWord = word.toLowerCase();
  const normalizedCenter = centerLetter.toLowerCase();
  const normalizedLetters = availableLetters.map(l => l.toLowerCase());
  
  // Check minimum length
  if (normalizedWord.length < 4) {
    return { valid: false, reason: 'Too short' };
  }
  
  // Check if word contains center letter
  if (!normalizedWord.includes(normalizedCenter)) {
    return { valid: false, reason: 'Missing center letter' };
  }
  
  // Check if word uses only available letters
  for (const char of normalizedWord) {
    if (!normalizedLetters.includes(char)) {
      return { valid: false, reason: 'Bad letter' };
    }
  }
  
  // Check if word is in dictionary
  if (!validWords.includes(normalizedWord)) {
    return { valid: false, reason: 'Not in word list' };
  }
  
  return { valid: true };
}

/**
 * Check if a word is a pangram (uses all 7 letters)
 */
export function isPangram(word: string, letters: string[]): boolean {
  const normalizedWord = word.toLowerCase();
  const normalizedLetters = letters.map(l => l.toLowerCase());
  
  return normalizedLetters.every(letter => normalizedWord.includes(letter));
}

/**
 * Generate a random puzzle
 */
export async function generatePuzzle(dictionary: string[]): Promise<Puzzle | null> {
  const vowels = 'aeiou'.split('');
  const consonants = 'bcdfghjklmnpqrstvwxyz'.split('');
  
  const maxAttempts = 100;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Generate 7 random letters (2-3 vowels, 4-5 consonants)
    const vowelCount = Math.random() < 0.5 ? 2 : 3;
    const consonantCount = 7 - vowelCount;
    
    const selectedVowels = shuffleArray([...vowels])
      .slice(0, vowelCount);
    const selectedConsonants = shuffleArray([...consonants])
      .slice(0, consonantCount);
    
    const letters = [...selectedVowels, ...selectedConsonants];
    shuffleArray(letters);
    
    // Pick a random center letter
    const centerLetter = letters[Math.floor(Math.random() * letters.length)];
    const outerLetters = letters.filter(l => l !== centerLetter);
    
    // Find valid words
    const validWords = dictionary.filter(word => {
      if (word.length < 4) return false;
      
      // Must contain center letter
      if (!word.includes(centerLetter)) return false;
      
      // Must use only available letters
      for (const char of word) {
        if (!letters.includes(char)) return false;
      }
      
      return true;
    });
    
    // Find pangrams
    const pangrams = validWords.filter(word => isPangram(word, letters));
    
    // Check if puzzle meets requirements (20-80 words, at least 1 pangram)
    if (validWords.length >= 20 && validWords.length <= 80 && pangrams.length >= 1) {
      // Calculate max score
      let maxScore = 0;
      for (const word of validWords) {
        const wordIsPangram = pangrams.includes(word);
        maxScore += calculateWordScore(word, wordIsPangram);
      }
      
      return {
        letters,
        centerLetter,
        outerLetters,
        validWords,
        pangrams,
        maxScore,
      };
    }
  }
  
  return null;
}

/**
 * Shuffle array in place
 */
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Load dictionary from text file
 */
export async function loadDictionary(): Promise<string[]> {
  try {
    // In React Native, we need to use require for assets
    // This will be handled by the dictionary service
    return [];
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    return [];
  }
}
