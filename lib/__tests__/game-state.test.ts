/**
 * Unit tests for game state management
 */

import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  calculateHintsAvailable,
} from '../game-state';
import { Puzzle } from '../game-logic';

describe('Game State', () => {
  const mockPuzzle: Puzzle = {
    letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    centerLetter: 'a',
    outerLetters: ['b', 'c', 'd', 'e', 'f', 'g'],
    validWords: ['abcd', 'cafe', 'badge'],
    pangrams: ['abcdefg'],
    maxScore: 100,
  };

  describe('createInitialGameState', () => {
    it('should create initial state for practice mode', () => {
      const state = createInitialGameState(mockPuzzle, 'practice');
      expect(state.puzzle).toBe(mockPuzzle);
      expect(state.foundWords).toEqual([]);
      expect(state.score).toBe(0);
      expect(state.rank).toBe('Beginner');
      expect(state.hintsAvailable).toBe(999);
      expect(state.difficulty).toBe('practice');
    });

    it('should create initial state for normal mode', () => {
      const state = createInitialGameState(mockPuzzle, 'normal');
      expect(state.hintsAvailable).toBe(0);
      expect(state.difficulty).toBe('normal');
    });

    it('should create initial state for easy mode', () => {
      const state = createInitialGameState(mockPuzzle, 'easy');
      expect(state.hintsAvailable).toBe(0);
      expect(state.difficulty).toBe('easy');
    });

    it('should create initial state for hard mode', () => {
      const state = createInitialGameState(mockPuzzle, 'hard');
      expect(state.hintsAvailable).toBe(0);
      expect(state.difficulty).toBe('hard');
    });
  });

  describe('calculateHintsAvailable', () => {
    describe('practice mode', () => {
      it('should always return unlimited hints', () => {
        expect(calculateHintsAvailable(0, 'practice', 0)).toBe(999);
        expect(calculateHintsAvailable(10, 'practice', 5)).toBe(999);
        expect(calculateHintsAvailable(100, 'practice', 50)).toBe(999);
      });
    });

    describe('easy mode (1 word = 1 hint)', () => {
      it('should earn 1 hint per word found', () => {
        expect(calculateHintsAvailable(0, 'easy', 0)).toBe(0);
        expect(calculateHintsAvailable(1, 'easy', 0)).toBe(1);
        expect(calculateHintsAvailable(5, 'easy', 0)).toBe(5);
      });

      it('should subtract hints used', () => {
        expect(calculateHintsAvailable(5, 'easy', 2)).toBe(3);
        expect(calculateHintsAvailable(10, 'easy', 7)).toBe(3);
      });

      it('should not go below zero', () => {
        expect(calculateHintsAvailable(2, 'easy', 5)).toBe(0);
      });
    });

    describe('normal mode (2 words = 1 hint)', () => {
      it('should earn 1 hint per 2 words found', () => {
        expect(calculateHintsAvailable(0, 'normal', 0)).toBe(0);
        expect(calculateHintsAvailable(1, 'normal', 0)).toBe(0);
        expect(calculateHintsAvailable(2, 'normal', 0)).toBe(1);
        expect(calculateHintsAvailable(5, 'normal', 0)).toBe(2);
        expect(calculateHintsAvailable(10, 'normal', 0)).toBe(5);
      });

      it('should subtract hints used', () => {
        expect(calculateHintsAvailable(10, 'normal', 2)).toBe(3);
      });

      it('should not go below zero', () => {
        expect(calculateHintsAvailable(4, 'normal', 5)).toBe(0);
      });
    });

    describe('hard mode (3 words = 1 hint)', () => {
      it('should earn 1 hint per 3 words found', () => {
        expect(calculateHintsAvailable(0, 'hard', 0)).toBe(0);
        expect(calculateHintsAvailable(1, 'hard', 0)).toBe(0);
        expect(calculateHintsAvailable(2, 'hard', 0)).toBe(0);
        expect(calculateHintsAvailable(3, 'hard', 0)).toBe(1);
        expect(calculateHintsAvailable(7, 'hard', 0)).toBe(2);
        expect(calculateHintsAvailable(15, 'hard', 0)).toBe(5);
      });

      it('should subtract hints used', () => {
        expect(calculateHintsAvailable(15, 'hard', 3)).toBe(2);
      });

      it('should not go below zero', () => {
        expect(calculateHintsAvailable(6, 'hard', 5)).toBe(0);
      });
    });
  });
});
