import { API_CONFIG } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Логін користувача
export const loginUser = async (username, password) => {
  console.log('Attempting to login with username:', username); // Логування початку логіну
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    // Логування статусу відповіді
    console.log('Login response status:', response.status);
    console.log('Login response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Error in entering into the account');
    }

    if (data.token) {
      await AsyncStorage.setItem('userToken', data.token);
      console.log('User token saved in AsyncStorage'); // Логування збереження токену
    }

    return data;
  } catch (error) {
    console.error('Login error:', error.message || 'Error to connect to server');
    throw new Error(error.message || 'Error to connect to server');
  }
};

// Реєстрація користувача
export const registerUser = async (username, email, password) => {
  console.log('Attempting to register with username:', username, 'and email:', email); // Логування початку реєстрації
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    // Логування статусу відповіді
    console.log('Registration response status:', response.status);
    console.log('Registration response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Error in registration');
    }

    if (data.token) {
      await AsyncStorage.setItem('userToken', data.token);
      console.log('User token saved in AsyncStorage'); // Логування збереження токену
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error.message || 'Error to connect to server');
    throw new Error(error.message || 'Error to connect to server');
  }
};
