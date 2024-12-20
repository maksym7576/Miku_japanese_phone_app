import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import correctIcon from '../assets/isCorrectsStates/miku_ok.png'; 
import incorrectIcon from '../assets/isCorrectsStates/miku_not.png';
import ModalWindow from './ModalWindow';

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

        setModalMessage(findCorrectAnswer()?.[displayMode === 'kanji' ? 'kanji_word' : 
            displayMode === 'hiragana' ? 'hiragana_or_katakana' : 
            displayMode === 'romanji' ? 'romanji_word' : 'question'] || 'N/A');
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
                return answer.question;
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
            {showModal === true && (
            <ModalWindow
                isCorrect={isCorrectAnswer}
                correctAnswer={modalMessage}
                description={question.description}
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
        alignItems: 'left',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        elevation: 10, 
        padding: 20,
        borderRadius: 8,
        // textAlign: 'left',
        width: '100%',
        // alignItems: 'center',
    },
    modalContainerCorrect: {
        backgroundColor: '#d4e5ed', // Світло-зелений (пастельний)
        elevation: 5, // Легка тінь
        padding: 20,
        borderRadius: 12, // Більше заокруглення
        width: '100%',
        opacity: 0.95, // Майже повна прозорість
        borderWidth: 1,
        borderColor: '#c3e6cb', // Трохи темніша рамка
    },
    
    modalContainerIncorrect: {
        backgroundColor: '#f8d7da', // Світло-червоний (пастельний)
        elevation: 5,
        padding: 20,
        borderRadius: 12,
        width: '100%',
        opacity: 0.95,
        borderWidth: 1,
        borderColor: '#f5c6cb', // Трохи темніша рамка
    },
    
    icon: {
        alignItems: 'flex-end',
        width: 120,
        height: 120,
        // marginBottom: 20,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: 'left',
    },
    continueButtonCorrect: {
        backgroundColor: '#4a90e2', // М'який синій відтінок
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8, // Більше заокруглення
        alignItems: 'center',
        shadowColor: '#000', // Тінь для об'єму
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4, // Тінь для Android
    },
    continueButtonError: {
        backgroundColor: '#e24a51', // М'який синій відтінок
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8, // Більше заокруглення
        alignItems: 'center',
        shadowColor: '#000', // Тінь для об'єму
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4, // Тінь для Android
    },
    continueText: {
        color: '#ffffff', // Білий текст
        fontSize: 16,
        fontWeight: '600', // Напівжирний текст
        letterSpacing: 0.5,
    },

});

export default QuestionComponent;
