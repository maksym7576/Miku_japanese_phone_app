import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LessonResultPanel = ({ results }) => {
    const navigation = useNavigation();
    const [progress, setProgress] = useState(new Animated.Value(0)); // Анімація для прогрес-бара
    const [fadeAnim] = useState(new Animated.Value(0)); // Анімація для появи елементів

    useEffect(() => {
        // Анімація появи елементів
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Анімація прогрес-бара
        Animated.timing(progress, {
            toValue: results.percentage,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [fadeAnim, progress, results.percentage]);

    // Функція для визначення кольору прогрес-бара
    const getProgressColor = (percentage) => {
        if (percentage === 100) return '#4caf50'; // Green
        if (percentage >= 80) return '#2196f3'; // Blue
        if (percentage >= 60) return '#ffeb3b'; // Yellow
        return '#f44336'; // Red
    };

    const navigateToLessons = async () => {
        try {
            await AsyncStorage.removeItem('quizResults');
            navigation.navigate('Lessons');
        } catch (error) {
            Alert.alert('Error', 'Failed to remove quiz results');
        }
    };

    return (
        <View style={styles.overlay}>
            <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Well done {results.username}!</Text>

                <View style={styles.iconContainer}>
                    <View style={styles.icon}>
                        <Text style={styles.iconText}>🏯</Text>
                    </View>
                </View>

                <View style={styles.resultDetails}>
                    <View style={styles.starsContainer}>
                        <Text style={styles.starsText}>+{results.stars} Stars</Text>
                    </View>

                    <View style={styles.progressContainer}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    width: progress.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: ['0%', '100%'],
                                    }),
                                    backgroundColor: getProgressColor(results.percentage),
                                },
                            ]}
                        />
                        <Text style={styles.progressText}>{results.percentage}%</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={navigateToLessons} style={styles.continueButton}>
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Темний фон із 90% прозорістю
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    container: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    iconContainer: {
        marginBottom: 20,
    },
    icon: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffcc00',
        borderRadius: 50,
    },
    iconText: {
        fontSize: 40,
    },
    resultDetails: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    starsContainer: {
        marginBottom: 10,
    },
    starsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffa500',
        textAlign: 'center',
    },
    progressContainer: {
        width: '100%',
        height: 30,
        backgroundColor: '#ddd',
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBar: {
        position: 'absolute',
        left: 0,
        height: '100%',
        borderRadius: 15,
    },
    progressText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        zIndex: 1,
    },
    continueButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: '#007bff',
        borderRadius: 25,
    },
    continueButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default LessonResultPanel;
