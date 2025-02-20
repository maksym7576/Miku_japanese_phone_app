import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/AuthScreen';
import MainNavigator from './MainNavigator';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import MainScreen from '../screens/MainScreen';
import MikuScreen from '../screens/MikuScreen';
import ShopScreen from '../screens/ShopScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MangaScreen from '../screens/MangaScreen';
import ExerciseScreen from '../screens/ExerciseScreen';
import VideoLessonScreen from '../screens/VedeoLessonScreen';
import NovelScreen from '../screens/NovelScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsAuthenticated(!!token);
    };

    checkToken();
  }, []);

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainNavigator" component={MainNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="LessonDetailScreen" component={LessonDetailScreen} options={{ headerShown: false }}/>
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      )}
      <Stack.Screen name="Lessons" component={MainNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name="Miku" component={MikuScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
      <Stack.Screen name="logout" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="video" component={VideoLessonScreen} options={{ headerShown: false}}/>
      <Stack.Screen name="manga" component={MangaScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="exercise" component={ExerciseScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="novel" component={NovelScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;