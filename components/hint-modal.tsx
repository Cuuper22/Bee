/**
 * Hint modal component
 */

import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { HintType, HintResult } from '@/lib/hint-system';
import { cn } from '@/lib/utils';

interface HintModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectHint: (type: HintType) => void;
  hintsAvailable: number;
  lastHint: HintResult | null;
}

const HINT_TYPES: { type: HintType; title: string; description: string }[] = [
  {
    type: 'word_length',
    title: 'Word Length',
    description: 'See how many words of each length remain',
  },
  {
    type: 'first_letter',
    title: 'First Letter',
    description: 'Reveal the first letter of a random word',
  },
  {
    type: 'definition',
    title: 'Definition',
    description: 'See the definition of a random word',
  },
  {
    type: 'two_letter',
    title: 'Two-Letter Start',
    description: 'Reveal the first two letters of a random word',
  },
  {
    type: 'difficulty_meter',
    title: 'Difficulty Meter',
    description: 'See how many common vs tricky words remain',
  },
];

export function HintModal({
  visible,
  onClose,
  onSelectHint,
  hintsAvailable,
  lastHint,
}: HintModalProps) {
  const renderHintResult = () => {
    if (!lastHint) return null;

    switch (lastHint.type) {
      case 'word_length':
        const lengthData = lastHint.data as Record<number, number>;
        return (
          <View className="bg-gray-700 rounded-lg p-4 mb-4">
            <Text className="text-white font-bold mb-3">Word Lengths:</Text>
            {Object.entries(lengthData)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([length, count]) => (
                <View key={length} className="flex-row justify-between py-1">
                  <Text className="text-gray-300">{length} letters:</Text>
                  <Text className="text-white font-semibold">{count} words</Text>
                </View>
              ))}
          </View>
        );

      case 'first_letter':
        return (
          <View className="bg-gray-700 rounded-lg p-4 mb-4">
            <Text className="text-white font-bold mb-2">First Letter:</Text>
            <Text className="text-[#F6C915] text-4xl font-bold text-center">
              {lastHint.data.letter}
            </Text>
          </View>
        );

      case 'definition':
        return (
          <View className="bg-gray-700 rounded-lg p-4 mb-4">
            <Text className="text-white font-bold mb-2">Definition:</Text>
            <Text className="text-gray-300 leading-relaxed">
              {lastHint.data.definition}
            </Text>
          </View>
        );

      case 'two_letter':
        return (
          <View className="bg-gray-700 rounded-lg p-4 mb-4">
            <Text className="text-white font-bold mb-2">First Two Letters:</Text>
            <Text className="text-[#F6C915] text-4xl font-bold text-center">
              {lastHint.data.letters}
            </Text>
          </View>
        );

      case 'difficulty_meter':
        return (
          <View className="bg-gray-700 rounded-lg p-4 mb-4">
            <Text className="text-white font-bold mb-3">Difficulty Meter:</Text>
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-300">Common (≤6 letters):</Text>
              <Text className="text-green-400 font-semibold">
                {lastHint.data.common} words
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-300">Tricky (7+ letters):</Text>
              <Text className="text-red-400 font-semibold">
                {lastHint.data.tricky} words
              </Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-[#1F2937] rounded-2xl w-full max-w-md p-6">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="mb-4">
              <Text className="text-white text-2xl font-bold mb-2">Hints</Text>
              <Text className="text-gray-400">
                Available: {hintsAvailable === 999 ? '∞' : hintsAvailable}
              </Text>
            </View>

            {/* Last Hint Result */}
            {renderHintResult()}

            {/* Hint Type Buttons */}
            <View className="gap-3 mb-4">
              {HINT_TYPES.map((hint) => (
                <Pressable
                  key={hint.type}
                  onPress={() => onSelectHint(hint.type)}
                  disabled={hintsAvailable === 0}
                  style={({ pressed }) => [
                    {
                      backgroundColor: '#4B5563',
                      padding: 16,
                      borderRadius: 12,
                      opacity: pressed ? 0.7 : hintsAvailable === 0 ? 0.5 : 1,
                    },
                  ]}
                >
                  <Text className="text-white font-semibold text-base mb-1">
                    {hint.title}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    {hint.description}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Close Button */}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                {
                  backgroundColor: '#F6C915',
                  padding: 16,
                  borderRadius: 12,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-gray-900 font-bold text-center text-base">
                Close
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
