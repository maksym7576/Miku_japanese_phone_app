import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ModalWindow from './ModalWindow';

const ColocateExerciseComponent = ({ content, displayMode }) => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);
  const [phrase, setPhase] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [currentDisplayMode, setCurrentDisplayMode] = useState(displayMode);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      let initialWords = [];
      switch (displayMode) {
        case 'kanji':
          initialWords = content.object.colocateWordsDTO.wordsKanjiArray;
          setPhase(content.object.colocateWordsDTO.correctKanji);
          break;
        case 'hiragana':
          initialWords = content.object.colocateWordsDTO.wordsHiraganaKatakanaArray;
          setPhase(content.object.colocateWordsDTO.correctHiraganaKatakana);
          break;
        case 'romanji':
          initialWords = content.object.colocateWordsDTO.wordsRomanjiArray;
          setPhase(content.object.colocateWordsDTO.correctRomanji);
          break;
        default:
          initialWords = content.object.colocateWordsDTO.wordsKanjiArray;
          setPhase(content.object.colocateWordsDTO.correctKanji);
      }
      setRemainingWords(initialWords);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && currentDisplayMode !== displayMode) {
      setCurrentDisplayMode(displayMode);
      
      let newWords = [];
      switch (displayMode) {
        case 'kanji':
          newWords = content.object.colocateWordsDTO.wordsKanjiArray;
          setPhase(content.object.colocateWordsDTO.correctKanji);
          break;
        case 'hiragana':
          newWords = content.object.colocateWordsDTO.wordsHiraganaKatakanaArray;
          setPhase(content.object.colocateWordsDTO.correctHiraganaKatakana);
          break;
        case 'romanji':
          newWords = content.object.colocateWordsDTO.wordsRomanjiArray;
          setPhase(content.object.colocateWordsDTO.correctRomanji);
          break;
        default:
          newWords = content.object.colocateWordsDTO.wordsKanjiArray;
          setPhase(content.object.colocateWordsDTO.correctKanji);
      }

      if (selectedWords.length > 0) {
        const selectedIndices = selectedWords.map(word => {
          const currentWords = getCurrentWordsArray(currentDisplayMode);
          return currentWords.indexOf(word);
        });

        const updatedSelected = selectedIndices
          .filter(index => index !== -1)
          .map(index => newWords[index]);

        const selectedSet = new Set(updatedSelected);
        const remainingNewWords = newWords.filter(word => !selectedSet.has(word));

        setSelectedWords(updatedSelected);
        setRemainingWords(remainingNewWords);
      } else {
        setRemainingWords(newWords);
      }
    }
  }, [displayMode, content]);

  const getCurrentWordsArray = (mode) => {
    switch (mode) {
      case 'kanji':
        return content.object.colocateWordsDTO.wordsKanjiArray;
      case 'hiragana':
        return content.object.colocateWordsDTO.wordsHiraganaKatakanaArray;
      case 'romanji':
        return content.object.colocateWordsDTO.wordsRomanjiArray;
      default:
        return content.object.colocateWordsDTO.wordsKanjiArray;
    }
  };

  const handleWordPress = (word) => {
    if (!isButtonDisabled) {
      const newSelectedWords = [...selectedWords, word];
      setSelectedWords(newSelectedWords);
      setRemainingWords(remainingWords.filter((w) => w !== word));
      
      // Перевіряємо відповідь тільки якщо всі слова вибрані
      if (remainingWords.length === 1) {
        handleCheckAnswer(newSelectedWords);
      }
    }
  };

  const handleWordRemoval = (word) => {
    if (!showModal && !isButtonDisabled) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
      setRemainingWords([...remainingWords, word]);
    }
  };

  const handleCheckAnswer = (finalSelectedWords) => {
    let correctAnswer = '';
    switch (displayMode) {
      case 'kanji':
        correctAnswer = content.object.colocateWordsDTO.correctKanji;
        break;
      case 'hiragana':
        correctAnswer = content.object.colocateWordsDTO.correctHiraganaKatakana;
        break;
      case 'romanji':
        correctAnswer = content.object.colocateWordsDTO.correctRomanji;
        break;
      default:
        correctAnswer = content.object.colocateWordsDTO.correctKanji;
    }

    const userAnswer = finalSelectedWords.join('');
    const userRomanjiAnswer = finalSelectedWords.join(' ');
    
    setIsButtonDisabled(true);
    setIsCorrectAnswer(userAnswer === correctAnswer || userRomanjiAnswer === correctAnswer);
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{content.object.question.question}</Text>

      <View style={styles.selectedWordsContainer}>
        {selectedWords.map((word, index) => (
          <TouchableOpacity
            key={`${word}-${index}`}
            style={styles.selectedWordButton}
            onPress={() => handleWordRemoval(word)}
            disabled={showModal || isButtonDisabled}
          >
            <Text style={styles.selectedWord}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.wordsContainer}>
        {remainingWords.map((word, index) => (
          <TouchableOpacity
            key={`${word}-${index}`}
            style={[styles.wordButton, showModal && styles.disabledButton]}
            onPress={() => handleWordPress(word)}
            disabled={showModal || isButtonDisabled}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {showModal && (
        <ModalWindow
          isCorrect={isCorrectAnswer}
          correctAnswer={phrase}
          description={content.object.question.description}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 0,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
    width: '100%',
  },
  wordButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    maxWidth: '30%',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  wordText: {
    fontSize: 16,
  },
  selectedWordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '100%',
    minWidth: 300,
    minHeight: '40%',
  },
  selectedWordButton: {
    backgroundColor: '#d0d0d0',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  selectedWord: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ColocateExerciseComponent;