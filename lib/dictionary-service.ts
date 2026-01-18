/**
 * Dictionary service for loading and caching word list
 */

import { Platform } from 'react-native';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

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
    let text = '';
    const assetModule = require('../assets/words_alpha.txt');

    if (Platform.OS === 'web') {
      // On web, require returns a URL string
      const response = await fetch(assetModule);
      text = await response.text();
    } else {
      // On native, require returns an asset ID number
      const asset = Asset.fromModule(assetModule);

      // Ensure the asset is downloaded to the local filesystem
      await asset.downloadAsync();

      if (asset.localUri) {
        text = await FileSystem.readAsStringAsync(asset.localUri);
      } else {
        throw new Error('Failed to resolve asset local URI');
      }
    }
    
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
