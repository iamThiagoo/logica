import { ref } from 'vue';

const deferredPrompt = ref<any>(null);
const canInstallPWA = ref(false);

export function usePWAInstall() {
  const register = () => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt.value = e;
      canInstallPWA.value = true;
    });

    window.addEventListener('appinstalled', () => {
      canInstallPWA.value = false;
      deferredPrompt.value = null;
    });
  };

  const install = async () => {
    if (!deferredPrompt.value) return;

    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;

    if (outcome === 'accepted') {
      canInstallPWA.value = false;
      deferredPrompt.value = null;
    }
  };

  return {
    canInstallPWA,
    register,
    install,
  };
}
