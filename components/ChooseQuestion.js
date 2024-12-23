import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ModalWindow from './ModalWindow';

const ChooseQuestion = ({ content, displayMode, setDisplayMode, disableSwitch, enableSwitch, onAnswer }) => {
  const { question, miniQuestionDTO, textList } = content;
  const [placedAnswers, setPlacedAnswers] = useState({});
  const [availableWords, setAvailableWords] = useState(textList);
  const [selectedWord, setSelectedWord] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    const usedWordIds = Object.values(placedAnswers).map((word) => word?.id);
    setAvailableWords(textList.filter((word) => !usedWordIds.includes(word.id)));
  }, [placedAnswers]);
  
      useEffect(() => {
          disableSwitch();  // Блокуємо перемикач, коли завдання активне
      }, []);

  const handleWordSelect = (word) => {
    if (isBlocked) return;
    setSelectedWord((prev) => (prev?.id === word.id ? null : word));
  };

  const handleWordPlace = (textId) => {
    if (isBlocked || !selectedWord) return;
    setPlacedAnswers((prev) => ({
      ...prev,
      [textId]: selectedWord,
    }));
    setSelectedWord(null);
  };

  const handleWordReturn = (textId) => {
    if (isBlocked) return;
    const wordToReturn = placedAnswers[textId];
    setPlacedAnswers((prev) => {
      const updated = { ...prev };
      delete updated[textId];
      return updated;
    });
    setAvailableWords((prev) => [...prev, wordToReturn]);
  };

  useEffect(() => {
    if (Object.keys(placedAnswers).length === miniQuestionDTO.length) {
      validateAnswers();
    }
  }, [placedAnswers]);

  const validateAnswers = () => {
    const allCorrect = miniQuestionDTO.every((miniQuestion) => {
      const userAnswer = placedAnswers[miniQuestion.textId]?.id;
      return userAnswer === miniQuestion.textId;
    });
  
    setIsCorrect(allCorrect);
    setIsBlocked(true); // Блокування після перевірки
    setShowModal(true);
  
    // Виклик onAnswer після обчислення allCorrect
    onAnswer({ id: content.question.id, isCorrect: allCorrect });
  };
  

  const getDisplayKey = (mode) => {
    switch (mode) {
      case 'kanji':
        return 'kanji_word';
      case 'hiragana':
        return 'hiragana_or_katakana';
      case 'romanji':
        return 'romanji_word';
      default:
        return 'translation';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.question}</Text>
  
      <View style={styles.gameContainer}>
  
        {/* Questions and answer slots */}
        <View style={styles.questionsGridContainer}>
        <View style={styles.questionsGridContainer}>
          {miniQuestionDTO.map((miniQuestion) => (
            <TouchableOpacity
              key={miniQuestion.textId}
              style={styles.questionRow}
              onPress={() =>
                placedAnswers[miniQuestion.textId]
                  ? handleWordReturn(miniQuestion.textId)
                  : handleWordPlace(miniQuestion.textId)
              }
            >
              {/* Question text */}
              <Text style={styles.miniQuestionText}>
                {miniQuestion.miniQuestion}
              </Text>
  
              {/* Answer slot */}
              <View
                style={[
                  styles.answerSlot,
                  placedAnswers[miniQuestion.textId] && styles.filledAnswerSlot,
                ]}
              >
                <Text style={styles.answerText}>
                  {placedAnswers[miniQuestion.textId]?.[getDisplayKey(displayMode)] ||
                    'Place your answer here'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
                  <View style={styles.wordsContainer}>
          {availableWords.map((word) => (
            <TouchableOpacity
              key={word.id}
              style={[
                styles.wordButton,
                selectedWord?.id === word.id && styles.selectedWordButton,
              ]}
              onPress={() => handleWordSelect(word)}
            >
              <Text style={styles.wordText}>{word[getDisplayKey(displayMode)]}</Text>
            </TouchableOpacity>
          ))}
          </View>
        </View>
        </View>
      </View>
  
      {showModal && (
        <ModalWindow
          isCorrect={isCorrect}
          correctAnswer={isCorrect ? 'All answers are correct!' : 'Some answers are incorrect.'}
          description={question.description}
          visible={showModal}
          setVisible={setShowModal}
          onClose={enableSwitch}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'left',
    flexWrap: 'wrap',
    marginRight: 8,
  },
  gameContainer: {
    flex: 1,
  },
  questionsGridContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: 0,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 16,
    width: '100%',
  },
  miniQuestionText: {
    fontSize: 18,
    color: '#444',
    paddingRight: 8,
    textAlign: 'left',
    flexShrink: 1,
    flexWrap: 'wrap',
    width: '60%',
    minWidth: 120,
    maxWidth: '60%', // Adjust maxWidth to use the available space
  },
  answerSlot: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
    minWidth: 120,
    maxWidth: 180,
    marginBottom: 8,
  },
  filledAnswerSlot: {
    backgroundColor: '#e0f7fa',
  },
  answerText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
    gap: 4,
    justifyContent: 'space-between',
  },
  wordButton: {
    backgroundColor: '#e0e0e0',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    marginBottom: 8,
  },
  selectedWordButton: {
    backgroundColor: '#bbdefb',
  },
  wordText: {
    color: '#333',
    fontSize: 14,
    textAlign: 'center',
    flexWrap: 'wrap',  // Allows the text to wrap if needed
  },
});

export default ChooseQuestion;
