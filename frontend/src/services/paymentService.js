import axios from 'axios';

const API_URL = "http://localhost:8080/api/payments";

export const registerPayment = async (memberId, method, date) => {
  const token = localStorage.getItem('token');
  // Fijate que acá agregamos &date=${date}
  const response = await axios.post(
    `${API_URL}/member/${memberId}?method=${method}&date=${date}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getPaymentHistory = async (memberId) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/member/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};