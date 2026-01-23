import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api/statistics';

// Configurar headers con token
const getAuthHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Obtener resumen general
export const getSummary = async () => {
  const response = await axios.get(`${API_URL}/summary`, getAuthHeaders());
  return response.data;
};

// Obtener gastos por categoría
export const getByCategory = async () => {
  const response = await axios.get(`${API_URL}/by-category`, getAuthHeaders());
  return response.data;
};

// Obtener tendencia mensual
export const getMonthlyTrend = async () => {
  const response = await axios.get(`${API_URL}/monthly-trend`, getAuthHeaders());
  return response.data;
};

// Obtener top 5 categorías
export const getTopCategories = async () => {
  const response = await axios.get(`${API_URL}/top-categories`, getAuthHeaders());
  return response.data;
};

// Obtener estadísticas del mes actual
export const getCurrentMonth = async () => {
  const response = await axios.get(`${API_URL}/current-month`, getAuthHeaders());
  return response.data;
};