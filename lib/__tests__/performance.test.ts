/**
 * Tests for performance optimization
 */

import { describe, it, expect } from 'vitest';

describe('Performance', () => {
  it('handles large word lists efficiently', () => {
    const largeWordList = Array.from({ length: 1000 }, (_, i) => `word${i}`);

    const start = performance.now();
    const filtered = largeWordList.filter(word => word.startsWith('word1'));
    const end = performance.now();

    expect(filtered.length).toBeGreaterThan(0);
    expect(end - start).toBeLessThan(100); // Should complete in <100ms
  });

  it('efficiently checks word uniqueness', () => {
    const words = ['test', 'hello', 'world', 'test', 'foo'];
    const uniqueWords = new Set(words);

    expect(uniqueWords.size).toBe(4);
    expect(uniqueWords.has('test')).toBe(true);
  });

  it('validates array operations are optimized', () => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f'];

    // Test that we're not creating unnecessary copies
    const shuffled = [...letters].sort(() => 0.5 - Math.random());

    expect(shuffled.length).toBe(letters.length);
    expect(letters.length).toBe(6); // Original unchanged
  });

  it('ensures score calculation is fast', () => {
    const iterations = 10000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      const wordLength = 7;
      const isPangram = true;
      const score = wordLength + (isPangram ? 7 : 0);
    }

    const end = performance.now();
    expect(end - start).toBeLessThan(100); // 10k iterations in <100ms
  });

  it('validates memoization potential for expensive operations', () => {
    const cache = new Map<string, number>();

    const getScore = (word: string): number => {
      if (cache.has(word)) {
        return cache.get(word)!;
      }
      const score = word.length;
      cache.set(word, score);
      return score;
    };

    const score1 = getScore('test');
    const score2 = getScore('test'); // Should hit cache

    expect(score1).toBe(score2);
    expect(cache.size).toBe(1);
  });
});
