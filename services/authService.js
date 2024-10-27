import { API_CONFIG } from '../config';

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
      throw new Error(data.message || 'Error in entering in the account');
    }

    return data;
  } catch (error) {
    throw new Error('Error to connect to server');
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

    return data;
  } catch (error) {
    throw new Error('Error to connect to server');
  }
};