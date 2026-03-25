import axios from 'axios';

const API_URL = "http://localhost:8080/api/plans";

export const getPlansByGym = async (gymId) => {
    // Fijate que sea /gym/${gymId} para que coincida con @GetMapping("/gym/{gymId}")
    const response = await axios.get(`${API_URL}/gym/${gymId}`);
    return response.data;
};