import React, { useState } from 'react';
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import correctIcon from '../assets/isCorrectsStates/miku_ok.png';
import incorrectIcon from '../assets/isCorrectsStates/miku_not.png';

const ModalWindow = ({ isCorrect, correctAnswer, description, visible, setVisible, onClose  }) => {

    const handleClose = () => {
        setVisible(false);
        onClose();  // Викликаємо onClose після закриття модального вікна
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.modalBackground}>
                <Image
                    source={isCorrect ? correctIcon : incorrectIcon}
                    style={styles.icon}
                />
                <View style={isCorrect ? styles.modalContainerCorrect : styles.modalContainerIncorrect}>
                    <Text style={styles.modalMessage}>Correct: {correctAnswer}</Text>
                    {description && <Text style={styles.modalMessage}>Explanation: {description}</Text>}
                    <TouchableOpacity
                        style={isCorrect ? styles.continueButtonCorrect : styles.continueButtonError}
                        onPress={handleClose}
                    >
                        <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'left',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        marginBottom: 2,
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

export default ModalWindow;
