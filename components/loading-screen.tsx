/**
 * Loading screen with flying bees animation
 */

import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export function LoadingScreen() {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 800 }),
        withTiming(0, { duration: 800 })
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  return (
    <View className="flex-1 bg-[#111827] justify-center items-center">
      <Animated.View style={animatedStyle}>
        <Text className="text-6xl mb-4">🐝</Text>
      </Animated.View>
      <Text className="text-white text-xl font-bold mt-4">
        Generating Puzzle...
      </Text>
      <Text className="text-gray-400 text-sm mt-2">
        Finding the perfect words
      </Text>
    </View>
  );
}
