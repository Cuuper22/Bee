/**
 * Dictionary service for loading and caching word list
 */

// Import the dictionary as a raw string
// We'll process it at runtime
let cachedDictionary: string[] | null = null;

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
 * Clear cached dictionary (for testing)
 */
export function clearDictionaryCache(): void {
  cachedDictionary = null;
}
