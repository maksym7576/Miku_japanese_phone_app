import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import ModalWindow from './ModalWindow';

const SentenceCorrectionComponent = (props) => {
  const [state, setState] = useState({
    sentence: [],
    removedWords: [],
    availableWords: [],
    phrase: '',
    showModal: false,
    remainingChanges: 0,
    progress: new Animated.Value(0),
    isResetVisible: false,
    isTimerComplete: false,
    isBlocked: false,
    isCorrect: false,
    isInitialized: false,
    hasCompletedOnce: false,
    isChecking: false,
  });


  useEffect(() => {

    if (state.isChecking || state.hasCompletedOnce) {
      return;
    }
    
    const wasBlocked = state.isBlocked;
    const wasTimerComplete = state.isTimerComplete;
    const hadCompleted = state.hasCompletedOnce;
    const wasShowingModal = state.showModal;
    const wasChecking = state.isChecking;
    
    initializeWords(wasBlocked, wasTimerComplete, hadCompleted, wasShowingModal, wasChecking);
  }, [props.displayMode, props.content, props.disableSwitch, props.enableSwitch]);

  const initializeWords = (wasBlocked, wasTimerComplete, hadCompleted, wasShowingModal, wasChecking) => {
    const { content } = props;
    
    const sentence = content.colocateWords.wordsList.map(word => ({
      wordObject: word,
      isEmpty: false
    }));

    const availableWords = content.correctWordsList;
    const initialChanges = wasBlocked ? 0 : content.needsToBeChanged * 2;
    const phrase = getCorrectPhrase();

    setState((prevState) => ({
      ...prevState,
      sentence,
      availableWords,
      phrase,
      remainingChanges: initialChanges,
      isResetVisible: wasChecking,
      removedWords: [],
      isTimerComplete: wasTimerComplete,
      isBlocked: wasBlocked,
      isInitialized: true,
      hasCompletedOnce: hadCompleted,
      showModal: wasShowingModal,
      isChecking: wasChecking
    }));
  };

  useEffect(() => {
    props.disableSwitch();  // Блокуємо перемикач, коли завдання активне
}, []);

  const getWordValue = (wordObject) => {
    const { displayMode } = props;
    if (!wordObject) return '';

    switch (displayMode) {
      case 'kanji':
        return wordObject.kanji_word;
      case 'hiragana':
        return wordObject.hiragana_or_katakana;
      case 'romanji':
        return wordObject.romanji_word;
      default:
        return '';
    }
  };

  const getCorrectPhrase = () => {
    const { displayMode, content } = props;
    const phrase = (() => {
      switch (displayMode) {
        case 'kanji':
          return content.colocateWords.correctKanji;
        case 'hiragana':
          return content.colocateWords.correctHiraganaKatakana;
        case 'romanji':
          return content.colocateWords.correctRomanji;
        default:
          return '';
      }
    })();
    return phrase;
  };

  const handleWordRemove = (index) => {
    if (state.remainingChanges > 0 && !state.sentence[index].isEmpty) {
      const updatedSentence = [...state.sentence];
      const removedWordObject = updatedSentence[index].wordObject;

      updatedSentence[index] = { wordObject: null, isEmpty: true };

      setState((prevState) => ({
        ...prevState,
        sentence: updatedSentence,
        removedWords: [...prevState.removedWords, removedWordObject],
        remainingChanges: prevState.remainingChanges - 1,
      }));
    }
  };

  const handleWordAdd = (wordObject) => {
    if (state.remainingChanges > 0) {
      const emptyIndex = state.sentence.findIndex((item) => item.isEmpty);
  
      if (emptyIndex !== -1) {
        const updatedSentence = [...state.sentence];
        updatedSentence[emptyIndex] = { wordObject, isEmpty: false };
  
        const updatedRemovedWords = state.removedWords.filter(
          (w) =>
            !(
              w.kanji_word === wordObject.kanji_word &&
              w.hiragana_or_katakana === wordObject.hiragana_or_katakana &&
              w.romanji_word === wordObject.romanji_word
            )
        );
  
        const updatedAvailableWords = state.availableWords.filter(
          (w) =>
            !(
              w.kanji_word === wordObject.kanji_word &&
              w.hiragana_or_katakana === wordObject.hiragana_or_katakana &&
              w.romanji_word === wordObject.romanji_word
            )
        );
  
        setState((prevState) => ({
          ...prevState,
          sentence: updatedSentence,
          removedWords: updatedRemovedWords,
          availableWords: updatedAvailableWords,
          remainingChanges: prevState.remainingChanges - 1,
        }));
      }
    }
  };

  useEffect(() => {
    if (state.isInitialized && state.remainingChanges === 0 && !state.isBlocked) {
      startProgress();
    }
  }, [state.remainingChanges, state.isInitialized]);

  const startProgress = () => {
    setState(prevState => ({
      ...prevState,
      isChecking: true,
      isResetVisible: true
    }));

    Animated.timing(state.progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => {
      setState((prevState) => ({
        ...prevState,
        isTimerComplete: true,
        showModal: true,
        isBlocked: true,
        hasCompletedOnce: true,
      }));
      checkCorrectness();
    });
  };

  const checkCorrectness = () => {
    const { displayMode } = props;
    const filledWords = state.sentence.map(item => item.wordObject).filter(Boolean);
    const currentSentence = filledWords
      .map(wordObj => getWordValue(wordObj))
      .join(displayMode === 'romanji' ? ' ' : '');

    setState((prevState) => ({
      ...prevState,
      isCorrect: currentSentence === state.phrase,
    }));
  };

  const resetExercise = () => {
    state.progress.setValue(0);
    setState((prevState) => ({
      ...prevState,
      showModal: false,
      isBlocked: false,
      isInitialized: false,
      hasCompletedOnce: false,
      isChecking: false,
      isResetVisible: false,
      isTimerComplete: false
    }));
    initializeWords(false, false, false, false, false);
  };

  const progressBarWidth = state.progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isWordInteractionDisabled = state.remainingChanges === 0;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Find and Fix Errors</Text>

      <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />

      <Text style={styles.needsToBeChanged}>
        Changes remaining: {state.remainingChanges}
      </Text>

      <View style={styles.sentenceContainer}>
        {state.sentence.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleWordRemove(index)}
            disabled={isWordInteractionDisabled}
            style={[styles.wordButton, isWordInteractionDisabled && styles.disabledButton]}
          >
            <Text style={styles.word}>
              {item.isEmpty ? '_____' : getWordValue(item.wordObject)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subHeader}>Available Words</Text>

      <View style={styles.wordsContainer}>
        {state.removedWords.map((wordObject, index) => (
          <TouchableOpacity
            key={`removed-${index}`}
            onPress={() => handleWordAdd(wordObject)}
            disabled={isWordInteractionDisabled}
            style={[styles.wordButton, isWordInteractionDisabled && styles.disabledButton]}
          >
            <Text style={styles.word}>{getWordValue(wordObject)}</Text>
          </TouchableOpacity>
        ))}
        {state.availableWords.map((wordObject, index) => (
          <TouchableOpacity
            key={`available-${index}`}
            onPress={() => handleWordAdd(wordObject)}
            disabled={isWordInteractionDisabled}
            style={[styles.wordButton, isWordInteractionDisabled && styles.disabledButton]}
          >
            <Text style={styles.word}>{getWordValue(wordObject)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {state.isResetVisible && !state.isTimerComplete && (
        <View style={styles.resetWrapper}>
          <TouchableOpacity 
            onPress={resetExercise} 
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Reset Exercise</Text>
          </TouchableOpacity>
        </View>
      )}

      {state.showModal && (
        <ModalWindow
          isCorrect={state.isCorrect}
          correctAnswer={state.phrase}
          description={props.content.colocateWords.translation}
          visible={state.showModal}
          setVisible={(visible) => setState((prevState) => ({ ...prevState, showModal: visible }))} 
          onClose={props.enableSwitch}
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