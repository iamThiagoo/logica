<template>
  <UPopover v-model:open="open" :content="{ align: 'end' }">
    <UButton size="lg" color="neutral" variant="outline" icon="i-lucide-filter" :label="buttonComputedLabel" class="w-auto" data-table-filter-trigger />

    <template #content>
      <div class="w-80 p-4 space-y-4">
        <div v-for="filter in filters" :key="filter.id" class="space-y-1">
          <p class="text-sm font-medium text-highlighted">
            {{ filter.label }}
          </p>

          <USelectMenu v-if="filter.type === 'select'" :model-value="toStringValue(draftState[filter.id])" :items="filter.options ?? []" option-attribute="label" value-key="value" size="sm" class="w-full" :placeholder="filter.placeholder || 'Selecione...'" @update:model-value="(value: string) => setFilterValue(filter.id, value)" />

          <UCheckbox v-else-if="filter.type === 'boolean'" :model-value="Boolean(draftState[filter.id])" :label="filter.placeholder || 'Ativar filtro'" @update:model-value="(value: boolean | 'indeterminate') => setFilterValue(filter.id, value === true)" />

          <UInput v-else :model-value="toStringValue(draftState[filter.id])" size="sm" :placeholder="filter.placeholder || 'Digite um valor...'" class="w-full" @update:model-value="(value: string) => setFilterValue(filter.id, value)" />
        </div>

        <div class="pt-2 border-t border-default flex items-center justify-between gap-2">
          <UButton size="sm" color="neutral" variant="ghost" label="Limpar" icon="i-lucide-eraser" @click="clearFilters" />
          <UButton size="sm" color="primary" label="Aplicar" icon="i-lucide-funnel-plus" class="text-gray-100" @click="applyFilters" />
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import type { DataTableFilterConfig, DataTableFiltersState, DataTableFilterValue } from '@/utils/types/data-table-filters';
import { createInitialFiltersState } from '@/utils/types/data-table-filters';

interface Props {
  filters: DataTableFilterConfig[];
  modelValue: DataTableFiltersState;
  buttonLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  buttonLabel: 'Filtros',
});

const emit = defineEmits<{
  'update:modelValue': [value: DataTableFiltersState];
  apply: [value: DataTableFiltersState];
  clear: [value: DataTableFiltersState];
}>();

const open = ref(false);
const draftState = ref<DataTableFiltersState>(createInitialState());

const buttonComputedLabel = computed(() => {
  if (activeFiltersCount.value <= 0) return props.buttonLabel;
  return `${props.buttonLabel} (${activeFiltersCount.value})`;
});

const activeFiltersCount = computed(() => {
  return Object.values(props.modelValue || {}).filter((value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return value === true;
  }).length;
});

watch(
  () => open.value,
  (isOpen) => {
    if (isOpen) {
      syncFromModel();
    }
  }
);

watch(
  () => props.modelValue,
  () => {
    if (!open.value) {
      syncFromModel();
    }
  },
  { deep: true }
);

function createInitialState() {
  return createInitialFiltersState(props.filters || []);
}

function syncFromModel() {
  draftState.value = {
    ...createInitialState(),
    ...(props.modelValue || {}),
  };
}

function toStringValue(value: DataTableFilterValue) {
  return typeof value === 'string' ? value : '';
}

function setFilterValue(id: string, value: DataTableFilterValue) {
  draftState.value = {
    ...draftState.value,
    [id]: value,
  };
}

function normalizeState(state: DataTableFiltersState) {
  const normalized: DataTableFiltersState = {};

  Object.entries(state).forEach(([key, value]) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      normalized[key] = trimmed.length > 0 ? trimmed : undefined;
      return;
    }
    normalized[key] = value;
  });

  return normalized;
}

function applyFilters() {
  const normalizedState = normalizeState(draftState.value);
  emit('update:modelValue', normalizedState);
  emit('apply', normalizedState);
  open.value = false;
}

function clearFilters() {
  const clearedState = createInitialState();
  draftState.value = clearedState;
  emit('update:modelValue', clearedState);
  emit('clear', clearedState);
  open.value = false;
}
</script>
