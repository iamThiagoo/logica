<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils/helpers/shared/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <div data-slot="card" :class="cn('bg-(--card) dark:bg-elevated/50 text-card-foreground dark:!text-[#fafafa] flex flex-col gap-6 rounded-xl border dark:border-default py-6 shadow-sm', props.class)">
    <slot />
  </div>
</template>
