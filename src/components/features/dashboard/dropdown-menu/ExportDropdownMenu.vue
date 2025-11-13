<template>
  <section class="flex gap-x-3 items-center">
    <!-- <USeparator orientation="vertical" class="h-8 mr-2" /> -->
    <UDropdownMenu
      :items="[
        [
          {
            label: 'Visibilidade dos Indicadores',
            type: 'label',
          },
        ],
        items,
        [
          {
            label: 'Restaurar Padrão',
            icon: 'i-lucide-rotate-ccw',
            onSelect: restoreDefault,
          },
        ],
      ]"
      :content="{ align: 'end', side: 'bottom', sideOffset: 8 }"
      :ui="{ content: 'w-fit' }"
    >
      <UButton class="cursor-pointer btn-analytics bg-elevated/50" label="Personalizar" color="neutral" variant="outline">
        <template #leading>
          <lord-icon trigger="hover" target=".btn-analytics" :colors="`primary:${lordIconColor}`" src="/lord-icon/analytics.json" class="h-5 w-5" />
        </template>
      </UButton>
    </UDropdownMenu>
  </section>
</template>

<script setup lang="ts">
import { showFeatureInDevelopment } from '@/utils/helpers/app';
import { useAnalyticsCards } from '@/stores/modules/analytics-cards.store';
import { AnalyticsCardKey } from '@/utils/types/analytics';
import { analyticsCardsConfigMap } from '@/utils/types/map/analytics-cards.map';
import { defineElement } from '@lordicon/element';

defineElement();

const store = useAnalyticsCards();
const colorMode = useColorMode();
const cardKeys = computed<AnalyticsCardKey[]>(() => Object.keys(store.cards) as AnalyticsCardKey[]);

const lordIconColor = computed(() => (colorMode.value === 'dark' ? '#fff' : '#1e293b'));

const items = computed(() =>
  cardKeys.value.map((key) => ({
    label: analyticsCardsConfigMap[key].label,
    icon: analyticsCardsConfigMap[key].icon,
    type: 'checkbox' as const,
    checked: store.isVisible(key),
    onUpdateChecked: (val: boolean) => store.setVisibility(key, val),
    onSelect: (e: Event) => e.preventDefault(),
  }))
);

const restoreDefault = () => {
  store.resetToDefault();
};

const exportItems = [
  [
    {
      label: 'Exportar PDF',
      icon: 'i-material-icon-theme:pdf',
      onSelect: showFeatureInDevelopment,
    },
    {
      label: 'Exportar Excel',
      icon: 'i-vscode-icons:file-type-excel2',
      onSelect: showFeatureInDevelopment,
    },
  ],
];
</script>
