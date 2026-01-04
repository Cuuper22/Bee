/**
 * Difficulty selection modal
 */

import { View, Text, Modal, Pressable } from 'react-native';
import { DifficultyMode, DIFFICULTY_CONFIGS } from '@/lib/game-logic';
import { cn } from '@/lib/utils';

interface DifficultyModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (difficulty: DifficultyMode) => void;
  currentDifficulty: DifficultyMode;
}

const DIFFICULTIES: DifficultyMode[] = ['practice', 'easy', 'normal', 'hard'];

export function DifficultyModal({
  visible,
  onClose,
  onSelect,
  currentDifficulty,
}: DifficultyModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-[#1F2937] rounded-2xl w-full max-w-md p-6">
          {/* Header */}
          <Text className="text-white text-2xl font-bold mb-4">
            Select Difficulty
          </Text>

          {/* Difficulty Options */}
          <View className="gap-3 mb-4">
            {DIFFICULTIES.map((difficulty) => {
              const config = DIFFICULTY_CONFIGS[difficulty];
              const isSelected = difficulty === currentDifficulty;

              return (
                <Pressable
                  key={difficulty}
                  onPress={() => {
                    onSelect(difficulty);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: isSelected ? '#F6C915' : '#4B5563',
                      padding: 16,
                      borderRadius: 12,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    className={cn(
                      'font-semibold text-base mb-1',
                      isSelected ? 'text-gray-900' : 'text-white'
                    )}
                  >
                    {config.name}
                  </Text>
                  <Text
                    className={cn(
                      'text-sm',
                      isSelected ? 'text-gray-700' : 'text-gray-400'
                    )}
                  >
                    {config.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Close Button */}
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              {
                backgroundColor: '#4B5563',
                padding: 16,
                borderRadius: 12,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text className="text-white font-bold text-center text-base">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
