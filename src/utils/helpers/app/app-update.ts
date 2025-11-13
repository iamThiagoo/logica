import type { Router } from 'vue-router';
import { registerSW } from 'virtual:pwa-register';
import { Flag, TriangleAlert } from 'lucide-vue-next';
import { showToast, type ToastType } from './toast';

const APP_UPDATE_RELOAD_KEY = 'app:update:reloaded-version';
const APP_UPDATE_EVENT_KEY = 'app:update:pending-event';
const APP_UPDATE_TELEMETRY_EVENT = 'app:update:telemetry';

const dynamicImportErrorPatterns = [/Failed to fetch dynamically imported module/i, /Importing a module script failed/i, /ChunkLoadError/i, /Loading chunk [\d]+ failed/i];

let appUpdateHandlingInitialized = false;

export type AppUpdateReloadReason = 'chunk-error' | 'vite-preload-error' | 'service-worker-update';

type AppUpdateEvent = {
  reason: AppUpdateReloadReason;
  version: string;
  timestamp: string;
};

const reloadReasonMeta: Record<
  AppUpdateReloadReason,
  {
    title: string;
    message: string;
    type: ToastType;
    icon: typeof TriangleAlert;
  }
> = {
  'chunk-error': {
    title: 'Aplicativo atualizado',
    message: 'Uma nova versão foi publicada, então recarregamos a página para versão mais recente :)',
    type: 'warning',
    icon: Flag,
  },
  'vite-preload-error': {
    title: 'Aplicativo atualizado',
    message: 'Uma nova versão foi publicada, então recarregamos a página para versão mais recente :)',
    type: 'warning',
    icon: Flag,
  },
  'service-worker-update': {
    title: 'Nova versão aplicada',
    message: 'Uma nova versão foi publicada, então recarregamos a página para versão mais recente :)',
    type: 'info',
    icon: Flag,
  },
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  return '';
}

function isDynamicImportError(error: unknown) {
  const message = getErrorMessage(error);

  return dynamicImportErrorPatterns.some((pattern) => pattern.test(message));
}

function reportAppUpdateTelemetry(action: 'scheduled' | 'completed', event: AppUpdateEvent) {
  const payload = { action, ...event };

  console.info('[app-update]', payload);
  window.dispatchEvent(
    new CustomEvent(APP_UPDATE_TELEMETRY_EVENT, {
      detail: payload,
    })
  );
}

function persistAppUpdateEvent(reason: AppUpdateReloadReason) {
  const event: AppUpdateEvent = {
    reason,
    version: __APP_VERSION__,
    timestamp: new Date().toISOString(),
  };

  sessionStorage.setItem(APP_UPDATE_EVENT_KEY, JSON.stringify(event));
  reportAppUpdateTelemetry('scheduled', event);
}

function consumeAppUpdateEvent() {
  const rawEvent = sessionStorage.getItem(APP_UPDATE_EVENT_KEY);

  if (!rawEvent) return null;

  sessionStorage.removeItem(APP_UPDATE_EVENT_KEY);

  try {
    return JSON.parse(rawEvent) as AppUpdateEvent;
  } catch {
    return null;
  }
}

function notifyAppUpdateReload() {
  const event = consumeAppUpdateEvent();
  if (!event) return;
  const meta = reloadReasonMeta[event.reason];
  reportAppUpdateTelemetry('completed', event);
  showToast({
    title: meta.title,
    message: meta.message,
    type: meta.type,
    icon: meta.icon,
  });
}

function reloadForAppUpdate(reason: AppUpdateReloadReason) {
  const currentVersion = __APP_VERSION__;
  const reloadedVersion = sessionStorage.getItem(APP_UPDATE_RELOAD_KEY);

  if (reloadedVersion === currentVersion) return;

  persistAppUpdateEvent(reason);
  sessionStorage.setItem(APP_UPDATE_RELOAD_KEY, currentVersion);
  window.location.reload();
}

function watchServiceWorkerUpdates(registration?: ServiceWorkerRegistration) {
  if (!registration) return;

  const bindInstallingWorker = (worker: ServiceWorker | null) => {
    if (!worker) return;

    const hasActiveController = Boolean(navigator.serviceWorker.controller);

    worker.addEventListener('statechange', () => {
      if (worker.state !== 'activated' || !hasActiveController) return;

      reloadForAppUpdate('service-worker-update');
    });
  };

  bindInstallingWorker(registration.installing);

  registration.addEventListener('updatefound', () => {
    bindInstallingWorker(registration.installing);
  });
}

function registerServiceWorker() {
  registerSW({
    immediate: true,
    onRegisteredSW(_: any, registration: any) {
      watchServiceWorkerUpdates(registration);
    },
    onRegisterError(error: any) {
      console.error('Failed to register service worker', error);
    },
  });
}

export function setupAppUpdateHandling(router: Router) {
  if (appUpdateHandlingInitialized) return;
  appUpdateHandlingInitialized = true;

  notifyAppUpdateReload();
  registerServiceWorker();

  window.addEventListener('vite:preloadError', (event: Event) => {
    event.preventDefault();
    reloadForAppUpdate('vite-preload-error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (!isDynamicImportError(event.reason)) return;

    event.preventDefault();
    reloadForAppUpdate('chunk-error');
  });

  router.onError((error: any) => {
    if (!isDynamicImportError(error)) return;

    reloadForAppUpdate('chunk-error');
  });
}
