import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/MainScreen';
import LessonsList from '../components/LessonsList';

const MainScreen = () => {
  const navigation = useNavigation();
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <LessonsList navigation={navigation} />
    </ScrollView>
  );
};

export default MainScreen;
