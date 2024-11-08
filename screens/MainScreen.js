import React, { useEffect } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/MainScreen';
import LessonsList from '../components/LessonsList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUSerProfileByToken } from '../services/UserService';
const MainScreen = () => {
  const navigation = useNavigation();

  useEffect(() =>{
    const fetchUserData = async () => {
      try {
        const responseuserData = await getUSerProfileByToken();
        await AsyncStorage.setItem('userData', JSON.stringify(responseuserData))
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchUserData();
  }, []);
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <LessonsList navigation={navigation} />
    </ScrollView>
  );
};

export default MainScreen;
