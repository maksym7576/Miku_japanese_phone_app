import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config';


export const getUSerProfileByToken = async () => {
    const token = await AsyncStorage.getItem('userToken')

    if (!token) {
        throw new Error('No token found'); 
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/user/profile`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if(!response.ok) {
            const errorText = await response.text();
            console.error('Error:', errorText);
            throw new Error(`Http errror! status: ${response.status}`)
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw new Error('Error fetching profile: ' + error.message);
    }
};
