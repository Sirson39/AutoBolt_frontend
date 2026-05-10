import axios from 'axios';
import { clearAuth, getToken } from './auth';

const api = axios.create({ baseURL: '/' });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      clearAuth();
      window.location.hash = '#signin';
    }
    return Promise.reject(err);
  }
);

export default api;
