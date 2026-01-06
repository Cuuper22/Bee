import { Pressable, Text, View, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Svg, { Polygon } from 'react-native-svg';
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

  // Hexagon dimensions
  const width = 100; // Increased touch target
  const height = 110;
  // Points for a pointy-topped hexagon
  // centered in 100x110 box
  const points = "50,0 100,27.5 100,82.5 50,110 0,82.5 0,27.5";

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        animatedStyle,
        {
          width: width,
          height: height,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <View className={cn("w-full h-full justify-center items-center relative", disabled && 'opacity-50')}>
        <Svg height="100%" width="100%" viewBox="0 0 100 110" style={{ position: 'absolute' }}>
          <Polygon
            points={points}
            fill={isCenter ? '#F6C915' : '#4B5563'}
            stroke={isCenter ? '#EAB308' : '#374151'}
            strokeWidth="2"
          />
        </Svg>
        <Text
          className={cn(
            'text-3xl font-bold z-10',
            isCenter ? 'text-gray-900' : 'text-white'
          )}
        >
          {letter.toUpperCase()}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
