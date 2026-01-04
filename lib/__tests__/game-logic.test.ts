/**
 * Unit tests for game logic
 */

import { describe, it, expect } from 'vitest';
import {
  calculateWordScore,
  calculateRank,
  getRankProgress,
  isValidWord,
  isPangram,
  RANKS,
} from '../game-logic';

describe('Game Logic', () => {
  describe('calculateWordScore', () => {
    it('should score 4-letter words as 1 point', () => {
      expect(calculateWordScore('test', false)).toBe(1);
    });

    it('should score 5+ letter words by length', () => {
      expect(calculateWordScore('tests', false)).toBe(5);
      expect(calculateWordScore('testing', false)).toBe(7);
    });

    it('should add 7 bonus points for pangrams', () => {
      expect(calculateWordScore('test', true)).toBe(8); // 1 + 7
      expect(calculateWordScore('tests', true)).toBe(12); // 5 + 7
    });
  });

  describe('calculateRank', () => {
    it('should return Beginner at 0%', () => {
      expect(calculateRank(0, 100)).toBe('Beginner');
    });

    it('should return Good Start at 2%', () => {
      expect(calculateRank(2, 100)).toBe('Good Start');
    });

    it('should return Queen Bee at 100%', () => {
      expect(calculateRank(100, 100)).toBe('Queen Bee');
    });

    it('should return correct rank for 50%', () => {
      expect(calculateRank(50, 100)).toBe('Amazing');
    });
  });

  describe('getRankProgress', () => {
    it('should calculate progress correctly', () => {
      const result = getRankProgress(50, 100);
      expect(result.currentRank).toBe('Amazing');
      expect(result.nextRank).toBe('Genius');
      expect(result.percentage).toBeGreaterThanOrEqual(0);
      expect(result.percentage).toBeLessThanOrEqual(100);
    });

    it('should return 100% progress at Queen Bee', () => {
      const result = getRankProgress(100, 100);
      expect(result.currentRank).toBe('Queen Bee');
      expect(result.nextRank).toBe(null);
      expect(result.percentage).toBe(100);
    });
  });

  describe('isValidWord', () => {
    const centerLetter = 'a';
    const availableLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const validWords = ['abcd', 'cafe', 'badge', 'faced'];

    it('should reject words shorter than 4 letters', () => {
      const result = isValidWord('abc', centerLetter, availableLetters, validWords);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Too short');
    });

    it('should reject words without center letter', () => {
      const result = isValidWord('bcde', centerLetter, availableLetters, validWords);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Missing center letter');
    });

    it('should reject words with unavailable letters', () => {
      const result = isValidWord('abcz', centerLetter, availableLetters, validWords);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Bad letter');
    });

    it('should reject words not in dictionary', () => {
      const result = isValidWord('abcdefg', centerLetter, availableLetters, validWords);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Not in word list');
    });

    it('should accept valid words', () => {
      const result = isValidWord('abcd', centerLetter, availableLetters, validWords);
      expect(result.valid).toBe(true);
    });
  });

  describe('isPangram', () => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

    it('should return true for words using all letters', () => {
      expect(isPangram('abcdefg', letters)).toBe(true);
      expect(isPangram('gabfedcba', letters)).toBe(true);
    });

    it('should return false for words not using all letters', () => {
      expect(isPangram('abcd', letters)).toBe(false);
      expect(isPangram('abcdef', letters)).toBe(false);
    });
  });
});
