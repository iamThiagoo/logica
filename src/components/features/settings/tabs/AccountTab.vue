<template>
  <div class="w-full space-y-6 h-full">
    <UPageHeader
      title="Meu Perfil"
      description="Acompanhe os seus dados de perfil."
      class="mb-1"
      :ui="{
        root: 'pb-6 pt-0',
        title: 'text-xl!',
        description: 'text-sm',
      }"
    />
    <div class="grid grid-cols-7 items-center mb-4 mt-0">
      <img :src="profile.avatar" class="col-span-1 w-19 h-19 rounded-full object-cover" />
      <div class="col-span-6">
        <h2 class="flex items-center gap-3">
          {{ profile.name }}
          <UBadge color="success" icon="i-lucide-circle-user-round" variant="soft" class="-mt-0.5 -ml-1">
            {{ profile.email }}
          </UBadge>
        </h2>

        <p class="text-sm text-gray-500 dark:text-gray-300 mt-1.5">{{ profile.role }} - Na empresa desde {{ profile.joinedAt }}</p>
      </div>
    </div>
    <USeparator class="mt-5! mb-3" />
    <UCard
      :ui="{
        body: 'p-4! px-4!',
      }"
      class="mt-6! mb-4!"
    >
      <template #header>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-semibold">Segurança e permissões</h3>
            </div>
            <p class="text-sm text-muted">Atualize as permissões sem sair do sistema.</p>
          </div>

          <UTooltip text="Busca as permissões mais recentes do servidor">
            <UButton size="sm" variant="soft" color="info" class="w-full sm:w-auto justify-center focus-visible:ring-2 focus-visible:ring-primary-500/60" :icon="reloadPermissionsButtonIcon" :label="reloadPermissionsButtonLabel" :loading="isReloadingPermissions" :disabled="isReloadingPermissions" aria-label="Recarregar permissões do usuário" @click="reloadPermissions" />
          </UTooltip>
        </div>
      </template>

      <div class="grid gap-3 md:grid-cols-2">
        <div class="rounded-lg border border-default p-3">
          <p class="text-xs text-muted uppercase tracking-wide">Minhas Permissões</p>
          <p class="text-sm mt-1 font-medium">{{ roleIds.length }} permiss{{ roleIds.length === 1 ? 'ão' : 'ões' }} ativa{{ roleIds.length === 1 ? '' : 's' }}</p>
        </div>
      </div>

      <div class="space-y-2">
        <p v-if="lastPermissionsReloadAt" class="text-xs text-muted flex items-center gap-1.5">
          <UIcon name="i-lucide-clock-3" class="size-3.5" />
          Última atualização:
          {{ lastPermissionsReloadAt }}
        </p>

        <div v-if="hasPermissionsReloadError" class="space-y-2 mt-4">
          <UAlert color="error" variant="soft" icon="i-lucide-triangle-alert" title="Não foi possível atualizar suas permissões" :description="permissionsReloadErrorMessage" />
        </div>
      </div>
    </UCard>

    <UAccordion :items="accordionItems" type="multiple" :ui="{ label: 'text-base' }" class="mb-10! overflow-y-auto overflow-x-hidden">
      <template #item="{ item }">
        <div class="space-y-3 pt-1 px-0.5 pb-6 overflow-x-hidden">
          <component :is="item.component" />
        </div>
      </template>
    </UAccordion>
  </div>
</template>

<script setup lang="ts">
import api from '@/api';
import { useAuthStore } from '@/stores/modules/auth.store';
import { isLocalAdminToken, LOCAL_ADMIN_ROLES } from '@/utils/helpers/app/auth';
import FootprintsAccordionItem from '@/components/features/settings/accordion-item/FootprintsAccordionItem.vue';
import TokenAccordionItem from '@/components/features/settings/accordion-item/TokenAccordionItem.vue';

const toast = useToast();
const userStore = useAuthStore();
const isReloadingPermissions = ref(false);
const hasPermissionsReloadError = ref(false);
const permissionsReloadErrorMessage = ref('');
const lastPermissionsReloadAt = ref('');

const profile = computed(() => {
  const me = userStore.user;
  const username = me?.usuario_ad || me?.nome || '-';
  return {
    name: me?.nome || '-',
    username,
    avatar: `https://avatars.githubusercontent.com/u/69599810?v=4`,
    role: 'Administrador do Sistema',
    email: me?.email || '-',
    joinedAt: '01/01/2026',
  };
});

const roleIds = computed(() => {
  if (Array.isArray(userStore.roles) && userStore.roles.length > 0) {
    return userStore.roles.map((role) => String(role));
  }

  try {
    const raw = localStorage.getItem('roles');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((role) => String(role)) : [];
  } catch {
    return [];
  }
});

const reloadPermissionsButtonLabel = computed(() => (isReloadingPermissions.value ? 'Recarregando...' : 'Recarregar'));

const reloadPermissionsButtonIcon = computed(() => (isReloadingPermissions.value ? 'i-lucide-loader-circle' : 'i-lucide-refresh-cw'));

async function reloadPermissions() {
  if (isReloadingPermissions.value) return;

  isReloadingPermissions.value = true;
  hasPermissionsReloadError.value = false;
  permissionsReloadErrorMessage.value = '';

  try {
    const token = userStore.token || localStorage.getItem('token');
    const user = (userStore.user as any) || null;
    let cdFunc = user?.cd_func || user?.id || null;

    if (isLocalAdminToken(token)) {
      const normalizedRoles = [...LOCAL_ADMIN_ROLES];
      userStore.roles = normalizedRoles;
      localStorage.setItem('roles', JSON.stringify(normalizedRoles));
      lastPermissionsReloadAt.value = new Date().toLocaleString('pt-BR');

      toast.add({
        title: 'Permissões atualizadas',
        description: 'As roles mais recentes já estão ativas.',
        icon: 'i-lucide-check',
        color: 'success',
      });
      return;
    }

    if (!cdFunc && token) {
      const freshUser = await api.auth.auth.me(token);
      userStore.user = freshUser;
      cdFunc = freshUser?.cd_func || freshUser?.id || null;
    }

    if (!cdFunc) {
      throw new Error('Não conseguimos identificar seu usuário para atualizar os acessos.');
    }

    const freshRoles = await api.auth.auth.roles(cdFunc);

    const normalizedRoles = Array.isArray(freshRoles) ? freshRoles : [];
    userStore.roles = normalizedRoles;
    localStorage.setItem('roles', JSON.stringify(normalizedRoles));
    lastPermissionsReloadAt.value = new Date().toLocaleString('pt-BR');

    toast.add({
      title: 'Permissões atualizadas',
      description: 'As roles mais recentes já estão ativas.',
      icon: 'i-lucide-check',
      color: 'success',
    });
  } catch (error: any) {
    hasPermissionsReloadError.value = true;
    permissionsReloadErrorMessage.value = error?.message || 'Tivemos um problema de conexão. Verifique sua internet e tente novamente.';
  } finally {
    isReloadingPermissions.value = false;
  }
}

const accordionItems = [
  {
    id: 'footprints',
    label: 'Meus Atalhos',
    icon: 'i-lucide-footprints',
    slot: 'item',
    component: FootprintsAccordionItem,
  },
  {
    id: 'token',
    label: 'Token de Acesso',
    icon: 'i-lucide-key-round',
    slot: 'item',
    component: TokenAccordionItem,
  },
];
</script>
