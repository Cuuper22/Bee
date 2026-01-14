/**
 * Dictionary service for loading and caching word list
 */

// Import the dictionary as a raw string
// We'll process it at runtime
let cachedDictionary: string[] | null = null;
let cachedDefinitions: Record<string, string> | null = null;

/**
 * Load dictionary from bundled asset
 */
export async function loadDictionary(): Promise<string[]> {
  if (cachedDictionary) {
    return cachedDictionary;
  }

  try {
    // Fetch the dictionary file from assets
    const response = await fetch(require('../assets/words_alpha.txt'));
    const text = await response.text();
    
    // Split into lines and filter
    const words = text
      .split('\n')
      .map(word => word.trim().toLowerCase())
      .filter(word => word.length >= 4); // Only words 4+ letters
    
    cachedDictionary = words;
    return words;
  } catch (error) {
    console.error('Failed to load dictionary:', error);
    return [];
  }
}

/**
 * Load definitions from bundled asset
 */
export function loadDefinitions(): Record<string, string> {
  if (cachedDefinitions) {
    return cachedDefinitions;
  }

  try {
    // Require the dictionary JSON directly
    const definitions = require('../assets/dictionary.json');
    cachedDefinitions = definitions;
    return definitions;
  } catch (error) {
    console.error('Failed to load definitions:', error);
    return {};
  }
}

/**
 * Clear cached dictionary (for testing)
 */
export function clearDictionaryCache(): void {
  cachedDictionary = null;
  cachedDefinitions = null;
}
