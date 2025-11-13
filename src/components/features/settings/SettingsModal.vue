<template>
  <UModal v-model:open="modals.configuracoes.open" title="Configurações" description="Gerencie suas preferências" :ui="{ content: 'min-w-5xl max-w-5xl overflow-x-hidden', body: ' p-0' }" @update:open="(open: boolean) => handleModal('configuracoes', open)">
    <template #body>
      <div class="flex h-[62dvh] overflow-hidden">
        <SettingsSidebar v-model="activeTab" :items="items" />
        <div class="flex-1 min-w-0 mx-4 w-full px-4 py-6 pb-0! pt-0 overflow-y-auto overflow-x-hidden">
          <Transition name="fade-left" mode="out-in">
            <component :is="currentTab" :key="activeTab" />
          </Transition>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useModalStore } from '@/composables/use-modal';
import AccountTab from './tabs/AccountTab.vue';
import AppearanceTab from './tabs/AppearanceTab.vue';
import CoworkersTab from './tabs/CoworkersTab.vue';
import LoginMobileTab from './tabs/LoginMobileTab.vue';
import ChangelogTab from './tabs/ChangelogTab.vue';
import KeyboardShortcutsTab from './tabs/KeyboardShortcutsTab.vue';

const { modals, handleModal, updateModalParam } = useModalStore();
const appVersion = __APP_VERSION__;
const route = useRoute();
const activeTab = ref((modals.configuracoes?.props?.tab as string) || (route.query.tab as string) || 'meu-perfil');

const items = [
  { label: 'Meu Perfil', icon: 'i-lucide-user-round', slot: 'meu-perfil' },
  {
    label: 'Colaboradores',
    icon: 'i-lucide-users-round',
    slot: 'colaboradores',
  },
  {
    label: 'Login Mobile',
    icon: 'i-lucide-tablet-smartphone',
    slot: 'login-mobile',
  },
  { label: 'Aparência & Uso', icon: 'i-lucide-palette', slot: 'aparencia' },
  {
    label: 'Atalhos de Teclado',
    icon: 'i-lucide-keyboard',
    slot: 'atalhos-teclado',
  },
  {
    label: 'Notas de Versões',
    icon: 'i-lucide-git-branch',
    slot: 'changelog',
  },
];

const componentsMap: Record<string, any> = {
  'meu-perfil': AccountTab,
  aparencia: AppearanceTab,
  colaboradores: CoworkersTab,
  'login-mobile': LoginMobileTab,
  changelog: ChangelogTab,
  'atalhos-teclado': KeyboardShortcutsTab,
};

const currentTab = computed(() => componentsMap[activeTab.value]);

watch(
  activeTab,
  (tab) => {
    updateModalParam('configuracoes', 'tab', tab);
  },
  { immediate: true, deep: true }
);

watch(
  () => modals.configuracoes?.props?.tab,
  (tab) => {
    if (tab && tab !== activeTab.value) {
      activeTab.value = tab;
    }
  },
  { immediate: true }
);
</script>
