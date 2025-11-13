<template>
  <section class="flex gap-x-3 items-center">
    <!-- <USeparator orientation="vertical" class="h-8 mr-2" /> -->
    <UDropdownMenu
      :items="[
        [
          {
            label: 'Visibilidade dos Cards',
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
      :content="{ align: 'end' }"
      :ui="{ content: 'w-fit' }"
    >
      <UButton class="cursor-pointer btn-settings btn-scale bg-elevated/50" label="Personalizar" color="neutral" variant="outline">
        <template #leading>
          <lord-icon trigger="hover" target=".btn-settings" :colors="`primary:${lordIconColor}`" src="/lord-icon/settings.json" class="h-5 w-5" />
        </template>
      </UButton>
    </UDropdownMenu>
  </section>
</template>

<script setup lang="ts">
import { useOverviewCards } from '@/stores/modules/overview-cards.store';
import { OverviewCardKey } from '@/utils/types/overview';
import { overviewCardsConfigMap } from '@/utils/types/map/overview-cards.map';
import { defineElement } from '@lordicon/element';

defineElement();

const store = useOverviewCards();
const colorMode = useColorMode();

const cardKeys = computed<OverviewCardKey[]>(() => Object.keys(store.cards) as OverviewCardKey[]);

const lordIconColor = computed(() => (colorMode.value === 'dark' ? '#fff' : '#1e293b'));

const items = computed(() =>
  cardKeys.value.map((key) => ({
    label: overviewCardsConfigMap[key].label,
    icon: overviewCardsConfigMap[key].icon,
    type: 'checkbox' as const,
    checked: store.isVisible(key),
    onUpdateChecked: (val: boolean) => store.setVisibility(key, val),
    onSelect: (e: Event) => e.preventDefault(),
  }))
);

const restoreDefault = () => {
  store.resetToDefault();
};
</script>
