<template>
  <UPopover v-model:open="isOpen">
    <UFormField :label="label" :name="name" :required="required">
      <UButton color="neutral" variant="outline" class="w-full justify-start">
        <UIcon v-if="selectedIcon" :name="selectedIcon" class="w-5 h-5 mr-0.5" />
        <span class="truncate">
          {{ selectedIcon ? selectedIcon.replace('i-lucide-', '') : placeholder }}
        </span>
      </UButton>
    </UFormField>

    <template #content>
      <div class="p-4 pt-6 w-[590px]">
        <div class="mb-4">
          <UInput v-model="searchQuery" placeholder="Buscar ícone..." icon="i-lucide-search" size="sm" class="w-full" />
        </div>

        <div class="pt-1 grid grid-cols-6 gap-2 max-h-64 flex justify-center overflow-y-auto">
          <button
            v-for="icon in filteredIcons"
            :key="icon"
            type="button"
            class="p-2 rounded-lg btn-scale cursor-pointer border transition-all flex justify-center items-center flex-col hover:bg-neutral-100 dark:hover:bg-neutral-800"
            :class="{
              'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20': selectedIcon === icon,
              'border-gray-200 dark:border-neutral-700': selectedIcon !== icon,
            }"
            @click="selectIcon(icon)"
          >
            <UIcon :name="icon" class="w-5 h-5" />
            <div class="text-[10px] mt-1 truncate text-gray-600 dark:text-gray-400">
              {{ icon.replace('i-lucide-', '') }}
            </div>
          </button>
        </div>

        <div v-if="filteredIcons.length === 0" class="text-center text-sm py-8 text-neutral-500">Nenhum ícone encontrado</div>

        <div v-if="selectedIcon" class="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <UIcon :name="selectedIcon" class="w-5 h-5" />
              <span class="text-sm font-medium">
                {{ selectedIcon.replace('i-lucide-', '') }}
              </span>
            </div>
            <UButton color="neutral" variant="ghost" size="sm" icon="i-lucide-eraser" @click="clearSelection"> Limpar </UButton>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { commonIcons } from '@/utils/constants/contents/icons-selector';

interface Props {
  modelValue?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string | undefined): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Selecione um ícone',
  label: 'Ícone',
  name: 'icon',
});

const emit = defineEmits<Emits>();
const isOpen = ref(false);
const searchQuery = ref('');

const selectedIcon = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const filteredIcons = computed(() => {
  if (!searchQuery.value) return commonIcons;
  const query = searchQuery.value.toLowerCase();
  return commonIcons.filter((icon) => icon.replace('i-lucide-', '').toLowerCase().includes(query));
});

function selectIcon(icon: string) {
  selectedIcon.value = icon;
  isOpen.value = false;
}

function clearSelection() {
  selectedIcon.value = undefined;
}
</script>
