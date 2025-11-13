<template>
  <Teleport to="body">
    <component :is="modal.component" v-for="(modal, name) in modals" v-bind="modal.props" :key="name" />
  </Teleport>
</template>

<script setup lang="ts">
import { useModalStore } from '@/composables/use-modal';
const { modals } = useModalStore();
</script>
