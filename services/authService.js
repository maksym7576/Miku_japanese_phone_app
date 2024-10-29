import { API_CONFIG } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error in entering into the account');
    }

    if (data.token) {
      await AsyncStorage.setItem('userToken', data.token);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Error to connect to server');
  }
};

export const registerUser = async (username, email, password) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error in registration');
    }

    if (data.token) {
      await AsyncStorage.setItem('userToken', data.token);
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Error to connect to server');
  }
};
