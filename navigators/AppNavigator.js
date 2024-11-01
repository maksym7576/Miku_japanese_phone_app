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
          <Stack.Screen name="LessonDetailScreen" component={LessonDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      )}
      <Stack.Screen name="Lessons" component={MainNavigator} />
      <Stack.Screen name="Miku" component={MikuScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
      <Stack.Screen name="logout" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="manga" component={MangaScreen}/>
    </Stack.Navigator>
  );
};

export default AppNavigator;