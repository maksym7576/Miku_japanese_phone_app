// styles/QuestionComponentStyles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginVertical: 8,
        alignItems: 'center',  // Центрування всього вмісту
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',  // Центрування тексту
    },
    answerButton: {
        backgroundColor: '#e0e0e0',
        padding: 12,
        borderRadius: 6,
        marginVertical: 4,
        width: '80%',  // Фіксована ширина для кнопок
        alignItems: 'center',  // Центрування тексту в кнопці
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