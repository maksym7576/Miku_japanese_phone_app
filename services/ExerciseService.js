import { API_CONFIG } from '../config';

export const getExerciseData = async (lessonId) => {
    try {
        const responce = await fetch(`${API_CONFIG.BASE_URL}/exercise/structured/${lessonId}/test`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        if(!responce.ok) {
            const errorText = await responce.text();
            console.error('Error responce:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await responce.json();
        return data;
    } catch (error) {
        console.error('Error fetching lessons:', error);
        throw new Error('Error fetching lessons: ' + error.message);   
    }
};