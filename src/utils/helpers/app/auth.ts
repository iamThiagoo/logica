import type IEmployee from '@/utils/types/employee';
import { Router } from 'vue-router';

export const LOCAL_ADMIN_USERNAME = 'admin';
export const LOCAL_ADMIN_PASSWORD = 'admin123';
export const LOCAL_ADMIN_TOKEN = 'local-admin-token';
export const LOCAL_ADMIN_ROLES = ['admin'];

export const getLocalAdminUser = (): IEmployee & { id: number } => ({
  id: 1,
  cd_func: 1,
  nome: 'Administrador',
  email: 'admin@mycompany.local',
  usuario_ad: LOCAL_ADMIN_USERNAME,
  cd_status2: 1,
  ramal: '0001',
});

export const getAuthToken = () => localStorage.getItem('token') ?? '';

export const isLocalAdminCredentials = (username: string, password: string) => username.trim().toLowerCase() === LOCAL_ADMIN_USERNAME && password.trim() === LOCAL_ADMIN_PASSWORD;

export const isLocalAdminToken = (token?: string | null) => token === LOCAL_ADMIN_TOKEN;

export const loginRedirect = (router: Router) => {
  const redirectPath = (router.currentRoute.value.query.redirect as string) || '/';
  const url = new URLSearchParams(redirectPath.split('?')[1] || '');
  const query = Object.fromEntries(url.entries());
  return router.push({
    path: redirectPath.split('?')[0],
    query,
  });
};
