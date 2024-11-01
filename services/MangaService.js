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