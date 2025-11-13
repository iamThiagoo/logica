<template>
  <p class="text-sm text-pretty text-muted">Controle quais widgets ficam visíveis no seu Dashboard.</p>
  <div>
    <UCard v-for="widget in widgetList" :key="widget.key" :ui="{ body: 'flex items-center justify-between px-4 py-3' }" class="btn-scale shadow-sm cursor-pointer my-4" @click="toggleWidget(widget)">
      <div class="flex items-center gap-3">
        <UIcon :name="widget.icon" class="size-6 text-primary" />

        <div>
          <h3 class="text-base font-semibold text-gray-800 dark:text-gray-100">
            {{ widget.title }}
          </h3>
          <p class="text-sm text-pretty text-muted">
            {{ widget.description }}
          </p>
        </div>
      </div>

      <USwitch v-model="widget.enabled" color="primary" unchecked-icon="i-lucide-x" checked-icon="i-lucide-check" @change="toggleWidget(widget)" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useWidgetStore } from '@/stores/modules/widget.store';
import { WidgetItem } from '@/utils/types/widget';

const widgetStore = useWidgetStore();
widgetStore.load();

const widgetList = computed(() => [
  {
    key: 'day-progress-widget',
    title: 'Progresso do Dia',
    description: 'Exibe o andamento do expediente atual.',
    icon: 'i-lucide-clock',
    enabled: widgetStore.widgets['day-progress-widget'],
  },
  {
    key: 'quick-links-widget',
    title: 'Acesso Rápido',
    description: 'Favoritos e links importantes.',
    icon: 'i-lucide-link',
    enabled: widgetStore.widgets['quick-links-widget'],
  },
  {
    key: 'quote-widget',
    title: 'Citação do Dia',
    description: 'Frase motivacional aleatória diariamente.',
    icon: 'i-lucide-sparkles',
    enabled: widgetStore.widgets['quote-widget'],
  },
]);

onMounted(() => {
  widgetList.value.forEach((w) => {
    const saved = localStorage.getItem(`widget:${w.key}`);
    if (saved !== null) {
      w.enabled = saved === 'true';
    }
  });
});

const toggleWidget = (widget: WidgetItem) => {
  widgetStore.setVisibility(widget.key, !widget.enabled);
};
</script>
