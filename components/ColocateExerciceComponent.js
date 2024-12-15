import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';

const ColocateExerciseComponent = ({ content, displayMode }) => {
  const [selectedWords, setSelectedWords] = useState([]);
  const [remainingWords, setRemainingWords] = useState([]);

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
  }, [displayMode, content]);

  const handleWordPress = (word) => {
    setSelectedWords([...selectedWords, word]);
    setRemainingWords(remainingWords.filter((w) => w !== word));
  };

  const handleWordRemoval = (word) => {
    setSelectedWords(selectedWords.filter((w) => w !== word));
    setRemainingWords([...remainingWords, word]);
  };

  const getTextColor = () => {
    switch (displayMode) {
      case 'kanji':
        return '#000000'; // Black for Kanji
      case 'hiragana':
        return '#0000FF'; // Blue for Hiragana
      case 'romanji':
        return '#FF0000'; // Red for Romanji
      default:
        return '#000000'; // Default black color
    }
  };

  const handleCheckAnswer = () => {
    // Тут можна додати перевірку правильності
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

      <View style={styles.buttonContainer}>
        <Button title="Перевірити" onPress={handleCheckAnswer} />
      </View>
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
    flexDirection: 'row',           // Розміщення слів в ряд
    flexWrap: 'wrap',               // Перехід на новий рядок
    justifyContent: 'center',       // Вирівнювання вибраних слів по центру
    borderWidth: 1,                 // Обводка навколо контейнера
    borderColor: '#ccc',            // Колір обводки
    padding: 10,                    // Внутрішній відступ
    width: '100%',    
    minWidth: 300,               // Ширина контейнера 100%
    height: '40%',                    // Фіксована висота або висота, яку ви хочете
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
    marginBottom: 0,
  },
});

export default ColocateExerciseComponent;
