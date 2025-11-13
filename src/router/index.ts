import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router';
import { filterUserRoutes } from '@/utils/helpers/app/routes';
import { setupPermissionGuard } from './middleware';
import { setupProgressGuard } from './progress';

const routesGlob = import.meta.glob('./routes/*.routes.ts', { eager: true });
export const routes: RouteRecordRaw[] = Object.values(routesGlob).flatMap((mod: any) => mod.default ?? []);

const router = createRouter({
  history: createWebHistory(),
  routes: filterUserRoutes(routes),
});

function setupGuards(router: Router) {
  setupPermissionGuard(router);
  setupProgressGuard(router);
}

setupGuards(router);

export default router;
