import { API_CONFIG } from '../config';

export const getAllSortedLessons = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/lesson/get/sorted`, {
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