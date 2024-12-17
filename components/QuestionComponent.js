import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import correctIcon from '../assets/check-circle.png'; 
import incorrectIcon from '../assets/octagon-xmark.png';

const QuestionComponent = ({ question, answers, displayMode }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [answerHistory, setAnswerHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

    useEffect(() => {
        loadStoredData();
    }, []);

    const loadStoredData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('quizResults');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setAnswerHistory(parsedData.answerHistory || []);
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    };

    useEffect(() => {
        // Reset button and modal state when displayMode changes
        setSelectedAnswer(null);
        setIsButtonDisabled(false);
        setShowModal(false);
    }, [displayMode]);

    const saveQuizResults = async () => {
        try {
            const quizData = { answerHistory };
            await AsyncStorage.setItem('quizResults', JSON.stringify(quizData));
        } catch (error) {
            console.error('Error saving quiz results:', error);
        }
    };

    const handleAnswerSelect = async (selected) => {
        setSelectedAnswer(selected);
        setIsButtonDisabled(true);
        const isCorrect = selected.correct;
        const answerRecord = {
            questionId: question.id,
            answerId: selected.id,
            isCorrect,
        };

        setModalMessage(`Correct answer: ${findCorrectAnswer()?.romanji_word || 'N/A'}`);
        setIsCorrectAnswer(isCorrect);
        setAnswerHistory((prev) => [...prev, answerRecord]);
        setShowModal(true);

        await saveQuizResults();
    };

    const findCorrectAnswer = () => {
        return answers?.find((item) => item.correct);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const getDisplayedAnswer = (answer) => {
        switch (displayMode) {
            case 'kanji':
                return answer.kanji_word;
            case 'hiragana':
                return answer.hiragana_or_katakana;
            case 'romanji':
                return answer.romanji_word;
            default:
                return answer.kanji_word;
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>{question?.question || 'No question available'}</Text>

            {answers && answers.length > 0 ? (
                answers.map((option) => (
                    <TouchableOpacity
                        key={option.id}
                        style={[
                            styles.answerButton,
                            isButtonDisabled && styles.disabledButton,
                            selectedAnswer === option && (
                                option.correct ? styles.correctButton : styles.incorrectButton
                            ),
                        ]}
                        onPress={() => handleAnswerSelect(option)}
                        disabled={isButtonDisabled}
                    >
                        <Text style={styles.answerText}>{getDisplayedAnswer(option)}</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={styles.noAnswersText}>No answers available</Text>
            )}

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
                        {question?.description && (
                            <Text style={styles.modalMessage}>{question.description}</Text>
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
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
    },
    questionText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    answerButton: {
        backgroundColor: '#e0e0e0',
        padding: 12,
        borderRadius: 6,
        marginVertical: 8,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',
    },
    correctButton: {
        backgroundColor: '#d4edda',
    },
    incorrectButton: {
        backgroundColor: '#f8d7da',
    },
    answerText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
    },
    noAnswersText: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    icon: {
        width: 50,
        height: 50,
        marginBottom: 20,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    continueButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    continueText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default QuestionComponent;
