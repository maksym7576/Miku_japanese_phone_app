import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/styles';
import LessonsList from '../components/LessonsList';

const MainScreen = ({ route }) => {
  const { username } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <LessonsList/>
    </View>
  );
};

export default MainScreen;