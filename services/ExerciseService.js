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
export const finishExercise = async (requestBody) => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/exercise/finish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Перевірка на успішність запиту
        if (!response.ok) {
            throw new Error(`Failed to finish exercise: ${response.statusText}`);
        }

        // Отримання JSON-даних
        const data = await response.json();

        // Перевірка на відповідну структуру
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
