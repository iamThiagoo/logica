import { defineStore } from 'pinia';
import IEmployee from '@/utils/types/employee';
import { getLocalAdminUser, isLocalAdminToken, LOCAL_ADMIN_ROLES, LOCAL_ADMIN_TOKEN } from '@/utils/helpers/app/auth';

const persistRoles = (roles: string[]) => {
  localStorage.setItem('roles', JSON.stringify(roles));
};

export const useAuthStore = defineStore('auth', {
  persist: true,
  state: () => ({
    token: null as string | null,
    user: null as IEmployee | null,
    roles: [] as string[],
    loading: false,
  }),
  actions: {
    applyLocalAdminSession(token = LOCAL_ADMIN_TOKEN) {
      this.token = token;
      this.user = getLocalAdminUser();
      this.roles = [...LOCAL_ADMIN_ROLES];
      localStorage.setItem('token', token);
      persistRoles(this.roles);
    },
    async setUser(token: string) {
      if (!token) return;

      try {
        if (isLocalAdminToken(token)) {
          this.applyLocalAdminSession(token);
          return;
        }
        throw new Error('INVALID_LOCAL_TOKEN');
      } catch (err) {
        console.error('Erro ao definir usuário:', err);
        this.logout();
      }
    },
    async validateToken() {
      const token = this.token ?? localStorage.getItem('token');
      if (!token) throw new Error('NO_TOKEN');

      this.loading = true;

      try {
        if (isLocalAdminToken(token)) {
          this.applyLocalAdminSession(token);
          return true;
        }

        throw new Error('INVALID_LOCAL_TOKEN');
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      this.roles = [];
      localStorage.removeItem('token');
      localStorage.removeItem('roles');
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    hasRole: (state) => (role: string) => state.roles.includes(role),
    checkRole: (state) => (value?: string | string[]) => {
      if (!value || value.length === 0) {
        console.error(`Role necessária: ${value}`);
        return false;
      }

      const localRoles = localStorage.getItem('roles');
      const roles = state.roles?.length > 0 ? state.roles : localRoles ? JSON.parse(localRoles) : [];

      if (value instanceof Array) {
        return roles.some((role: string) => value.includes(role));
      }

      return roles.includes(value);
    },
  },
});
