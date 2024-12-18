import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SentenceCorrectionComponent = ({ content, displayMode }) => {
  // Вибір початкових слів залежно від режиму
  const getWordsArray = () => {
    return displayMode === 'kanji'
      ? content.colocateWords.wordsKanjiArray
      : displayMode === 'hiragana'
      ? content.colocateWords.wordsHiraganaKatakanaArray
      : content.colocateWords.wordsRomanjiArray;
  };

  const [sentence, setSentence] = useState(getWordsArray());
  const [removedWords, setRemovedWords] = useState([]);
  const [availableWords, setAvailableWords] = useState(
    displayMode === 'kanji'
      ? content.correctWordsKatakana
      : displayMode === 'hiragana'
      ? content.correctsWordsHiraganaKanji
      : content.correctWordsRomanji
  );

  // Видалення слова з речення
  const handleWordRemove = (index) => {
    const updatedSentence = [...sentence];
    const removedWord = updatedSentence[index];

    if (removedWord !== '') {
      setRemovedWords([...removedWords, removedWord]);
      updatedSentence[index] = ''; // Порожнє місце в реченні
      setSentence(updatedSentence);
    }
  };

  // Додавання слова до першого доступного місця
  const handleWordAdd = (word) => {
    const emptyIndex = sentence.indexOf('');

    if (emptyIndex !== -1) {
      const updatedSentence = [...sentence];
      updatedSentence[emptyIndex] = word;
      setSentence(updatedSentence);

      setRemovedWords(removedWords.filter((w) => w !== word));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sentence Correction</Text>

      {/* Відображення речення */}
      <View style={styles.sentenceContainer}>
        {sentence.map((word, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleWordRemove(index)}
            style={styles.wordButton}
          >
            <Text style={styles.word}>{word || '_____'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subHeader}>Available Words</Text>

      {/* Відображення доступних слів */}
      <View style={styles.wordsContainer}>
        {removedWords.concat(availableWords).map((word, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleWordAdd(word)}
            style={styles.wordButton}
          >
            <Text style={styles.word}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  word: {
    fontSize: 16,
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
});

export default SentenceCorrectionComponent;
