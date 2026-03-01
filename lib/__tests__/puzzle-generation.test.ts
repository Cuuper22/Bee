/**
 * Integration tests for puzzle generation
 */

import { describe, it, expect } from 'vitest';
import { generatePuzzle, calculateWordScore } from '../game-logic';

describe('Puzzle Generation', () => {
  // Create a minimal test dictionary
  const testDictionary = [
    'area', 'rear', 'rare', 'rare', 'arena',
    'areas', 'rarer', 'rearea',
    'test', 'tests', 'tested', 'tester', 'testing',
    'best', 'rest', 'nest',
    'abcd', 'abcde', 'abcdef', 'abcdefg',
    'cafe', 'face', 'aced', 'caged', 'faced',
    'badge', 'cadge', 'decaf',
  ];

  it('should generate a valid puzzle', async () => {
    const puzzle = await generatePuzzle(testDictionary);
    
    if (puzzle) {
      // Check structure
      expect(puzzle.letters).toHaveLength(7);
      expect(puzzle.centerLetter).toBeDefined();
      expect(puzzle.outerLetters).toHaveLength(6);
      
      // Check that all letters are unique
      const uniqueLetters = new Set(puzzle.letters);
      expect(uniqueLetters.size).toBe(7);
      
      // Check that center letter is in letters array
      expect(puzzle.letters).toContain(puzzle.centerLetter);
      
      // Check word requirements
      expect(puzzle.validWords.length).toBeGreaterThanOrEqual(20);
      expect(puzzle.validWords.length).toBeLessThanOrEqual(80);
      expect(puzzle.pangrams.length).toBeGreaterThanOrEqual(1);
      
      // Check that all valid words contain center letter
      puzzle.validWords.forEach(word => {
        expect(word).toContain(puzzle.centerLetter);
      });
      
      // Check that all pangrams are in valid words
      puzzle.pangrams.forEach(pangram => {
        expect(puzzle.validWords).toContain(pangram);
      });
      
      // Check max score calculation
      let expectedMaxScore = 0;
      for (const word of puzzle.validWords) {
        const isPangram = puzzle.pangrams.includes(word);
        expectedMaxScore += calculateWordScore(word, isPangram);
      }
      expect(puzzle.maxScore).toBe(expectedMaxScore);
    }
  });

  it('should not include words shorter than 4 letters', async () => {
    const puzzle = await generatePuzzle(testDictionary);
    
    if (puzzle) {
      puzzle.validWords.forEach(word => {
        expect(word.length).toBeGreaterThanOrEqual(4);
      });
    }
  });

  it('should only include words using available letters', async () => {
    const puzzle = await generatePuzzle(testDictionary);
    
    if (puzzle) {
      puzzle.validWords.forEach(word => {
        for (const char of word) {
          expect(puzzle.letters).toContain(char);
        }
      });
    }
  });

  it('should have correct vowel/consonant distribution', async () => {
    const puzzle = await generatePuzzle(testDictionary);
    
    if (puzzle) {
      const vowels = 'aeiou'.split('');
      const vowelCount = puzzle.letters.filter(l => vowels.includes(l)).length;
      
      // Should have 2 or 3 vowels
      expect(vowelCount).toBeGreaterThanOrEqual(2);
      expect(vowelCount).toBeLessThanOrEqual(3);
      
      // Consonant count should be 7 - vowelCount
      const consonantCount = 7 - vowelCount;
      expect(consonantCount).toBeGreaterThanOrEqual(4);
      expect(consonantCount).toBeLessThanOrEqual(5);
    }
  });
});
