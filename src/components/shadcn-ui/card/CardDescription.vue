<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/utils/helpers/shared/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <p data-slot="card-description" :class="cn('text-default! text-sm', props.class)">
    <slot />
  </p>
</template>
