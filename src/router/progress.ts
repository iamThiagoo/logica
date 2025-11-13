import type { Router } from 'vue-router';
import NProgress from 'nprogress';
import getPageTitle from '@/utils/helpers/app/page-title';

export function setupProgressGuard(router: Router) {
  router.beforeEach((to: any, _, next) => {
    document.title = getPageTitle(to.meta.title);
    NProgress.start();
    next();
  });

  router.afterEach(() => {
    NProgress.done();
  });
}
