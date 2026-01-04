/**
 * Current word display component
 */

import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface CurrentWordDisplayProps {
  word: string;
  shake?: boolean;
}

export function CurrentWordDisplay({ word, shake = false }: CurrentWordDisplayProps) {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    if (shake) {
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [shake]);

  return (
    <View className="h-16 justify-center items-center px-6">
      <Animated.View style={animatedStyle}>
        <Text className="text-white text-3xl font-bold tracking-wider">
          {word.toUpperCase() || ' '}
        </Text>
      </Animated.View>
    </View>
  );
}
