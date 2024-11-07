import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../styles/MainScreen';
import { getMangaByIdSorted } from '../services/MangaService';

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

    return (
        <View style={styles.lessonDetailContainer}>
            <Button title="Video" onPress={() => console.log('Video button pressed')} />
            <Button title="Test" onPress={() => console.log('Test button pressed')} />
            <Button 
                title="Manga" 
                onPress={handleMangaPress} 
            />
        </View>
    );
};

export default LessonDetailScreen;
