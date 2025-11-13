<template>
  <div class="border rounded-lg p-3 bg-gray-50 dark:bg-default flex items-start gap-3 hover:bg-gray-100 dark:border-default btn-scale transition">
    <UIcon v-if="icon" :name="icon" class="w-5 h-5 text-primary mt-0.5" />

    <div>
      <p class="font-medium text-sm">
        {{ title }}
      </p>

      <p v-if="subtitle" class="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  icon?: string;
}>();
</script>
