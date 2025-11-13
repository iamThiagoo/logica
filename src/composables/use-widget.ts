import { useWidgetStore } from '@/stores/modules/widget.store';

export function useWidgetVisibility(widgetKey: string) {
  const store: any = useWidgetStore();

  const isVisible = computed(() => store.widgets[widgetKey]);
  const confirmVisible = ref(false);

  let confirmResolver: ((value: boolean) => void) | null = null;

  function confirmClose(): Promise<boolean> {
    confirmVisible.value = true;
    return new Promise((resolve) => {
      confirmResolver = resolve;
    });
  }

  function confirm() {
    confirmVisible.value = false;
    confirmResolver?.(true);
    confirmResolver = null;
  }

  function cancel() {
    confirmVisible.value = false;
    confirmResolver?.(false);
    confirmResolver = null;
  }

  async function closeWidget() {
    const confirmed = await confirmClose();
    if (confirmed) {
      store.setVisibility(widgetKey, false);
    }
  }

  function restore() {
    store.setVisibility(widgetKey, true);
  }

  return { isVisible, closeWidget, restore, confirmVisible, confirm, cancel };
}
