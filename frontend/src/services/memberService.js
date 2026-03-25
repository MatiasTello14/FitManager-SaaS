import axios from 'axios';

const API_URL = "http://localhost:8080/api/members";

export const getMembersByGym = async (gymId) => {
    try {
        // Por ahora no mandamos token porque pusimos .permitAll()
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
    // Usamos params para enviar el planId por la URL
    const response = await axios.put(`${API_URL}/${id}`, memberData, {
        params: { planId: memberData.subscriptionPlanId }
    });
    return response.data;
};