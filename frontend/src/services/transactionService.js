import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api/transactions';

// Configurar headers con token
const getAuthHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Crear transacción
export const createTransaction = async (transactionData) => {
  const response = await axios.post(API_URL, transactionData, getAuthHeaders());
  return response.data;
};

// Obtener todas las transacciones
export const getTransactions = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// Eliminar transacción
export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};