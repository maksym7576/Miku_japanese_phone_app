import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const QuestionComponent = ({ question }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);

    if (!question || !question.question || !question.answerMangas) {
        return <Text>No questions available</Text>;
    }

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
        
        // Перевірка правильності відповіді
        const isCorrectAnswer = 
            answer.answer_romanji === question.correct_answer_romanized ||
            answer.answer_hiragana_katakana === question.correct_answer_hiragana_or_katakana;
        
        setIsCorrect(isCorrectAnswer);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>{question.question}</Text>
            
            {question.answerMangas.map((answer) => (
                <TouchableOpacity 
                    key={answer.id} // Унікальний ключ
                    style={[
                        styles.answerButton,
                        selectedAnswer === answer && styles.selectedButton,
                        selectedAnswer === answer && (isCorrect ? styles.correctButton : styles.incorrectButton),
                        question.correct_answer_romanized === answer.answer_romanji && styles.correctButton // Підсвітка правильної відповіді
                    ]}
                    onPress={() => handleAnswerSelect(answer)}
                >
                    <Text style={styles.answerText}>
                        {answer.answer_hiragana_katakana || answer.answer_romanji}
                    </Text>
                </TouchableOpacity>
            ))}

            {selectedAnswer && (
                <Text style={[
                    styles.resultText, 
                    isCorrect ? styles.correctText : styles.incorrectText
                ]}>
                    {isCorrect ? 'Correct!' : 'Incorrect. Try again.'}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginVertical: 8,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    answerButton: {
        backgroundColor: '#e0e0e0',
        padding: 12,
        borderRadius: 6,
        marginVertical: 4,
    },
    selectedButton: {
        borderWidth: 2,
        borderColor: '#007bff',
    },
    correctButton: {
        backgroundColor: '#d4edda',
    },
    incorrectButton: {
        backgroundColor: '#f8d7da',
    },
    answerText: {
        textAlign: 'center',
        fontSize: 16,
    },
    resultText: {
        marginTop: 12,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    correctText: {
        color: '#28a745',
    },
    incorrectText: {
        color: '#dc3545',
    },
});

export default QuestionComponent;
