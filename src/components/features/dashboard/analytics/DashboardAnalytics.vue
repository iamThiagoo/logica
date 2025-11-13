<template>
  <section>
    <div class="flex items-center justify-between mb-8 mt-3!">
      <UInput placeholder="Pesquisar por Indicador..." class="w-80 rounded-xl" size="lg" icon="i-lucide-search" />

      <div class="flex items-center gap-x-4">
        <UDropdownMenu :items="exportItems" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }" :ui="{ content: 'w-fit' }">
          <UButton class="cursor-pointer bg-elevated/50" label="Exportar" icon="i-lucide-file-down" color="neutral" size="lg" variant="outline" />
        </UDropdownMenu>
        <UTabs
          size="md"
          variant="pill"
          :content="false"
          :items="items"
          class="w-fit"
          :ui="{
            trigger: 'data-[state=active]:text-gray-100',
          }"
        />
      </div>
    </div>

    <draggable v-model="state.data" item-key="cardKey" :animation="200" class="grid grid-cols-1 lg:grid-cols-2 gap-6 gap-y-5" @end="onDragEnd">
      <template #item="{ element }">
        <div class="relative">
          <div class="cursor-grab active:cursor-grabbing absolute top-4 right-4 z-10 p-2 rounded-lg backdrop-blur-sm transition-colors">
            <GripVertical class="size-5 text-gray-600 dark:text-gray-400" />
          </div>

          <ChartArea v-if="element.cardKey === 'chart-area'" />
          <ChartBar v-if="element.cardKey === 'chart-bar'" />
          <ChartLine v-if="element.cardKey === 'chart-line'" />
          <ChartBar2 v-if="element.cardKey === 'chart-bar-2'" />
          <ChartTooltip v-if="element.cardKey === 'chart-tooltip'" />
          <ChartPie v-if="element.cardKey === 'chart-pie'" />
        </div>
      </template>
    </draggable>
  </section>
</template>

<script setup lang="ts">
import { useAnalyticsCards } from '@/stores/modules/analytics-cards.store';
import type { AnalyticsCardKey } from '@/utils/types/analytics';
import ChartArea from '@/components/shared/charts/ChartArea.vue';
import ChartBar from '@/components/shared/charts/ChartBar.vue';
import ChartTooltip from '@/components/shared/charts/ChartTooltip.vue';
import ChartPie from '@/components/shared/charts/ChartPie.vue';
import ChartLine from '@/components/shared/charts/ChartLine.vue';
import ChartBar2 from '@/components/shared/charts/ChartBar2.vue';
import { GripVertical } from 'lucide-vue-next';
import draggable from 'vuedraggable';
import { TabsItem } from '@nuxt/ui';
import { showFeatureInDevelopment } from '@/utils/helpers/app';

const analyticsCards = useAnalyticsCards();

const items = ref<TabsItem[]>([
  {
    label: 'Mês',
  },
  {
    label: 'Trimestre',
  },
  {
    label: 'Anual',
  },
]);

const exportItems = [
  [
    {
      label: 'Exportar PDF',
      icon: 'i-material-icon-theme:pdf',
      onSelect: () => showFeatureInDevelopment(),
    },
    {
      label: 'Exportar Excel',
      icon: 'i-vscode-icons:file-type-excel2',
      onSelect: () => showFeatureInDevelopment(),
    },
  ],
];

const state = reactive({
  data: [] as Array<{ cardKey: AnalyticsCardKey }>,
});

function buildCharts() {
  const orderedKeys = analyticsCards.getOrderedCards();

  state.data = orderedKeys
    .filter((key) => analyticsCards.isVisible(key))
    .map((key) => ({
      cardKey: key,
    }));
}

function onDragEnd() {
  const newOrder = state.data.map((item) => item.cardKey) as AnalyticsCardKey[];
  analyticsCards.saveOrder(newOrder);
}

onMounted(() => {
  analyticsCards.load();
  buildCharts();
});

watch(
  () => analyticsCards.visibleCards,
  () => buildCharts(),
  { deep: true }
);
</script>
