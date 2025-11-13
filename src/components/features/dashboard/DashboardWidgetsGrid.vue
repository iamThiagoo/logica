<template>
  <section>
    <USeparator class="mb-6 mt-7" />
    <ShortcutWidget class="mb-5" />
    <USeparator class="mb-6 mt-7" />
    <ReunionWidget />
  </section>
</template>

<script setup lang="ts">
import ShortcutWidget from '@/components/features/widgets/ShortcutWidget.vue';
import ReunionWidget from '@/components/features/widgets/ReunionWidget.vue';
</script>
