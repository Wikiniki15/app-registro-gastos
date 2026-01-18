import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Registrar nuevo usuario
export const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password
  });
  return response.data;
};

// Iniciar sesión
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });
  
  if (response.data.token) {
    // Guardar token en localStorage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Obtener usuario actual
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Obtener token
export const getToken = () => {
  return localStorage.getItem('token');
};
