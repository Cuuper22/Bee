/**
 * Main Spelling Bee Game Screen
 */

import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/screen-container';
import { HoneycombGrid } from '@/components/honeycomb-grid';
import { ControlButtons } from '@/components/control-buttons';
import { ScoreDisplay } from '@/components/score-display';
import { CurrentWordDisplay } from '@/components/current-word-display';
import { FoundWordsList } from '@/components/found-words-list';
import { MessageDisplay } from '@/components/message-display';
import { LoadingScreen } from '@/components/loading-screen';
import { HintModal } from '@/components/hint-modal';
import { DifficultyModal } from '@/components/difficulty-modal';
import { SettingsModal } from '@/components/settings-modal';
import { loadDictionary, loadDefinitions } from '@/lib/dictionary-service';
import {
  generatePuzzle,
  isValidWord,
  isPangram,
  calculateWordScore,
  getRankProgress,
  DifficultyMode,
  Puzzle,
} from '@/lib/game-logic';
import {
  saveGameState,
  loadGameState,
  createInitialGameState,
  savePreferences,
  loadPreferences,
  Preferences,
  calculateHintsAvailable,
} from '@/lib/game-state';
import { generateHint, HintType, HintResult } from '@/lib/hint-system';

export default function GameScreen() {
  const [loading, setLoading] = useState(true);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [currentWord, setCurrentWord] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  const [messageVisible, setMessageVisible] = useState(false);
  const [shake, setShake] = useState(false);
  const [outerLetters, setOuterLetters] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<Preferences>({
    soundEnabled: true,
    hapticsEnabled: true,
    difficulty: 'normal',
  });
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintModalVisible, setHintModalVisible] = useState(false);
  const [difficultyModalVisible, setDifficultyModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [lastHint, setLastHint] = useState<HintResult | null>(null);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      // Load preferences
      const savedPreferences = await loadPreferences();
      setPreferences(savedPreferences);

      // Load saved game state
      const savedState = await loadGameState();

      if (savedState && savedState.puzzle) {
        // Resume saved game
        setPuzzle(savedState.puzzle);
        setFoundWords(savedState.foundWords);
        setScore(savedState.score);
        setOuterLetters(savedState.puzzle.outerLetters);
      } else {
        // Generate new puzzle
        await generateNewPuzzle(savedPreferences.difficulty);
      }
    } catch (error) {
      console.error('Failed to initialize game:', error);
      showMessage('Failed to load game', 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateNewPuzzle = async (difficulty: DifficultyMode) => {
    setLoading(true);
    try {
      const dictionary = await loadDictionary();
      const newPuzzle = await generatePuzzle(dictionary);

      if (!newPuzzle) {
        showMessage('Failed to generate puzzle', 'error');
        return;
      }

      setPuzzle(newPuzzle);
      setFoundWords([]);
      setScore(0);
      setCurrentWord('');
      setOuterLetters(newPuzzle.outerLetters);
      setHintsUsed(0);
      setLastHint(null);

      // Save initial state
      const initialState = createInitialGameState(newPuzzle, difficulty);
      await saveGameState(initialState);
    } catch (error) {
      console.error('Failed to generate puzzle:', error);
      showMessage('Failed to generate puzzle', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLetterPress = (letter: string) => {
    setCurrentWord((prev) => prev + letter);
  };

  const handleDelete = () => {
    setCurrentWord((prev) => prev.slice(0, -1));
  };

  const handleShuffle = () => {
    if (!puzzle) return;
    const shuffled = [...outerLetters].sort(() => Math.random() - 0.5);
    setOuterLetters(shuffled);
  };

  const handleEnter = async () => {
    if (!puzzle || !currentWord) return;

    const validation = isValidWord(
      currentWord,
      puzzle.centerLetter,
      puzzle.letters,
      puzzle.validWords
    );

    if (!validation.valid) {
      showMessage(validation.reason || 'Invalid word', 'error');
      setShake(true);
      setTimeout(() => setShake(false), 300);
      setTimeout(() => setCurrentWord(''), 1000);
      
      if (Platform.OS !== 'web' && preferences.hapticsEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    // Check if already found
    if (foundWords.includes(currentWord.toLowerCase())) {
      showMessage('Already found!', 'info');
      setCurrentWord('');
      return;
    }

    // Valid word!
    const wordIsPangram = isPangram(currentWord, puzzle.letters);
    const wordScore = calculateWordScore(currentWord, wordIsPangram);
    const newFoundWords = [...foundWords, currentWord.toLowerCase()];
    const newScore = score + wordScore;

    setFoundWords(newFoundWords);
    setScore(newScore);
    setCurrentWord('');

    if (wordIsPangram) {
      showMessage('🎉 PANGRAM! +' + wordScore + ' points', 'success');
      if (Platform.OS !== 'web' && preferences.hapticsEnabled) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      showMessage('Great! +' + wordScore + ' points', 'success');
      if (Platform.OS !== 'web' && preferences.hapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }

    // Save state
    const newState = {
      puzzle,
      foundWords: newFoundWords,
      score: newScore,
      rank: getRankProgress(newScore, puzzle.maxScore).currentRank,
      hintsAvailable: calculateHintsAvailable(
        newFoundWords.length,
        preferences.difficulty,
        hintsUsed
      ),
      difficulty: preferences.difficulty,
    };
    await saveGameState(newState);
  };

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text);
    setMessageType(type);
    setMessageVisible(true);
    setTimeout(() => setMessageVisible(false), 2000);
  };

  const handleSelectHint = (type: HintType) => {
    if (!puzzle) return;

    const hintsAvailable = calculateHintsAvailable(
      foundWords.length,
      preferences.difficulty,
      hintsUsed
    );

    if (hintsAvailable === 0 && preferences.difficulty !== 'practice') {
      showMessage('No hints available', 'error');
      return;
    }

    const remainingWords = puzzle.validWords.filter(
      (word) => !foundWords.includes(word)
    );

    // Load definitions for hints (will be cached)
    const definitions = loadDefinitions();

    const hint = generateHint(type, remainingWords, definitions);
    if (hint) {
      setLastHint(hint);
      if (preferences.difficulty !== 'practice') {
        setHintsUsed((prev) => prev + 1);
      }
    }
  };

  const handleChangeDifficulty = (difficulty: DifficultyMode) => {
    const newPreferences = { ...preferences, difficulty };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const handleUpdatePreferences = (newPreferences: Preferences) => {
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const handleNewPuzzle = () => {
    generateNewPuzzle(preferences.difficulty);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!puzzle) {
    return (
      <ScreenContainer className="justify-center items-center">
        <Text className="text-white text-xl">Failed to load puzzle</Text>
        <Pressable
          onPress={() => generateNewPuzzle(preferences.difficulty)}
          style={({ pressed }) => [
            {
              backgroundColor: '#F6C915',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 24,
              marginTop: 20,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text className="text-gray-900 font-bold">Try Again</Text>
        </Pressable>
      </ScreenContainer>
    );
  }

  const rankProgress = getRankProgress(score, puzzle.maxScore);
  const hintsAvailable = calculateHintsAvailable(
    foundWords.length,
    preferences.difficulty,
    hintsUsed
  );

  return (
    <ScreenContainer className="bg-[#111827]">
      <MessageDisplay
        message={message}
        type={messageType}
        visible={messageVisible}
      />

      {/* Header with Settings and Hints */}
      <View className="flex-row justify-between items-center px-6 py-3">
        <Pressable
          onPress={() => setSettingsModalVisible(true)}
          style={({ pressed }) => [
            {
              backgroundColor: '#4B5563',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text className="text-white font-semibold">⚙️ Settings</Text>
        </Pressable>

        <Pressable
          onPress={() => setHintModalVisible(true)}
          style={({ pressed }) => [
            {
              backgroundColor: '#8B5CF6',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Text className="text-white font-semibold">
            💡 Hints ({hintsAvailable === 999 ? '∞' : hintsAvailable})
          </Text>
        </Pressable>
      </View>

      {/* Score Display */}
      <ScoreDisplay
        score={score}
        maxScore={puzzle.maxScore}
        rank={rankProgress.currentRank}
        progress={rankProgress.percentage}
      />

      {/* Current Word Display */}
      <CurrentWordDisplay word={currentWord} shake={shake} />

      {/* Honeycomb Grid */}
      <View className="py-8">
        <HoneycombGrid
          centerLetter={puzzle.centerLetter}
          outerLetters={outerLetters}
          onLetterPress={handleLetterPress}
          hapticsEnabled={preferences.hapticsEnabled}
        />
      </View>

      {/* Control Buttons */}
      <View className="pb-6">
        <ControlButtons
          onEnter={handleEnter}
          onDelete={handleDelete}
          onShuffle={handleShuffle}
          hapticsEnabled={preferences.hapticsEnabled}
        />
      </View>

      {/* Found Words List */}
      <FoundWordsList words={foundWords} pangrams={puzzle.pangrams} />

      {/* Modals */}
      <HintModal
        visible={hintModalVisible}
        onClose={() => setHintModalVisible(false)}
        onSelectHint={handleSelectHint}
        hintsAvailable={hintsAvailable}
        lastHint={lastHint}
      />

      <DifficultyModal
        visible={difficultyModalVisible}
        onClose={() => setDifficultyModalVisible(false)}
        onSelect={handleChangeDifficulty}
        currentDifficulty={preferences.difficulty}
      />

      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        onNewPuzzle={handleNewPuzzle}
        onChangeDifficulty={() => setDifficultyModalVisible(true)}
      />
    </ScreenContainer>
  );
}
