/**
 * Hexagon component for Spelling Bee game
 */

import { Pressable, Text, View, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';

interface HexagonProps {
  letter: string;
  isCenter?: boolean;
  onPress: () => void;
  disabled?: boolean;
  hapticsEnabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Hexagon({
  letter,
  isCenter = false,
  onPress,
  disabled = false,
  hapticsEnabled = true,
}: HexagonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 80 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 80 });
  };

  const handlePress = () => {
    if (Platform.OS !== 'web' && hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        {
          width: 70,
          height: 80,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <View
        className={cn(
          'w-full h-full justify-center items-center rounded-lg',
          isCenter ? 'bg-[#F6C915]' : 'bg-[#4B5563]',
          disabled && 'opacity-50'
        )}
      >
        <Text
          className={cn(
            'text-3xl font-bold',
            isCenter ? 'text-gray-900' : 'text-white'
          )}
        >
          {letter.toUpperCase()}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
