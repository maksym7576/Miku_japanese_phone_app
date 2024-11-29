import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Додайте свої іконки
import correctIcon from '../assets/check-circle.png'; // Іконка для правильної відповіді
import incorrectIcon from '../assets/octagon-xmark.png'; // Іконка для неправильної відповіді

class QuestionComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedAnswer: null,       // Вибраний варіант відповіді
            isButtonDisabled: false,    // Чи заблоковані кнопки після вибору
            resultText: '',             // Текст результату (правильна/неправильна відповідь)
            answerHistory: [],          // Історія відповідей
            showModal: false,           // Новий стан для показу модального вікна
            modalMessage: '',           // Текст повідомлення в модальному вікні
            isCorrectAnswer: false,     // Прапор для перевірки правильності відповіді
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
            const { answerHistory } = this.state;
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
        const correctAnswerText = this.findCorrectAnswer();


        this.setState(
            { 
                resultText: isCorrectAnswer ? 'Correct!' : 'Incorrect. Try again.',
                modalMessage: `Correct answer: ${correctAnswerText}`, 
                answerHistory: [...answerHistory, answerRecord],
                showModal: true, // Показуємо модальне вікно
                isCorrectAnswer, // Встановлюємо прапор для правильної відповіді
            },
            this.saveQuizResults // Зберігаємо результати
        );
    };

    findCorrectAnswer = () => {
        const { question, answerList } = this.props; // Отримуємо питання та список відповідей з пропсів
    
        // Знаходимо правильну відповідь за id
        const correctAnswer = answerList.find(answer => answer.id === question.correct_answer_id);
    
        // Повертаємо правильну відповідь або null, якщо не знайдено
        return correctAnswer ? correctAnswer.romanji : null;
    };
    

    // Закриття модального вікна
    handleCloseModal = () => {
        this.setState({ showModal: false }); // Закриваємо модальне вікно
    };

    render() {
        const { question, answerList } = this.props; // Отримуємо питання та список відповідей з пропсів
        const { selectedAnswer, isButtonDisabled, resultText, showModal, modalMessage, isCorrectAnswer } = this.state;

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

                {/* Модальне вікно для відображення результату */}
                <Modal
                    visible={showModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={this.handleCloseModal} // Закриваємо модальне вікно
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Image
                                source={isCorrectAnswer ? correctIcon : incorrectIcon}
                                style={styles.icon}
                            />
                            <Text style={styles.modalMessage}>{modalMessage}</Text>
                            <Text style={styles.modalMessage}>{question.description}</Text>
                            <TouchableOpacity style={styles.continueButton} onPress={this.handleCloseModal}>
                                <Text style={styles.continueText}>Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

// Стилі компонента QuestionComponent
const styles = StyleSheet.create({
    container: {
        flex: 1,                        // Займає весь доступний простір
        justifyContent: 'flex-start',    // Розташовує контент зверху
        alignItems: 'center',           // Центрує по горизонталі
        backgroundColor: 'transparent', // Прозорий фон для контейнера
        paddingTop: 20,                  // Відступ зверху
        paddingHorizontal: 16,           // Відступи по боках
    },
    questionText: {
        fontSize: 24,                   // Великий шрифт для питання
        fontWeight: 'bold',             // Жирний текст для питання
        marginBottom: 20,               // Відступ між питанням і кнопками
        textAlign: 'center',            // Центрування тексту по горизонталі
        color: '#333',                  // Темний колір тексту
        backgroundColor: 'transparent', // Прозорий фон для питання
    },
    answerButton: {
        backgroundColor: '#e0e0e0',     // Світлий фон для кнопок
        padding: 12,
        borderRadius: 6,
        marginVertical: 8,               // Відстань між кнопками
        width: '80%',                    // Кнопки займають більшу частину ширини контейнера
        alignItems: 'center',            // Вирівнювання тексту по центру
        justifyContent: 'center',        // Вирівнювання тексту по центру
        borderWidth: 1,                  // Додаємо тонку обводку для кнопок
        borderColor: '#ddd',             // Колір обводки
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',      // Кнопка заблокована, фон сірий
    },
    correctButton: {
        backgroundColor: '#d4edda',      // Зелений колір для правильної відповіді
    },
    incorrectButton: {
        backgroundColor: '#f8d7da',      // Червоний колір для неправильної відповіді
    },
    answerText: {
        fontSize: 18,                    // Розмір шрифту для тексту кнопки
        color: '#333',                   // Колір тексту на кнопці
        textAlign: 'center',             // Центрування тексту по горизонталі
    },
    resultText: {
        marginTop: 12,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    correctText: {
        color: '#28a745', // Зелений для правильної відповіді
    },
    incorrectText: {
        color: '#dc3545', // Червоний для неправильної відповіді
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end', // Розташовує модальне вікно внизу
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Прозорий чорний фон
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
