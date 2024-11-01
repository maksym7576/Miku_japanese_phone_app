import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/MainScreen'; 
import { Button } from 'react-native-web';
import { getMangaByIdSorted } from '../services/MangaService';

const LessonDetailScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { lessonId } = route.params;

    const handleMangaPress = async () => {
        try {
            const mangaData = await getMangaByIdSorted(lessonId);
            navigation.navigate('manga', { mangaData });
        } catch (error) {
            console.error('Error fetching manga data:', error);
        }
    };

    return (
        <View style={styles.lessonDetailContainer}>
            <Text style={styles.lessonDetailText}>Lesson ID: {lessonId}</Text>
            <Button title='Video' />
            <Button title='Test' />
            <Button 
                title='Manga' 
                onPress={handleMangaPress} 
            />
        </View>
    );
};

export default LessonDetailScreen;
