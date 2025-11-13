<template>
  <div class="min-w-52 w-52 border-r flex flex-col justify-between border-gray-200 dark:border-default pr-4 h-full">
    <nav class="space-y-1 flex-1">
      <template v-for="item in items" :key="item.slot">
        <USeparator v-if="item.label === 'Notas de Versões'" class="mt-4 mb-3" />
        <button class="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg" :class="item.slot === modelValue ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : `text-gray-700  cursor-pointer dark:text-gray-300 hover:bg-gray-100 ${bgByTheme}`" @click="$emit('update:modelValue', item.slot)">
          <UIcon :name="item.icon" class="w-4 h-4" />
          {{ item.label }}
        </button>
      </template>
    </nav>
  </div>
</template>

<script setup lang="ts">
const themePreset = ref<string | null>(null);

defineProps<{
  items: Array<{ label: string; icon: string; slot: string }>;
  modelValue: string;
}>();

defineEmits(['update:modelValue']);

const bgByTheme = computed(() => {
  return themePreset.value ? 'hover:bg-neutral-150 dark:hover:bg-primary-900' : 'dark:hover:bg-neutral-800';
});

watchEffect(() => {
  themePreset.value = localStorage.getItem('theme:preset');
});
</script>
