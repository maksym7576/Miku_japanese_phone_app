import { API_CONFIG } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const getAllLevelsWithLessonsWithUserId = async () => {
    try {
        const userDataJson = await AsyncStorage.getItem('userData');
        const userData = userDataJson ? JSON.parse(userDataJson) : {};
        const response = await fetch(`${API_CONFIG.BASE_URL}/level/all/user/${userData.id}`, {
          headers: {
              'Accept': 'application/json'
          }
      });
  
      if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching lessons:', error);
      throw new Error('Error fetching lessons: ' + error.message);
  }
  };