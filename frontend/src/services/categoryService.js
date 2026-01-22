import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:5000/api/categories';

// Configurar headers con token
const getAuthHeaders = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Obtener todas las categorías
export const getCategories = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

// Crear categoría personalizada
export const createCategory = async (name) => {
  const response = await axios.post(API_URL, { name }, getAuthHeaders());
  return response.data;
};

// Actualizar categoría
export const updateCategory = async (id, name) => {
  const response = await axios.put(`${API_URL}/${id}`, { name }, getAuthHeaders());
  return response.data;
};

// Eliminar categoría
export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};