import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class QuestionComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAnswer: null,
            isButtonDisabled: false,
            resultText: '',
            correctAnswersCount: 0,
            incorrectAnswers: [],
        };
    }

    componentDidMount() {
        this.loadStoredData();
    }

    loadStoredData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('quizResults');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                this.setState({
                    correctAnswersCount: parsedData.correctAnswers || 0,
                    incorrectAnswers: parsedData.incorrectAnswers || [],
                });
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    };

    saveQuizResults = async () => {
        try {
            const { correctAnswersCount, incorrectAnswers } = this.state;
            const quizData = {
                correctAnswers: correctAnswersCount,
                incorrectAnswers: incorrectAnswers,
            };
            await AsyncStorage.setItem('quizResults', JSON.stringify(quizData));
        } catch (error) {
            console.error('Error saving quiz results:', error);
        }
    };

    handleAnswerSelect = async (answer) => {
        const { question } = this.props; // Get the question object from props
        const { correctAnswersCount, incorrectAnswers } = this.state;

        this.setState({ selectedAnswer: answer, isButtonDisabled: true });

        const isCorrectAnswer =
            answer.answer_romanji === question.correct_answer_romanized ||
            answer.answer_hiragana_katakana === question.correct_answer_hiragana_or_katakana;

        if (isCorrectAnswer) {
            this.setState(
                { 
                    resultText: 'Correct!', 
                    correctAnswersCount: correctAnswersCount + 1 
                }, 
                this.saveQuizResults // Save the results after state update
            );
        } else {
            const incorrectAnswerData = {
                objectId: question.id, // Now getting the ID from the question prop
                type: "question", // Now getting the type from the question prop
            };

            this.setState(
                { 
                    resultText: 'Incorrect. Try again.', 
                    incorrectAnswers: [...incorrectAnswers, incorrectAnswerData] 
                }, 
                this.saveQuizResults // Save the results after state update
            );
        }
    };

    render() {
        const { question, displayType } = this.props; // Get the question object and displayType from props
        const { selectedAnswer, isButtonDisabled, resultText } = this.state;

        const getAnswerText = (answer) => {
            const typeMap = {
                original: answer.answer_hiragana_katakana || answer.answer_romanji,
                hiragana: answer.answer_hiragana_katakana || '',
                romanji: answer.answer_romanji || '',
            };
            return typeMap[displayType] || typeMap.original;
        };

        return (
            <View style={styles.container}>
                <Text style={styles.questionText}>{question.question}</Text>
                
                {question.answerMangas.map((answer) => (
                    <TouchableOpacity
                        key={answer.id}
                        style={[ 
                            styles.answerButton, 
                            isButtonDisabled && styles.disabledButton, 
                            selectedAnswer === answer && (
                                answer.answer_romanji === question.correct_answer_romanized ||
                                answer.answer_hiragana_katakana === question.correct_answer_hiragana_or_katakana
                            ) 
                                ? styles.correctButton 
                                : selectedAnswer === answer 
                                ? styles.incorrectButton 
                                : null,
                        ]}
                        onPress={() => this.handleAnswerSelect(answer)}
                        disabled={isButtonDisabled}
                    >
                        <Text style={styles.answerText}>
                            {getAnswerText(answer)} {/* Dynamically render based on displayType */}
                        </Text>
                    </TouchableOpacity>
                ))}

                {resultText && (
                    <Text
                        style={[ 
                            styles.resultText, 
                            resultText === 'Correct!' ? styles.correctText : styles.incorrectText 
                        ]}
                    >
                        {resultText}
                    </Text>
                )}
            </View>
        );
    }
}

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
        textAlign: 'center', // Center align the question text
    },
    answerButton: {
        backgroundColor: '#e0e0e0',
        padding: 12,
        borderRadius: 6,
        marginVertical: 4,
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
    scoreText: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default QuestionComponent;
