import { API_CONFIG } from '../config';

export const getMangaByIdSorted = async (id) => {
    try {
        const responce = await fetch(`${API_CONFIG.BASE_URL}/manga/sorted/${id}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if(!responce.ok) {
            const errorText = await responce.text();
            console.error('Error response: ', errorText);
            throw new Error(`HTTP error! status: ${responce.status}`);
        }

        const data = await responce.json();
        return data;
    } catch (error) {
        console.error('Error fetching manga:', error);
        throw new Error('Error fetching manga: ' + error.message);
    }
};
export const finishManga = async (answersDTO, userId, mangaId) => {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/manga/finish?userId=${userId}&mangaId=${mangaId}`, {
            method: 'POST', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(answersDTO) 
        });

        if (!response.ok) {
            throw new Error('Error finishing manga');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Server error:', error);
        throw error;
    }
};
