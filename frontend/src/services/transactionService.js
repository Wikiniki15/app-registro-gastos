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

// Exportar transacciones a CSV
export const exportToCSV = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/export`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    responseType: 'blob' // Importante para archivos
  });
  
  // Crear enlace de descarga
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `transacciones_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};