import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const publicRoutes = [
  '/auth/api/auth/login',
  '/auth/api/auth/logout',
  '/auth/api/password/forgot',
  '/auth/api/password/reset',
  '/auth/api/auth/refrech',
];

api.interceptors.request.use(config => {
  const isPublic = publicRoutes.some(route => config.url.includes(route));
  if (!isPublic) {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry){
      originalRequest._retry = true;
      const { data } = await axios.post('/auth/api/auth/refrech');
      originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
      useAuthStore.getState().setToken(data.token);
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;