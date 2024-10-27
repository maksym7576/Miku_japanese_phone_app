import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/styles';
import LessonsList from '../components/LessonsList';

const MainScreen = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <LessonsList navigation={navigation} />
    </View>
  );
};

export default MainScreen;