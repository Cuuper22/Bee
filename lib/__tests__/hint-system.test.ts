/**
 * Unit tests for hint system
 */

import { describe, it, expect } from 'vitest';
import {
  generateWordLengthHint,
  generateFirstLetterHint,
  generateDefinitionHint,
  generateTwoLetterHint,
  generateDifficultyMeterHint,
  generateHint,
} from '../hint-system';

describe('Hint System', () => {
  const testWords = ['test', 'tests', 'testing', 'tested', 'tester'];
  const testDefinitions = {
    'test': 'A procedure to check something',
    'tests': 'Multiple procedures to check things',
    'testing': 'The act of checking something',
  };

  describe('generateWordLengthHint', () => {
    it('should count words by length', () => {
      const hint = generateWordLengthHint(testWords);
      expect(hint[4]).toBe(1); // "test"
      expect(hint[5]).toBe(1); // "tests"
      expect(hint[6]).toBe(2); // "tested", "tester"
      expect(hint[7]).toBe(1); // "testing"
    });

    it('should handle empty word list', () => {
      const hint = generateWordLengthHint([]);
      expect(Object.keys(hint).length).toBe(0);
    });
  });

  describe('generateFirstLetterHint', () => {
    it('should return first letter of a word', () => {
      const hint = generateFirstLetterHint(testWords);
      expect(hint).not.toBeNull();
      expect(hint?.letter).toBe('T');
      expect(testWords).toContain(hint?.word);
    });

    it('should return null for empty word list', () => {
      const hint = generateFirstLetterHint([]);
      expect(hint).toBeNull();
    });
  });

  describe('generateDefinitionHint', () => {
    it('should return definition for a word', () => {
      const hint = generateDefinitionHint(['test'], testDefinitions);
      expect(hint).not.toBeNull();
      expect(hint?.word).toBe('test');
      expect(hint?.definition).toBe('A procedure to check something');
    });

    it('should prioritize words with definitions', () => {
      const hint = generateDefinitionHint(['test', 'unknown'], testDefinitions);
      expect(hint).not.toBeNull();
      expect(hint?.word && hint.word in testDefinitions).toBeTruthy();
    });

    it('should provide fallback definition if none exists', () => {
      const hint = generateDefinitionHint(['unknown'], {});
      expect(hint).not.toBeNull();
      // Fallback contains first letter and word length
      expect(hint?.definition).toContain('"U"');
      expect(hint?.definition).toContain('7 letters');
    });

    it('should return null for empty word list', () => {
      const hint = generateDefinitionHint([], testDefinitions);
      expect(hint).toBeNull();
    });
  });

  describe('generateTwoLetterHint', () => {
    it('should return first two letters of a word', () => {
      const hint = generateTwoLetterHint(testWords);
      expect(hint).not.toBeNull();
      expect(hint?.letters).toBe('TE');
      expect(testWords).toContain(hint?.word);
    });

    it('should return null for empty word list', () => {
      const hint = generateTwoLetterHint([]);
      expect(hint).toBeNull();
    });
  });

  describe('generateDifficultyMeterHint', () => {
    it('should count common vs tricky words', () => {
      const hint = generateDifficultyMeterHint(testWords);
      // testWords = ['test'(4), 'tests'(5), 'testing'(7), 'tested'(6), 'tester'(6)]
      // common (<=6): 'test', 'tests', 'tested', 'tester' = 4
      // tricky (>6): 'testing' = 1
      expect(hint.common).toBe(4);
      expect(hint.tricky).toBe(1);
    });

    it('should handle all common words', () => {
      const hint = generateDifficultyMeterHint(['test', 'tests']);
      expect(hint.common).toBe(2);
      expect(hint.tricky).toBe(0);
    });

    it('should handle all tricky words', () => {
      const hint = generateDifficultyMeterHint(['testing', 'testings', 'testable']);
      expect(hint.common).toBe(0);
      expect(hint.tricky).toBe(3);
    });

    it('should handle empty word list', () => {
      const hint = generateDifficultyMeterHint([]);
      expect(hint.common).toBe(0);
      expect(hint.tricky).toBe(0);
    });
  });

  describe('generateHint', () => {
    it('should generate word_length hint', () => {
      const hint = generateHint('word_length', testWords, testDefinitions);
      expect(hint).not.toBeNull();
      expect(hint?.type).toBe('word_length');
      expect(hint?.data).toBeDefined();
    });

    it('should generate first_letter hint', () => {
      const hint = generateHint('first_letter', testWords, testDefinitions);
      expect(hint).not.toBeNull();
      expect(hint?.type).toBe('first_letter');
      expect(hint?.data.letter).toBe('T');
    });

    it('should generate definition hint', () => {
      const hint = generateHint('definition', ['test'], testDefinitions);
      expect(hint).not.toBeNull();
      expect(hint?.type).toBe('definition');
      expect(hint?.data.definition).toBeDefined();
    });

    it('should generate two_letter hint', () => {
      const hint = generateHint('two_letter', testWords, testDefinitions);
      expect(hint).not.toBeNull();
      expect(hint?.type).toBe('two_letter');
      expect(hint?.data.letters).toBe('TE');
    });

    it('should generate difficulty_meter hint', () => {
      const hint = generateHint('difficulty_meter', testWords, testDefinitions);
      expect(hint).not.toBeNull();
      expect(hint?.type).toBe('difficulty_meter');
      expect(hint?.data.common).toBeDefined();
      expect(hint?.data.tricky).toBeDefined();
    });

    it('should return null for empty word list (where applicable)', () => {
      const firstLetterHint = generateHint('first_letter', [], testDefinitions);
      expect(firstLetterHint).toBeNull();

      const definitionHint = generateHint('definition', [], testDefinitions);
      expect(definitionHint).toBeNull();

      const twoLetterHint = generateHint('two_letter', [], testDefinitions);
      expect(twoLetterHint).toBeNull();
    });
  });
});
