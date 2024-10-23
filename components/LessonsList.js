import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { getAllLessons } from '../services/LessonsService';
import styles from '../styles/lessonsList';

const LessonsList = ({ navigation }) => {
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const responseLessons = await getAllLessons();
                setLessons(responseLessons);
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };
        fetchLessons();
    }, []);

    const groupedLessons = lessons.reduce((acc, lesson) => {
        const level = lesson.level;
        if (!acc[level]) {
            acc[level] = [];
        }
        acc[level].push(lesson);
        return acc;
    }, {});

    const renderLessonItem = ({ item }) => (
        <TouchableOpacity
            style={styles.lessonItem}
            onPress={() => navigation.navigate('LessonDetailScreen', { lessonId: item.id })}
        >
            <Text style={styles.lessonText}>Lesson: {item.position}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.lessons}>
            {Object.keys(groupedLessons).map(level => (
                <View key={level}>
                    <Text style={styles.levelTitle}>{`Level ${level}`}</Text>
                    <FlatList
                        data={groupedLessons[level]}
                        renderItem={renderLessonItem}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            ))}
        </View>
    );
};

export default LessonsList;
