/**
 * Message display component for success/error feedback
 */

import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface MessageDisplayProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

export function MessageDisplay({ message, type, visible }: MessageDisplayProps) {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withTiming(1, { duration: 250 }),
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 250 })
      );
    } else {
      opacity.value = withTiming(0, { duration: 250 });
    }
  }, [visible, message]);

  if (!message) return null;

  return (
    <View className="absolute top-20 left-0 right-0 items-center z-50 px-6">
      <Animated.View
        style={[
          animatedStyle,
          {
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 12,
            maxWidth: '80%',
          },
        ]}
        className={cn(
          type === 'success' && 'bg-green-500',
          type === 'error' && 'bg-red-500',
          type === 'info' && 'bg-purple-500'
        )}
      >
        <Text className="text-white font-semibold text-center">{message}</Text>
      </Animated.View>
    </View>
  );
}
