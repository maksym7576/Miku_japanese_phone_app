import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const ChooseQuestion = ({ content }) => {
    const [userAnswers, setUserAnswers] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const { question, miniQuestionDTO, textList } = content;

    const handleSelectWord = (miniQuestionId, selectedWord) => {
        setUserAnswers((prev) => ({
            ...prev,
            [miniQuestionId]: selectedWord,
        }));
    };

    const checkAnswers = () => {
        let correct = true;
        miniQuestionDTO.forEach(({ textId, miniQuestion }) => {
            const correctAnswer = textList.find((text) => text.id === textId);
            if (userAnswers[miniQuestion] !== correctAnswer?.kanji_word) {
                correct = false;
            }
        });

        setIsCorrect(correct);
        setShowModal(true);
    };

    const resetAnswers = () => {
        setUserAnswers({});
    };

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>{question.question}</Text>
            <Text style={styles.descriptionText}>{question.description}</Text>

            {miniQuestionDTO.map(({ miniQuestion, textId }) => (
                <View key={textId} style={styles.questionBlock}>
                    <Text style={styles.miniQuestionText}>{miniQuestion}</Text>
                    <View style={styles.answerBox}>
                        <Text style={styles.answerText}>
                            {userAnswers[miniQuestion] || '________'}
                        </Text>
                    </View>
                </View>
            ))}

            <View style={styles.wordOptions}>
                {textList.map((word) => (
                    <TouchableOpacity
                        key={word.id}
                        style={styles.wordButton}
                        onPress={() => handleSelectWord(word.id, word.kanji_word)}
                    >
                        <Text style={styles.wordText}>{word.kanji_word}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.checkButton} onPress={checkAnswers}>
                    <Text style={styles.buttonText}>Check Answers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.resetButton} onPress={resetAnswers}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalMessage}>
                            {isCorrect ? 'Correct! 🎉' : 'Some answers are incorrect. Try again!'}
                        </Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.buttonText}>Close</Text>
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
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    questionText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        marginBottom: 20,
        color: '#666',
    },
    questionBlock: {
        marginBottom: 20,
    },
    miniQuestionText: {
        fontSize: 16,
        marginBottom: 5,
    },
    answerBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    answerText: {
        fontSize: 16,
        color: '#333',
    },
    wordOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
    },
    wordButton: {
        backgroundColor: '#e0e0e0',
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    wordText: {
        fontSize: 16,
        color: '#333',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    checkButton: {
        backgroundColor: '#4caf50',
        padding: 10,
        borderRadius: 5,
    },
    resetButton: {
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalMessage: {
        fontSize: 18,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
});

export default ChooseQuestion;
