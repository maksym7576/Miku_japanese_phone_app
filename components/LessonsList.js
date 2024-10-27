import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import { getAllSortedLessons } from '../services/LessonsService';
import styles from '../styles/lessonsList';

const LessonsList = ({ navigation }) => {
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setIsLoading(true);
                const responseLessons = await getAllSortedLessons();
                setLessons(responseLessons);
            } catch (error) {
                console.error('Error in fetchLessons:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLessons();
    }, []);

    const renderLessonItem = ({ item }) => (
        <TouchableOpacity
            style={styles.lessonItem}
            onPress={() => navigation.navigate('LessonDetailScreen', { lessonId: item.id })}
        >
            <Text style={styles.lessonText}>Lesson {item.position}</Text>
            <Text style={styles.lessonSubText}>{item.level}</Text>
        </TouchableOpacity>
    );

    const renderLevelSection = (level, levelLessons) => (
        <View key={level} style={styles.levelSection}>
            <Text style={styles.levelTitle}>Level {level}</Text>
            <FlatList
                data={levelLessons}
                renderItem={renderLessonItem}
                keyExtractor={item => item.id.toString()}
                scrollEnabled={false}
            />
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    const groupedLessons = lessons.reduce((acc, lesson) => {
        if (!acc[lesson.level]) {
            acc[lesson.level] = [];
        }
        acc[lesson.level].push(lesson);
        return acc;
    }, {});

    return (
        <FlatList
            style={styles.container}
            data={Object.entries(groupedLessons)}
            renderItem={({ item: [level, levelLessons] }) => renderLevelSection(level, levelLessons)}
            keyExtractor={([level]) => level}
        />
    );
};

export default LessonsList;
