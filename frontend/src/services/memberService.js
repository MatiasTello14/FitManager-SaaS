import axios from 'axios';

import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/members`;

export const getMembersByGym = async (gymId) => {
    try {
        const response = await axios.get(`${API_URL}/gym/${gymId}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener socios:", error);
        throw error;
    }
};

export const createMember = async (memberData, gymId, planId) => {
    try {
        const response = await axios.post(`${API_URL}?gymId=${gymId}&planId=${planId}`, memberData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const toggleMemberStatus = async (id) => {
    try {
        const response = await axios.put(`${API_URL}/${id}/status`);
        return response.data;
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        throw error;
    }

};

export const updateMember = async (id, memberData) => {

    const response = await axios.put(`${API_URL}/${id}`, memberData, {
        params: { planId: memberData.subscriptionPlanId }
    });
    return response.data;
};