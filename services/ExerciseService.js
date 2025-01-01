import { API_CONFIG } from '../config';

export const getExerciseData = async (lessonId) => {
    console.log('Fetching exercise data for lesson:', lessonId); // Логування початку запиту
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/exercise/structured/${lessonId}/test`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        // Логування статусу відповіді
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Логування отриманих даних
        console.log('Exercise data:', data);

        return data;
    } catch (error) {
        console.error('Error fetching lessons:', error);
        throw new Error('Error fetching lessons: ' + error.message);   
    }
};

export const finishExercise = async (requestBody) => {
    console.log('Finishing exercise with request body:', requestBody); // Логування початку запиту
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/exercise/finish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Логування статусу відповіді
        console.log('Finish exercise response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to finish exercise: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Логування отриманих даних
        console.log('Finish exercise response data:', data);

        if (data && data.percentage !== undefined && data.exp !== undefined && Array.isArray(data.rewardsList)) {
            return {
                percentage: data.percentage,
                exp: data.exp,
                rewards: data.rewardsList,
            };
        } else {
            throw new Error('Unexpected response structure');
        }

    } catch (error) {
        console.error("Error finishing the exercise:", error);
        throw error; // Пробрасываємо помилку, щоб вона могла бути оброблена в іншому місці
    }
};