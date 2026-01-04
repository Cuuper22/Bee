/**
 * Found words list component
 */

import { View, Text, FlatList } from 'react-native';
import { cn } from '@/lib/utils';

interface FoundWordsListProps {
  words: string[];
  pangrams: string[];
}

export function FoundWordsList({ words, pangrams }: FoundWordsListProps) {
  const sortedWords = [...words].sort();

  return (
    <View className="flex-1 px-6">
      <Text className="text-white text-lg font-bold mb-3">
        Found Words ({words.length})
      </Text>
      
      {words.length === 0 ? (
        <Text className="text-gray-400 text-center py-8">
          No words found yet. Start playing!
        </Text>
      ) : (
        <FlatList
          data={sortedWords}
          keyExtractor={(item, index) => `${item}-${index}`}
          numColumns={3}
          renderItem={({ item }) => {
            const isPangram = pangrams.includes(item);
            return (
              <View className="flex-1 p-1">
                <View
                  className={cn(
                    'px-3 py-2 rounded-lg',
                    isPangram ? 'bg-[#F6C915]' : 'bg-gray-700'
                  )}
                >
                  <Text
                    className={cn(
                      'text-center font-medium text-sm',
                      isPangram ? 'text-gray-900' : 'text-white'
                    )}
                  >
                    {item}
                  </Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
