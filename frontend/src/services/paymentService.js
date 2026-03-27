import axios from 'axios';

import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/payments`;

export const registerPayment = async (memberId, method, date) => {
  const token = localStorage.getItem('token');

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