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
  rhyme?: string;
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
 */
export function generateDefinitionHint(remainingWords: string[], definitions: Record<string, string> = {}): DefinitionHint | null {
  if (remainingWords.length === 0) return null;
  
  // Try to find a word that has a definition
  const wordsWithDefs = remainingWords.filter(word => definitions[word]);

  // If no words have definitions (unlikely), fallback to any word
  const targetWords = wordsWithDefs.length > 0 ? wordsWithDefs : remainingWords;
  const randomWord = targetWords[Math.floor(Math.random() * targetWords.length)];

  let definition = definitions[randomWord];
  
  if (!definition) {
    // Fallback if we somehow picked a word without a definition
    definition = `A word that starts with "${randomWord[0].toUpperCase()}" and has ${randomWord.length} letters.`;
  }

  // Find a rhyme
  const rhyme = findRhyme(randomWord, definitions);

  return {
    word: randomWord,
    definition,
    rhyme: rhyme || undefined,
  };
}

/**
 * Find a rhyming word from the dictionary
 */
function findRhyme(word: string, definitions: Record<string, string>): string | null {
  const dictionaryWords = Object.keys(definitions);

  // Try to find a rhyme by matching suffix
  // We'll try matching 3 characters, then 2 if needed

  const suffixes = [3, 2];

  for (const len of suffixes) {
    if (word.length <= len) continue;

    const suffix = word.slice(-len);
    const candidates = dictionaryWords.filter(w =>
      w !== word &&
      w.length >= len &&
      w.endsWith(suffix) &&
      w.length < 10 // Prefer shorter words for rhymes
    );

    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
  }

  return null;
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
export function generateHint(
  type: HintType,
  remainingWords: string[],
  definitions: Record<string, string> = {}
): HintResult | null {
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
      const definitionHint = generateDefinitionHint(remainingWords, definitions);
      if (!definitionHint) return null;
      return {
        type,
        data: {
          word: definitionHint.word,
          definition: definitionHint.definition,
          rhyme: definitionHint.rhyme,
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
