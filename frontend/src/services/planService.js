import axios from 'axios';

import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/plans`;

export const getPlansByGym = async (gymId) => {
    const token = localStorage.getItem('token');

    return axios.get(`${API_URL}/gym/${gymId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.data);
};

export const createPlan = async (planData, gymId) => {
    const token = localStorage.getItem('token');

    return axios.post(`${API_URL}?gymId=${gymId}`, planData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.data);
};

export const deletePlan = async (id) => {
    const token = localStorage.getItem('token');

    return axios.delete(`${API_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};