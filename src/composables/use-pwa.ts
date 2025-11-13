import { ref, onMounted, onUnmounted } from 'vue';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const isInstallable = ref(false);
  const isInstalled = ref(false);
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);

  const install = async () => {
    if (!deferredPrompt.value) {
      return false;
    }

    try {
      await deferredPrompt.value.prompt();
      const { outcome } = await deferredPrompt.value.userChoice;

      if (outcome === 'accepted') {
        isInstallable.value = false;
        deferredPrompt.value = null;
        return true;
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
    }

    return false;
  };

  const checkInstalled = () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true;
    }
  };

  onMounted(() => {
    checkInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.value = e as BeforeInstallPromptEvent;
      isInstallable.value = true;
    };

    const handleAppInstalled = () => {
      isInstalled.value = true;
      isInstallable.value = false;
      deferredPrompt.value = null;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    onUnmounted(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    });
  });

  return {
    isInstallable,
    isInstalled,
    install,
  };
}
