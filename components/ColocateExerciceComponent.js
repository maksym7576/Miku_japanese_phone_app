import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Modal, Image } from 'react-native';

import correctIcon from '../assets/check-circle.png'; 
import incorrectIcon from '../assets/octagon-xmark.png';

const ColocateExerciseComponent = ({ content, displayMode }) => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false); // Correct answer check
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    // Оновлення масивів слів залежно від displayMode
    switch (displayMode) {
      case 'kanji':
        setRemainingWords(content.object.colocateWordsDTO.wordsKanjiArray);
        break;
      case 'hiragana':
        setRemainingWords(content.object.colocateWordsDTO.wordsHiraganaKatakanaArray);
        break;
      case 'romanji':
        setRemainingWords(content.object.colocateWordsDTO.wordsRomanjiArray);
        break;
      default:
        setRemainingWords(content.object.colocateWordsDTO.wordsKanjiArray);
        break;
    }
    // Очистити вибрані слова при зміні displayMode
    setSelectedWords([]);
    setShowModal(false);
  }, [displayMode, content]);

  useEffect(() => {
    // Перевірка, чи залишилось тільки одне слово в remainingWords
    if (remainingWords.length === 0) {
      handleCheckAnswer(); // Якщо залишилось тільки одне слово, викликаємо перевірку
    }
  }, [remainingWords]); // Стежимо за змінами в remainingWords

  const handleWordPress = (word) => {
    // Додаємо вибране слово до масиву selectedWords
    setSelectedWords([...selectedWords, word]);
    
    // Видаляємо вибране слово з масиву remainingWords
    setRemainingWords(remainingWords.filter((w) => w !== word));
  };
  const handleWordRemoval = (word) => {
    setSelectedWords(selectedWords.filter((w) => w !== word));
    setRemainingWords([...remainingWords, word]);
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
        correctAnswer = content.object.colocateWordsDTO.correctKanji; // Default to kanji if displayMode is undefined
    }
  
    // Join the selected words into a string and compare
    const userAnswer = selectedWords.join(''); // Join the selected words into a single string
    const userRomanjiAnswer = selectedWords.join(' ');
    if (userAnswer === correctAnswer || userRomanjiAnswer === correctAnswer) {
      setIsCorrectAnswer(true);
      setModalMessage('Correct answer!');
    } else {
      setIsCorrectAnswer(false);
      setModalMessage('Incorrect answer. Try again!');
    }
  
    setShowModal(true); // Show the modal after checking
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
          >
            <Text style={styles.selectedWord}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.wordsContainer}>
        {remainingWords.map((word, index) => (
          <TouchableOpacity
            key={index}
            style={styles.wordButton}
            onPress={() => handleWordPress(word)}
          >
            <Text style={styles.wordText}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal component */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Image
              source={isCorrectAnswer ? correctIcon : incorrectIcon}
              style={styles.icon}
            />
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            {content.object.question.description && (
              <Text style={styles.modalMessage}>{content.object.question.description}</Text>
            )}
            <TouchableOpacity style={styles.continueButton} onPress={handleCloseModal}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  buttonContainer: {
      position: 'absolute',
      bottom: 20, // Distance from the bottom of the screen
      left: 0,
      right: 0,
      marginBottom: 20, // Optional: to give some space from the bottom
      paddingHorizontal: 20, // Optional: to give padding left and right
      alignItems: 'center', // Center the button ho
    
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
