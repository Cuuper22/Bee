/**
 * Honeycomb grid component for Spelling Bee game
 */

import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Hexagon } from './hexagon';

interface HoneycombGridProps {
  centerLetter: string;
  outerLetters: string[];
  onLetterPress: (letter: string) => void;
  disabled?: boolean;
  hapticsEnabled?: boolean;
}

export function HoneycombGrid({
  centerLetter,
  outerLetters,
  onLetterPress,
  disabled = false,
  hapticsEnabled = true,
}: HoneycombGridProps) {
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const shuffle = () => {
    rotation.value = withSequence(
      withTiming(15, { duration: 150 }),
      withTiming(-15, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
  };

  // Expose shuffle method (will be called from parent)
  // For now, we'll handle shuffle in the parent component

  return (
    <View className="items-center justify-center">
      <Animated.View style={animatedStyle}>
        {/* Top row: 2 hexagons */}
        <View className="flex-row justify-center mb-[-10]">
          <View className="mr-2">
            <Hexagon
              letter={outerLetters[0]}
              onPress={() => onLetterPress(outerLetters[0])}
              disabled={disabled}
              hapticsEnabled={hapticsEnabled}
            />
          </View>
          <View className="ml-2">
            <Hexagon
              letter={outerLetters[1]}
              onPress={() => onLetterPress(outerLetters[1])}
              disabled={disabled}
              hapticsEnabled={hapticsEnabled}
            />
          </View>
        </View>

        {/* Middle row: 3 hexagons (left, center, right) */}
        <View className="flex-row justify-center mb-[-10]">
          <View className="mr-2">
            <Hexagon
              letter={outerLetters[2]}
              onPress={() => onLetterPress(outerLetters[2])}
              disabled={disabled}
              hapticsEnabled={hapticsEnabled}
            />
          </View>
          <View className="mx-2">
            <Hexagon
              letter={centerLetter}
              isCenter
              onPress={() => onLetterPress(centerLetter)}
              disabled={disabled}
              hapticsEnabled={hapticsEnabled}
            />
          </View>
          <View className="ml-2">
            <Hexagon
              letter={outerLetters[3]}
              onPress={() => onLetterPress(outerLetters[3])}
              disabled={disabled}
              hapticsEnabled={hapticsEnabled}
            />
          </View>
        </View>

        {/* Bottom row: 2 hexagons */}
        <View className="flex-row justify-center">
          <View className="mr-2">
            <Hexagon
              letter={outerLetters[4]}
              onPress={() => onLetterPress(outerLetters[4])}
              disabled={disabled}
              hapticsEnabled={hapticsEnabled}
            />
          </View>
          <View className="ml-2">
            <Hexagon
              letter={outerLetters[5]}
              onPress={() => onLetterPress(outerLetters[5])}
              disabled={disabled}
              hapticsEnabled={hapticsEnabled}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
