const API_URL = 'http://localhost:8080/api/lesson'

export const getAllLessons = async () =>{
    try {
        const response = await fetch(`${API_URL}/get`, {
            method: 'GET'
        });

        const data = await response.json();
        if(!response.ok) {
            throw new Error(data.message || 'Error to load all lessons') 
        }
        return data;
    } catch (error) {
        throw new Error(error.message || 'Error fetching lessons');
    }
};