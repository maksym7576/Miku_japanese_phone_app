import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/MainScreen';
import { getMangaByIdSorted } from '../services/MangaService';
import { getExerciseData } from '../services/ExerciseService';

const LessonDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { lessonId } = route.params || {}; // Додано захист від відсутності lessonId

    const handleMangaPress = async () => {
        try {
            const mangaData = await getMangaByIdSorted(lessonId);
            navigation.navigate('manga', { mangaData });
        } catch (error) {
            console.error('Error fetching manga data:', error);
        }
    };
    
    const handleExercisePress = async () => {
        try {
            const exerciseData = await getExerciseData(lessonId); // Виправлено: exerciseData
            navigation.navigate('exercise', { exerciseData }); // Виправлено: exerciseData
        } catch (error) {
            console.error('Error fetching exercise data:', error);
        }
    };

    return (
        <View style={styles.lessonDetailContainer}>
            <Button title="Video" onPress={() => console.log('Video button pressed')} />
            <Button title="Test" onPress={handleExercisePress} />
            <Button 
                title="Manga" 
                onPress={handleMangaPress} 
            />
        </View>
    );
};

export default LessonDetailScreen;
