<template>
  <Suspense>
    <UApp :locale="pt_br" :toaster="toaster">
      <div v-if="loaded" class="app-root">
        <Transition name="layout-smooth">
          <component :is="currentLayout" :key="layoutKey" />
        </Transition>
      </div>
    </UApp>
  </Suspense>
</template>

<script setup lang="ts">
import { pt_br } from '@nuxt/ui/locale';
import { preload } from '@/utils/helpers/shared/arrays';
import { themes } from '@/utils/constants/colors/themes';
import { useAuthStore } from '@/stores/modules/auth.store';
import { useToastConfig } from '@/utils/helpers/app/toast';
import Dashboard from '@/layouts/Dashboard.vue';
import Empty from '@/layouts/Empty.vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import getPageTitle from './utils/helpers/app/page-title';

const router = useRouter();
const route = useRoute();
const { toastConfig: toaster } = useToastConfig();
const loaded = ref(false);
const authStore = useAuthStore();

const currentLayout = computed(() => {
  const emptyLayoutsRoutes = ['login', '404'];
  return emptyLayoutsRoutes.includes(route.name as string) ? Empty : Dashboard;
});

const layoutKey = computed(() => (['login', '404'].includes(route.name as string) ? 'empty' : 'dashboard'));

const applyFont = (font: string) => {
  const value = `"${font}", sans-serif`;
  document.documentElement.style.setProperty('--app-font', value);
  document.documentElement.style.setProperty('--font-sans', value);
};

const loadPreferences = () => {
  const savedFont = localStorage.getItem('nuxt-font') ?? 'Inter';
  const customFont = localStorage.getItem('font:custom');
  const savedPreset = localStorage.getItem('theme:preset');

  if (customFont === '1') {
    applyFont(savedFont);
    return;
  }

  if (savedPreset && themes[savedPreset]) {
    applyFont(themes[savedPreset].font);
    return;
  }

  applyFont(savedFont);
};

const processAppTitle = (route: RouteLocationNormalizedLoaded) => {
  document.title = getPageTitle(route.meta?.title as string);
};

const validateAuth = async () => {
  await nextTick();
  const publicRoutes = ['login', '404'];
  const isPublicRoute = publicRoutes.includes(route.name as string);

  processAppTitle(route);
  if (isPublicRoute) return;

  if (!isPublicRoute) {
    try {
      await authStore.validateToken();
    } catch {
      authStore.logout();
      router.push('/login');
    }
  }
};

watch(
  () => route.name,
  () => {
    validateAuth();
  }
);

onBeforeMount(() => {
  validateAuth();
});

onMounted(async () => {
  loadPreferences();
  await router.isReady();
  loaded.value = true;
  requestIdleCallback(() => {
    preload();
  });
});
</script>

<style>
.app-root {
  height: 100%;
}

.layout-smooth-enter-active,
.layout-smooth-leave-active {
  transition:
    opacity 220ms ease,
    transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.layout-smooth-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.layout-smooth-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.layout-smooth-leave-active {
  position: absolute;
  inset: 0;
  width: 100%;
}
</style>
