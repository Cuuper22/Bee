/**
 * Hint system for Spelling Bee game
 */

export type HintType = 'word_length' | 'first_letter' | 'definition' | 'two_letter' | 'difficulty_meter';

export interface HintResult {
  type: HintType;
  data: any;
}

export interface WordLengthHint {
  [length: number]: number; // length -> count
}

export interface FirstLetterHint {
  letter: string;
  word: string; // The actual word (hidden from user, used for verification)
}

export interface DefinitionHint {
  word: string;
  definition: string;
}

export interface TwoLetterHint {
  letters: string;
  word: string; // The actual word (hidden from user)
}

export interface DifficultyMeterHint {
  common: number; // Words with 6 or fewer letters
  tricky: number; // Words with 7+ letters
}

/**
 * Generate word length hint
 */
export function generateWordLengthHint(remainingWords: string[]): WordLengthHint {
  const lengthCounts: WordLengthHint = {};
  
  for (const word of remainingWords) {
    const length = word.length;
    lengthCounts[length] = (lengthCounts[length] || 0) + 1;
  }
  
  return lengthCounts;
}

/**
 * Generate first letter hint
 */
export function generateFirstLetterHint(remainingWords: string[]): FirstLetterHint | null {
  if (remainingWords.length === 0) return null;
  
  const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
  
  return {
    letter: randomWord[0].toUpperCase(),
    word: randomWord,
  };
}

/**
 * Generate definition hint
 * Note: In a real app, you'd fetch from a dictionary API
 * For now, we'll return a placeholder
 */
export function generateDefinitionHint(remainingWords: string[]): DefinitionHint | null {
  if (remainingWords.length === 0) return null;
  
  const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
  
  return {
    word: randomWord,
    definition: `A word that starts with "${randomWord[0].toUpperCase()}" and has ${randomWord.length} letters.`,
  };
}

/**
 * Generate two-letter start hint
 */
export function generateTwoLetterHint(remainingWords: string[]): TwoLetterHint | null {
  if (remainingWords.length === 0) return null;
  
  const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
  
  return {
    letters: randomWord.substring(0, 2).toUpperCase(),
    word: randomWord,
  };
}

/**
 * Generate difficulty meter hint
 */
export function generateDifficultyMeterHint(remainingWords: string[]): DifficultyMeterHint {
  let common = 0;
  let tricky = 0;
  
  for (const word of remainingWords) {
    if (word.length <= 6) {
      common++;
    } else {
      tricky++;
    }
  }
  
  return { common, tricky };
}

/**
 * Generate hint based on type
 */
export function generateHint(type: HintType, remainingWords: string[]): HintResult | null {
  switch (type) {
    case 'word_length':
      return {
        type,
        data: generateWordLengthHint(remainingWords),
      };
    
    case 'first_letter':
      const firstLetterHint = generateFirstLetterHint(remainingWords);
      if (!firstLetterHint) return null;
      return {
        type,
        data: { letter: firstLetterHint.letter },
      };
    
    case 'definition':
      const definitionHint = generateDefinitionHint(remainingWords);
      if (!definitionHint) return null;
      return {
        type,
        data: {
          word: definitionHint.word,
          definition: definitionHint.definition,
        },
      };
    
    case 'two_letter':
      const twoLetterHint = generateTwoLetterHint(remainingWords);
      if (!twoLetterHint) return null;
      return {
        type,
        data: { letters: twoLetterHint.letters },
      };
    
    case 'difficulty_meter':
      return {
        type,
        data: generateDifficultyMeterHint(remainingWords),
      };
    
    default:
      return null;
  }
}
