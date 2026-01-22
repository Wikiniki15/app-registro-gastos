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

// Obtener todas las transacciones (con filtros opcionales)
export const getTransactions = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.type) params.append('type', filters.type);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  
  const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
  const response = await axios.get(url, getAuthHeaders());
  return response.data;
};

// Eliminar transacción
export const deleteTransaction = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};