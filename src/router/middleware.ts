import getPageTitle from '@/utils/helpers/app/page-title';
import type { Router } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth.store';

const PUBLIC = ['/login'];

export const setupPermissionGuard = (router: Router) => {
  router.beforeEach(async (to, _, next) => {
    const authStore = useAuthStore();
    document.title = getPageTitle(to.meta.title as string);
    if (PUBLIC.includes(to.path)) return next();

    if (!authStore.token) {
      return next({ path: '/login', query: { redirect: to.fullPath } });
    }

    try {
      await authStore.validateToken();
      next();
    } catch {
      next({ path: '/login', query: { redirect: to.fullPath } });
    }
  });
};

// async function userRoles(
//   to: RouteLocationNormalized,
//   router: Router
// ): Promise<boolean> {
//   const hasRoles = store.state.user.roles?.length > 0;
//   if (hasRoles) return true;

//   const { roles } = await store.dispatch('user/getInfo');

//   if (!roles?.length) {
//     await store.dispatch('auth/logout');
//     alert('Login necessário', 'warning');

//     router.push({
//       path: '/login',
//       query: { redirect: to.fullPath },
//     });

//     return false;
//   }

//   return true;
// }
