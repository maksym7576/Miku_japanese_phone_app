import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';

import correctIcon from '../assets/check-circle.png'; 
import incorrectIcon from '../assets/octagon-xmark.png';
import ModalWindow from './ModalWindow';

const ColocateExerciseComponent = ({ content, displayMode }) => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);
  const [phrase, setPhase] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isDisplayModeChanging, setIsDisplayModeChanging] = useState(false);
  useEffect(() => {
    setIsDisplayModeChanging(true);
    
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
  
    // Додаємо порівняння поточних і нових слів
    const currentWords = [...selectedWords, ...remainingWords];
    const hasWordsChanged = currentWords.length !== newWords.length || 
      currentWords.some((word, index) => word !== newWords[index]);
  
    if (selectedWords.length > 0 && hasWordsChanged) {
      const updatedSelected = selectedWords.map((_, index) => newWords[index]);
      const remainingNewWords = newWords.slice(selectedWords.length);
      
      setSelectedWords(updatedSelected);
      setRemainingWords(remainingNewWords);
    } else if (!selectedWords.length) {
      setRemainingWords(newWords);
    }
    
    setIsDisplayModeChanging(false);
  }, [displayMode, content]);
  
  // Змінимо умову перевірки відповіді
  useEffect(() => {
    console.log('remainingWords:', remainingWords);
    console.log('selectedWords:', selectedWords);
    console.log('isDisplayModeChanging:', isDisplayModeChanging);
    
    if (!isDisplayModeChanging && remainingWords.length === 0 && selectedWords.length > 0) {
      console.log('Triggering check answer');
      handleCheckAnswer();
    }
  }, [remainingWords, selectedWords, isDisplayModeChanging]);

  const handleWordPress = (word) => {
    if (!isButtonDisabled) {
      // Додаємо вибране слово до масиву selectedWords
      setSelectedWords([...selectedWords, word]);
      
      // Видаляємо вибране слово з масиву remainingWords
      setRemainingWords(remainingWords.filter((w) => w !== word));
    }
  };

  const handleWordRemoval = (word) => {
    if (!showModal && !isButtonDisabled) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
      setRemainingWords([...remainingWords, word]);
    }
  };

  const handleCheckAnswer = () => {
    let correctAnswer = '';
  
    // Select the correct answer based on the displayMode
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
  
    // Join the selected words into a string and compare
    const userAnswer = selectedWords.join('');
    const userRomanjiAnswer = selectedWords.join(' ');
    
    setIsButtonDisabled(true);
    
    if (userAnswer === correctAnswer || userRomanjiAnswer === correctAnswer) {
      setIsCorrectAnswer(true);
      setModalMessage('Correct answer!');
    } else {
      setIsCorrectAnswer(false);
      setModalMessage('Incorrect answer. Try again!');
    }
  
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{content.object.question.question}</Text>

      <View style={styles.selectedWordsContainer}>
        {selectedWords.map((word, index) => (
          <TouchableOpacity
            key={index}
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
            key={index}
            style={[
              styles.wordButton,
              showModal && styles.disabledButton
            ]}
            onPress={() => handleWordPress(word)}
            disabled={showModal || isButtonDisabled}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
    {showModal === true && (
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