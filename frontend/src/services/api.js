import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getPotentialMatches = async () => {
  const response = await api.get('/matches/potential');
  return response.data;
};

export const getMatches = async () => {
  const response = await api.get('/matches');
  return response.data;
};

export const createSwipe = async (likedId, isLike) => {
  const response = await api.post('/matches/swipe', {
    liked_id: likedId,
    is_like: isLike,
  });
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};