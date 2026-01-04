/**
 * Score display component with progress bar and rank
 */

import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface ScoreDisplayProps {
  score: number;
  maxScore: number;
  rank: string;
  progress: number; // 0-100
}

export function ScoreDisplay({
  score,
  maxScore,
  rank,
  progress,
}: ScoreDisplayProps) {
  const progressBarStyle = useAnimatedStyle(() => ({
    width: withTiming(`${progress}%`, { duration: 400 }),
  }));

  return (
    <View className="px-6 py-4">
      {/* Score and Rank */}
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-white text-2xl font-bold">
            {score} / {maxScore}
          </Text>
          <Text className="text-gray-400 text-sm">points</Text>
        </View>
        <View className="items-end">
          <Text className="text-[#F6C915] text-xl font-bold">{rank}</Text>
          <Text className="text-gray-400 text-sm">rank</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <Animated.View
          style={[
            progressBarStyle,
            {
              height: '100%',
              backgroundColor: '#F6C915',
              borderRadius: 9999,
            },
          ]}
        />
      </View>
    </View>
  );
}
