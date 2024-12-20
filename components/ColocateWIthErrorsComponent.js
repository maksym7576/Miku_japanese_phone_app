import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import ModalWindow from './ModalWindow';

const SentenceCorrectionComponent = (props) => {
  const [sentence, setSentence] = useState([]);
  const [removedWords, setRemovedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [remainingChanges, setRemainingChanges] = useState(0);
  const [progress] = useState(new Animated.Value(0));
  const [isResetVisible, setIsResetVisible] = useState(false);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (!isBlocked) {
      initializeWords();
    }
  }, [props.displayMode, props.content]);

  const initializeWords = () => {
    const sentence = getWordsArray();
    const availableWords = initializeAvailableWords();
    const initialChanges = props.content.needsToBeChanged * 2;

    setSentence(sentence);
    setAvailableWords(availableWords);
    setRemainingChanges(initialChanges);
    setIsResetVisible(false);
    setRemovedWords([]);
    setIsTimerComplete(false);
  };

  const getWordsArray = () => {
    const { displayMode, content } = props;
    return displayMode === 'kanji'
      ? content.colocateWords.wordsKanjiArray
      : displayMode === 'hiragana'
      ? content.colocateWords.wordsHiraganaKatakanaArray
      : content.colocateWords.wordsRomanjiArray;
  };

  const initializeAvailableWords = () => {
    const { displayMode, content } = props;
    return displayMode === 'kanji'
      ? content.correctWordsKatakana
      : displayMode === 'hiragana'
      ? content.correctsWordsHiraganaKanji
      : content.correctWordsRomanji;
  };

  const handleWordRemove = (index) => {
    if (remainingChanges > 0 && sentence[index] !== '') {
      const updatedSentence = [...sentence];
      const removedWord = updatedSentence[index];

      updatedSentence[index] = '';
      setSentence(updatedSentence);
      setRemovedWords([...removedWords, removedWord]);

      const newRemainingChanges = remainingChanges - 1;
      setRemainingChanges(newRemainingChanges);

      if (newRemainingChanges === 0) {
        setIsResetVisible(true);
        startProgress();
      }
    }
  };

  const handleWordAdd = (word) => {
    if (remainingChanges > 0) {
      const emptyIndex = sentence.indexOf('');
      if (emptyIndex !== -1) {
        const updatedSentence = [...sentence];
        updatedSentence[emptyIndex] = word;

        const updatedRemovedWords = removedWords.filter(w => w !== word);
        const updatedAvailableWords = availableWords.filter(w => w !== word);

        setSentence(updatedSentence);
        setRemovedWords(updatedRemovedWords);
        setAvailableWords(updatedAvailableWords);

        const newRemainingChanges = remainingChanges - 1;
        setRemainingChanges(newRemainingChanges);

        if (newRemainingChanges === 0) {
          setIsResetVisible(true);
          startProgress();
        }
      }
    }
  };

  const startProgress = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      setIsTimerComplete(true);
      setShowModal(true);
      setIsBlocked(true); // Блокування після завершення таймера
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetExercise();
  };

  const resetExercise = () => {
    progress.setValue(0);
    setShowModal(false)
    setIsBlocked(false); // Зняття блокування при скиданні вправи
    initializeWords();
  };

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isWordInteractionDisabled = remainingChanges === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sentence Correction</Text>

      <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />

      <Text style={styles.needsToBeChanged}>
        Changes remaining: {remainingChanges}
      </Text>

      <View style={styles.sentenceContainer}>
        {sentence.map((word, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleWordRemove(index)}
            disabled={isWordInteractionDisabled}
            style={[
              styles.wordButton,
              isWordInteractionDisabled && styles.disabledButton
            ]}
          >
            <Text style={styles.word}>{word || '_____'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subHeader}>Available Words</Text>

      <View style={styles.wordsContainer}>
        {removedWords.map((word, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleWordAdd(word)}
            disabled={isWordInteractionDisabled}
            style={[
              styles.wordButton,
              isWordInteractionDisabled && styles.disabledButton
            ]}
          >
            <Text style={styles.word}>{word}</Text>
          </TouchableOpacity>
        ))}
        {availableWords.map((word, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleWordAdd(word)}
            disabled={isWordInteractionDisabled}
            style={[
              styles.wordButton,
              isWordInteractionDisabled && styles.disabledButton
            ]}
          >
            <Text style={styles.word}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isResetVisible && (
        <View style={styles.resetWrapper}>
          <TouchableOpacity 
            onPress={resetExercise} 
            disabled={isTimerComplete}
            style={[
              styles.resetButton,
              isTimerComplete && styles.disabledButton
            ]}
          >
            <Text style={styles.resetButtonText}>Reset Exercise</Text>
          </TouchableOpacity>
        </View>
      )}

      {showModal && (
        <ModalWindow
          isCorrect={remainingChanges === 0}
          correctAnswer="NA"
          description="NA"
          visible={showModal}
          setVisible={setShowModal}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'blue',
    alignSelf: 'flex-start',
  },
  sentenceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  wordButton: {
    margin: 4,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  word: {
    fontSize: 16,
  },
  needsToBeChanged: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resetButton: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 20,
    borderRadius: 4,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
  },
  resetWrapper: {
    alignItems: 'center',
  },
});

export default SentenceCorrectionComponent;
