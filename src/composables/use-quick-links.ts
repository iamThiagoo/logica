import { QuickLink } from '@/utils/types/quick-link';

const _useQuickLinksStore = () => {
  const links = ref<QuickLink[]>([]);
  onMounted(() => {
    const saved = localStorage.getItem('quickLinks');
    if (saved) {
      links.value = JSON.parse(saved);
    }
  });

  watch(
    links,
    (value) => {
      localStorage.setItem('quickLinks', JSON.stringify(value));
    },
    { deep: true }
  );

  function addLink(link: QuickLink) {
    links.value.push(link);
  }

  function updateLink(updated: QuickLink) {
    const i = links.value.findIndex((l) => l.id === updated.id);
    if (i !== -1) links.value[i] = updated;
  }

  function deleteLink(id: string) {
    links.value = links.value.filter((l) => l.id !== id);
  }

  return {
    links,
    addLink,
    updateLink,
    deleteLink,
  };
};

export const useQuickLinksStore = createSharedComposable(_useQuickLinksStore);
