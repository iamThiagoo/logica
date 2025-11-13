<template>
  <span v-if="keyboardShortcutsEnabled" class="flex items-center gap-1 text-muted" aria-hidden="true">
    <UKbd v-if="keyboardShortcutsEnabled" size="sm" value="shift+s" />
  </span>
</template>

<script setup lang="ts">
import { useKeyboardShortcuts } from '@/composables/use-keyboard-shortcuts';

const { enabled } = useKeyboardShortcuts();
const keyboardShortcutsEnabled = computed(() => enabled.value);
</script>
