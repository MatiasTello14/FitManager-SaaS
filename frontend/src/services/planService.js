import axios from 'axios';

const API_URL = "http://localhost:8080/api/plans";

export const getPlansByGym = async (gymId) => {
    const token = localStorage.getItem('token');
    console.log("Token enviado en GET:", token); // <-- Debug para ver si existe

    return axios.get(`${API_URL}/gym/${gymId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.data);
};

export const createPlan = async (planData, gymId) => {
    const token = localStorage.getItem('token');
    console.log("Token enviado en POST:", token); // <-- Debug

    return axios.post(`${API_URL}?gymId=${gymId}`, planData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.data);
};