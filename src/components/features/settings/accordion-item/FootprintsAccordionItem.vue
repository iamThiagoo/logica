<template>
  <p class="text-sm text-pretty text-muted">Simplifique sua navegação nas pesquisas criando atalhos personalizados. Acesse-os rapidamente pela busca na barra lateral, usando Ctrl + K (Windows) ou Cmd + K (Mac).</p>
  <div>
    <USelectMenu v-model="selectedPage" :items="availablePages" clear multiple placeholder="Escolha os atalhos..." class="w-full" size="lg" value-key="value" @update:model-value="addShortcut" />
  </div>
</template>

<script setup lang="ts">
import sidebarOptions from '@/utils/constants/sidebar';
import { useShortcutsStore } from '@/stores/modules/shortcut.store';
const selectedPage = ref<string[]>([]);
const shortcutsStore = useShortcutsStore();
const availablePages = computed(() => {
  return extractPages(sidebarOptions);
});

const addShortcut = () => {
  const items = selectedPage.value
    .map((value: any) => {
      const page = availablePages.value.find((p) => p.value === value);

      return page
        ? {
            key: page.value,
            title: page.label,
            original: page.original,
            icon: page.icon,
          }
        : null;
    })
    .filter(Boolean);
  shortcutsStore.set(items as any[]);
};

function extractPages(options: any[], path: string[] = []): any[] {
  return options.flatMap((option) => {
    const hasChildren = Array.isArray(option.children) && option.children.length > 0;

    if (hasChildren) {
      return extractPages(option.children, [...path, option.label]);
    }

    if (option.label && option.icon && !option.comingSoon) {
      return [
        {
          value: option.to,
          label: [...path, option.label].join(' ➜ ') || option.label,
          original: option.label,
          icon: option.icon,
        },
      ];
    }

    return [];
  });
}

onMounted(() => {
  shortcutsStore.load();
  selectedPage.value = shortcutsStore.items.map((item: any) => item.key);
});
</script>
