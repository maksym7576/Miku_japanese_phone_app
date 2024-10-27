import React from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import styles from '../styles/MainScreen'; // Make sure you have some styling for this screen

const LessonDetailScreen = () => {
    const route = useRoute();
    const { lessonId } = route.params;

    return (
        <View style={styles.lessonDetailContainer}>
            <Text style={styles.lessonDetailText}>Lesson ID: {lessonId}</Text>
            {/* Add more details or logic as necessary */}
        </View>
    );
};

export default LessonDetailScreen;
