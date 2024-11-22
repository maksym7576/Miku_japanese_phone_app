import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class QuestionComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAnswer: null,       // Вибраний варіант відповіді
            isButtonDisabled: false,    // Чи заблоковані кнопки після вибору
            resultText: '',             // Текст результату (правильна/неправильна відповідь)    // Кількість правильних відповідей
            answerHistory: [],          // Історія відповідей
        };
    }

    componentDidMount() {
        this.loadStoredData(); // Завантажуємо збережені результати при монтуванні компонента
    }

    // Функція для завантаження збережених даних
    loadStoredData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('quizResults');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                this.setState({
                    answerHistory: parsedData.answerHistory || [],
                });
            }
        } catch (error) {
            console.error('Error loading stored data:', error);
        }
    };

    // Функція для збереження результатів у AsyncStorage
    saveQuizResults = async () => {
        try {
            const {answerHistory } = this.state;
            const quizData = {
                answerHistory: answerHistory,
            };
            await AsyncStorage.setItem('quizResults', JSON.stringify(quizData));
        } catch (error) {
            console.error('Error saving quiz results:', error);
        }
    };

    // Функція обробки вибору відповіді
    handleAnswerSelect = async (answer) => {
        const { question } = this.props; // Отримуємо питання з пропсів
        const { answerHistory } = this.state;

        this.setState({ selectedAnswer: answer, isButtonDisabled: true }); // Заміщаємо стан після вибору

        const isCorrectAnswer = answer.id === question.correct_answer_id; // Перевірка, чи правильна відповідь

        const answerRecord = {
            type: 'question',
            answerId: answer.id,
            isCorrect: isCorrectAnswer,
        };

        if (isCorrectAnswer) {
            this.setState(
                { 
                    resultText: 'Correct!', // Збільшуємо кількість правильних відповідей
                    answerHistory: [...answerHistory, answerRecord], // Додаємо запис у історію
                },
                this.saveQuizResults // Зберігаємо результати
            );
        } else {
            this.setState(
                { 
                    resultText: 'Incorrect. Try again.', 
                    answerHistory: [...answerHistory, answerRecord], // Додаємо запис у історію
                },
                this.saveQuizResults // Зберігаємо результати
            );
        }
    };

    render() {
        const { question, answerList } = this.props; // Отримуємо питання та список відповідей з пропсів
        const { selectedAnswer, isButtonDisabled, resultText } = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.questionText}>{question.question}</Text> {/* Виводимо текст питання */}

                {answerList.map((answer) => (
                    <TouchableOpacity
                        key={answer.id}
                        style={[
                            styles.answerButton,
                            isButtonDisabled && styles.disabledButton, // Додаємо стиль, якщо кнопка заблокована
                            selectedAnswer === answer && (
                                answer.id === question.correct_answer_id
                                    ? styles.correctButton // Якщо відповідь правильна
                                    : styles.incorrectButton // Якщо відповідь неправильна
                            ),
                        ]}
                        onPress={() => this.handleAnswerSelect(answer)} // Обробка вибору відповіді
                        disabled={isButtonDisabled} // Блокуємо кнопки після вибору
                    >
                        <Text style={styles.answerText}>
                            {answer.romanji} {/* Виводимо текст відповіді */}
                        </Text>
                    </TouchableOpacity>
                ))}

                {resultText && (
                    <Text
                        style={[
                            styles.resultText,
                            resultText === 'Correct!' ? styles.correctText : styles.incorrectText, // Зміна стилю залежно від результату
                        ]}
                    >
                        {resultText} {/* Виводимо результат (правильно/неправильно) */}
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
        textAlign: 'center',
    },
    answerButton: {
        backgroundColor: '#e0e0e0',
        padding: 12,
        borderRadius: 6,
        marginVertical: 4,
    },
    disabledButton: {
        backgroundColor: '#d3d3d3', // Змінений колір кнопки, коли вона заблокована
    },
    correctButton: {
        backgroundColor: '#d4edda', // Зелений колір для правильної відповіді
    },
    incorrectButton: {
        backgroundColor: '#f8d7da', // Червоний колір для неправильної відповіді
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
        color: '#28a745', // Колір тексту для правильної відповіді
    },
    incorrectText: {
        color: '#dc3545', // Колір тексту для неправильної відповіді
    },
});

export default QuestionComponent;
