/**
 * Control buttons for Spelling Bee game (Enter, Delete, Shuffle)
 */

import { Pressable, Text, View, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';

interface ControlButtonsProps {
  onEnter: () => void;
  onDelete: () => void;
  onShuffle: () => void;
  disabled?: boolean;
  hapticsEnabled?: boolean;
}

export function ControlButtons({
  onEnter,
  onDelete,
  onShuffle,
  disabled = false,
  hapticsEnabled = true,
}: ControlButtonsProps) {
  const handlePress = (callback: () => void) => {
    if (Platform.OS !== 'web' && hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    callback();
  };

  return (
    <View className="flex-row justify-center items-center gap-4 px-4">
      <Pressable
        onPress={() => handlePress(onDelete)}
        disabled={disabled}
        style={({ pressed }) => [
          {
            backgroundColor: '#4B5563',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
            minWidth: 100,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Text className="text-white text-center font-semibold text-base">
          Delete
        </Text>
      </Pressable>

      <Pressable
        onPress={() => handlePress(onShuffle)}
        disabled={disabled}
        style={({ pressed }) => [
          {
            backgroundColor: '#4B5563',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
            minWidth: 100,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Text className="text-white text-center font-semibold text-base">
          Shuffle
        </Text>
      </Pressable>

      <Pressable
        onPress={() => handlePress(onEnter)}
        disabled={disabled}
        style={({ pressed }) => [
          {
            backgroundColor: '#F6C915',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
            minWidth: 100,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Text className="text-gray-900 text-center font-bold text-base">
          Enter
        </Text>
      </Pressable>
    </View>
  );
}
