import axios, { AxiosError } from 'axios';
import router from '@/router';
import { getAuthToken } from '@/utils/helpers/app/auth';

// Configuração da instância, cada service terá sua própria
export const http = axios.create({
  baseURL: '',
  timeout: 60000,
});

http.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers.set('Authorization', `Bearer ${token}`);
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const data: any = error.response?.data;

    if (status === 401) {
      localStorage.removeItem('token');
      await router.push({ name: 'login' });
      return Promise.reject(error);
    }

    return Promise.reject({
      status,
      message: data?.error || error.message,
      raw: error,
    });
  }
);
