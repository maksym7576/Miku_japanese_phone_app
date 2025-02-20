import { API_CONFIG } from '../config';

export const getCharacterData = async (userId) => {
    console.log('Fetching exercise data for exercise:', userId); 
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/character/get/character/Miku/user/${userId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Exercise data:', data);

        return data;
    } catch (error) {
        console.error('Error fetching lessons:', error);
        throw new Error('Error fetching lessons: ' + error.message);   
    }
};