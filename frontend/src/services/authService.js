import axios from 'axios';

const API_URL = "http://localhost:8080/api/auth";

// --- FUNCIÓN DE LOGIN  ---
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });

        // REVISIÓN CLAVE:
        // Si response.data es un String (el token directo) o un objeto con .token
        const token = typeof response.data === 'string' ? response.data : response.data.token;

        if (token) {
            localStorage.setItem('token', token);
            console.log("✅ Token guardado con éxito");
            return response.data;
        } else {
            throw new Error("No se recibió un token válido");
        }
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error en el login");
    }
};

// --- FUNCIÓN DE REGISTRO ---
export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Error al registrar");
    }
};