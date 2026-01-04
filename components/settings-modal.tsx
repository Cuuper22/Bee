/**
 * Settings modal component
 */

import { View, Text, Modal, Pressable, Switch } from 'react-native';
import { Preferences } from '@/lib/game-state';
import { useColors } from '@/hooks/use-colors';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  preferences: Preferences;
  onUpdatePreferences: (preferences: Preferences) => void;
  onNewPuzzle: () => void;
  onChangeDifficulty: () => void;
}

export function SettingsModal({
  visible,
  onClose,
  preferences,
  onUpdatePreferences,
  onNewPuzzle,
  onChangeDifficulty,
}: SettingsModalProps) {
  const colors = useColors();

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
          <Text className="text-white text-2xl font-bold mb-4">Settings</Text>

          {/* Settings Options */}
          <View className="gap-4 mb-4">
            {/* Sound Toggle */}
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-white text-base">Sound</Text>
              <Switch
                value={preferences.soundEnabled}
                onValueChange={(value) =>
                  onUpdatePreferences({ ...preferences, soundEnabled: value })
                }
                trackColor={{ false: '#4B5563', true: '#F6C915' }}
                thumbColor="#ffffff"
              />
            </View>

            {/* Haptics Toggle */}
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-white text-base">Haptics</Text>
              <Switch
                value={preferences.hapticsEnabled}
                onValueChange={(value) =>
                  onUpdatePreferences({ ...preferences, hapticsEnabled: value })
                }
                trackColor={{ false: '#4B5563', true: '#F6C915' }}
                thumbColor="#ffffff"
              />
            </View>

            {/* Divider */}
            <View className="h-px bg-gray-600" />

            {/* Change Difficulty */}
            <Pressable
              onPress={() => {
                onClose();
                onChangeDifficulty();
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: '#4B5563',
                  padding: 16,
                  borderRadius: 12,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-white font-semibold text-center text-base">
                Change Difficulty
              </Text>
            </Pressable>

            {/* New Puzzle */}
            <Pressable
              onPress={() => {
                onClose();
                onNewPuzzle();
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: '#4B5563',
                  padding: 16,
                  borderRadius: 12,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text className="text-white font-semibold text-center text-base">
                New Puzzle
              </Text>
            </Pressable>
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
        </View>
      </View>
    </Modal>
  );
}
