import axios from 'axios';

const API_URL = "http://localhost:8080/api/auth";

// --- FUNCIÓN DE LOGIN ---
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        const { token, gymId } = response.data;

        if (token) {
            localStorage.setItem('token', token);
            if (gymId) {
                localStorage.setItem('gymId', gymId);
            }
            return response.data;
        } else {
            throw new Error("No se recibió un token válido");
        }
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error en el login");
    }
};

// --- FUNCIÓN DE REGISTRO CORREGIDA ---
export const registerGym = async (registrationData) => {
    try {
        // Ahora enviamos UN SOLO OBJETO en el body, sin params en la URL
        const response = await axios.post(`${API_URL}/register-gym`, registrationData);
        return response.data;
    } catch (error) {
        // Importante: Si el @Valid falla, el mensaje de error viene en error.response.data
        throw error.response ? error.response.data : new Error("Error al registrar el gimnasio");
    }
};