import axios, { AxiosRequestConfig } from 'axios';

const URL = 'http://localhost:3000/api';

export const connectionToBackend = axios.create({
  baseURL: URL,
});

connectionToBackend.interceptors.request.use(
  (config) => {
    const stored = sessionStorage.getItem('user');
    const user = stored ? JSON.parse(stored) : null;
    const token = user?.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
