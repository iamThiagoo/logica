<template>
  <div ref="permissionsScroll" class="w-full max-w-full h-full min-w-0 wrap-break-words flex flex-col overflow-hidden">
    <UPageHeader title="Colaboradores & Acessos" description="Visualize os colaboradores e administre permissões de acordo com os módulos do template administrativo." class="mb-1 flex-shrink-0" :ui="{ root: 'pb-4 pt-0', title: 'text-xl!', description: 'text-sm' }" />

    <div class="relative flex-1 min-h-0 flex flex-col">
      <div v-if="!viewing" class="h-full flex flex-col transition-all duration-300" :class="{ 'opacity-0 -translate-x-6': viewing }">
        <div class="flex-shrink-0 mb-5">
          <UTabs v-model="viewMode" :items="viewModeItems" :content="false" size="sm" variant="link" class="w-full mb-6" />

          <div v-if="viewMode === 'user'" class="flex w-full gap-2">
            <UInput v-model="userSearch" placeholder="Buscar por nome do colaborador ou cargo..." class="flex-1" icon="i-lucide-search" />
            <USelect v-model="selectedSector" :items="sectors" placeholder="Selecione o setor" class="w-48" />
          </div>

          <div v-else class="flex w-full gap-2">
            <UInput v-model="permissionSearch" placeholder="Buscar por módulo, permissão ou usuário..." class="flex-1" icon="i-lucide-search" />
          </div>
        </div>

        <div v-if="viewMode === 'user'" class="flex-1 min-h-0 overflow-y-auto space-y-3 pr-2">
          <div v-for="colleague in filteredColleagues" :key="`${colleague.id}-${colleague.name}`" class="flex items-center btn-scale justify-between bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-700 transition cursor-pointer" @click="openPermissions(colleague)">
            <UUser
              :name="colleague.name"
              :description="`${colleague.role} • ${colleague.department}`"
              :avatar="{
                src: colleague.avatar,
              }"
              size="lg"
            />

            <div class="flex gap-x-3">
              <UButton icon="i-lucide-shield" size="sm" color="info" variant="soft"> Gerenciar Acessos </UButton>
            </div>
          </div>

          <p v-if="filteredColleagues.length === 0" class="text-sm text-gray-400 text-center py-6">Nenhum membro encontrado.</p>
        </div>

        <div v-else class="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2">
          <div v-for="module in filteredPermissionsGroupedByModule" :key="module.module" class="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800">
            <h3 class="font-medium text-base text-gray-700 dark:text-gray-100 mb-3">
              {{ module.module }}
            </h3>

            <div class="space-y-3">
              <div v-for="permission in module.permissions" :key="permission.key" class="rounded-lg bg-white dark:bg-neutral-900 p-3">
                <p class="text-sm font-medium text-gray-700 dark:text-gray-100">
                  {{ permission.label }}
                  <span class="text-xs text-gray-400 ml-1">({{ permission.key }})</span>
                </p>

                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <div v-for="user in permission.users" :key="`${permission.key}-${user.id}-${user.name}`" class="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-neutral-800 pl-3 pr-1 py-1">
                    <div class="flex gap-x-2 items-center">
                      <UAvatar :src="user.avatar" size="xs" />
                      <span class="text-xs text-gray-700 dark:text-gray-200">
                        {{ user.name }}
                      </span>
                    </div>
                    <UButton icon="i-lucide-x" size="xs" variant="ghost" color="neutral" class="p-0! min-w-0 w-5 h-5 rounded-full" @click.stop="removePermissionFromUser(permission.key, user)" />
                  </div>

                  <USelectMenu v-model="selectedUserToAddByPermission[permission.key]" :items="getAvailableUsersForPermission(permission.key)" value-key="value" option-attribute="label" placeholder="Adicionar usuário" size="sm" class="w-fit" :ui="{ content: 'min-w-fit', base: 'rounded-lg py-2' }" @update:model-value="(value) => addPermissionToUser(permission.key, value)" />
                </div>
                <p v-if="!permission.users.length" class="text-xs text-gray-400 mt-2">Nenhum usuário com esta permissão.</p>
              </div>
            </div>
          </div>

          <p v-if="filteredPermissionsGroupedByModule.length === 0" class="text-sm text-gray-400 text-center py-6">Nenhuma permissão encontrada.</p>
        </div>
      </div>

      <Transition name="fade-left">
        <section v-if="viewing" class="absolute inset-0 pt-0 overflow-hidden flex flex-col">
          <div class="flex justify-between items-center gap-2 mb-4 shrink-0" :class="{ 'opacity-0 translate-x-6': !viewing }">
            <div class="flex gap-x-2">
              <UButton icon="i-lucide-chevron-left" size="xl" variant="ghost" @click="closePermissions" />
              <UUser
                :name="selectedColleague?.name"
                :description="selectedColleague ? `${selectedColleague.role} • ${selectedColleague.department}` : ''"
                :avatar="{
                  src: selectedColleague?.avatar,
                }"
                size="xl"
              />
            </div>

            <div class="mr-3 gap-x-3 flex items-stretch">
              <USelect v-model="cloneFromId" :items="colleagues.filter((c) => c.id !== selectedColleague?.id).map((c) => ({ label: c.name, value: c.id }))" placeholder="Clonar de..." size="sm" class="w-48" />
              <UButton data-form-save icon="i-lucide-shield-check" color="primary" variant="solid" class="dark:text-gray-100 py-0! bg-primary-600" @click="handleSavePermissions">
                {{ cloneFromId ? 'Clonar' : 'Salvar' }}
                <template #trailing>
                  <FormSaveShortcutHint />
                </template>
              </UButton>
            </div>
          </div>

          <USeparator class="mb-4 shrink-0" />

          <section class="flex-1 overflow-y-auto pr-2 min-h-0">
            <div class="flex items-center justify-between gap-5 mb-5">
              <h3 class="font-medium text-base text-gray-700 dark:text-gray-100">Permissões do Usuário</h3>
              <UInput v-model="moduleSearch" placeholder="Buscar por módulo..." size="sm" icon="i-lucide-search" />
            </div>

            <div class="space-y-6 pb-6">
              <div v-for="mod in filteredSelectedPermissionModules" :key="mod.module" class="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800 btn-scale">
                <h4 class="font-medium text-gray-700 dark:text-gray-100 mb-3">
                  {{ mod.module }}
                </h4>

                <div class="gap-x-6 gap-y-3 flex flex-wrap items-center">
                  <div v-for="perm in mod.permissions" :key="perm.key" class="flex items-center flex-row gap-2">
                    <UCheckbox
                      :id="perm.key"
                      class="cursor-pointer"
                      :label="perm.label"
                      :model-value="selectedColleague?.permissions.includes(perm.key)"
                      :ui="{
                        label: 'cursor-pointer',
                        base: 'cursor-pointer',
                      }"
                      @update:model-value="togglePermission(perm.key)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUsersCrud } from '@/composables/use-admin-template-data';
import { showToast } from '@/utils/helpers/app/toast';
import type { UserRecord } from '@/utils/types/admin';
import { useRoute, useRouter } from 'vue-router';

type PermissionOption = {
  key: string;
  label: string;
};

type PermissionModule = {
  module: string;
  permissions: PermissionOption[];
};

type ColleagueWithPermissions = UserRecord & {
  avatar: string;
  permissions: string[];
};

const userSearch = ref('');
const moduleSearch = ref('');
const viewing = ref(false);
const selectedColleague = ref<ColleagueWithPermissions | null>(null);
const route = useRoute();
const router = useRouter();
const permissionsScroll = ref<HTMLElement | null>(null);
const selectedUserId = ref(route.query.user || null);
const cloneFromId = ref<string | undefined>(undefined);
const viewMode = ref<'user' | 'permission'>('user');
const permissionSearch = ref('');
const selectedUserToAddByPermission = reactive<Record<string, string | undefined>>({});
const { items: users } = useUsersCrud();

const viewModeItems = [
  { label: 'Por Usuário', value: 'user' },
  { label: 'Por Permissão', value: 'permission' },
];

const permissionModules: PermissionModule[] = [
  {
    module: 'Dashboard',
    permissions: [
      { key: 'dashboard.view', label: 'Visualizar indicadores' },
      { key: 'dashboard.customize', label: 'Personalizar widgets' },
      { key: 'dashboard.export', label: 'Exportar dados' },
    ],
  },
  {
    module: 'Clientes',
    permissions: [
      { key: 'clients.view', label: 'Visualizar clientes' },
      { key: 'clients.create', label: 'Cadastrar clientes' },
      { key: 'clients.edit', label: 'Editar clientes' },
      { key: 'clients.delete', label: 'Excluir clientes' },
    ],
  },
  {
    module: 'Leads',
    permissions: [
      { key: 'leads.view', label: 'Visualizar leads' },
      { key: 'leads.create', label: 'Cadastrar leads' },
      { key: 'leads.edit', label: 'Atualizar pipeline' },
      { key: 'leads.convert', label: 'Converter oportunidades' },
    ],
  },
  {
    module: 'Usuários',
    permissions: [
      { key: 'users.view', label: 'Visualizar usuários' },
      { key: 'users.create', label: 'Convidar usuários' },
      { key: 'users.edit', label: 'Editar perfis' },
      { key: 'users.permissions', label: 'Gerenciar permissões' },
    ],
  },
  {
    module: 'Agenda de Reuniões',
    permissions: [
      { key: 'meetings.view', label: 'Visualizar agenda' },
      { key: 'meetings.create', label: 'Criar reservas' },
      { key: 'meetings.edit', label: 'Editar reservas' },
      { key: 'meetings.manage', label: 'Gerenciar salas' },
    ],
  },
  {
    module: 'Drive Compartilhado',
    permissions: [
      { key: 'drive.view', label: 'Visualizar arquivos' },
      { key: 'drive.upload', label: 'Enviar arquivos' },
      { key: 'drive.share', label: 'Compartilhar arquivos' },
      { key: 'drive.delete', label: 'Remover arquivos' },
    ],
  },
  {
    module: 'Configurações',
    permissions: [
      { key: 'settings.view', label: 'Acessar configurações' },
      { key: 'settings.edit', label: 'Editar preferências' },
      { key: 'settings.team', label: 'Gerenciar colaboradores' },
    ],
  },
];

const allPermissionKeys = permissionModules.flatMap((module) => module.permissions.map((permission) => permission.key));

const permissionByAccessLevel: Record<string, string[]> = {
  Administrador: allPermissionKeys,
  Editor: ['dashboard.view', 'dashboard.customize', 'clients.view', 'clients.create', 'clients.edit', 'leads.view', 'leads.create', 'leads.edit', 'users.view', 'meetings.view', 'meetings.create', 'meetings.edit', 'drive.view', 'drive.upload', 'drive.share', 'settings.view'],
  Leitor: ['dashboard.view', 'clients.view', 'leads.view', 'users.view', 'meetings.view', 'drive.view', 'settings.view'],
};

const permissionByDepartment: Record<string, string[]> = {
  Comercial: ['clients.view', 'clients.create', 'clients.edit', 'leads.view', 'leads.create', 'leads.edit', 'leads.convert'],
  Operações: ['meetings.view', 'meetings.create', 'meetings.edit', 'drive.view', 'drive.upload', 'drive.share'],
  Financeiro: ['dashboard.export', 'clients.view', 'leads.view'],
  Suporte: ['users.view', 'users.permissions', 'drive.view', 'settings.view', 'settings.edit', 'settings.team'],
};

const buildAvatarUrl = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E2E8F0&color=0F172A`;

const buildPermissions = (user: UserRecord) => {
  const basePermissions = permissionByAccessLevel[user.accessLevel] ?? permissionByAccessLevel.Leitor;
  const departmentPermissions = permissionByDepartment[user.department] ?? [];

  return Array.from(new Set([...basePermissions, ...departmentPermissions]));
};

const colleagues = ref<ColleagueWithPermissions[]>(
  users.value.map((user) => ({
    ...user,
    avatar: buildAvatarUrl(user.name),
    permissions: buildPermissions(user),
  }))
);

const sectors = computed(() => ['Todos os setores', ...new Set(colleagues.value.map((colleague) => colleague.department))]);
const selectedSector = ref('Todos os setores');

const filteredColleagues = computed(() => {
  const term = userSearch.value.trim().toLowerCase();

  return colleagues.value.filter((colleague) => {
    const matchesSector = selectedSector.value === 'Todos os setores' || colleague.department === selectedSector.value;
    const matchesSearch = !term || colleague.name.toLowerCase().includes(term) || colleague.role.toLowerCase().includes(term);

    return matchesSector && matchesSearch;
  });
});

const permissionsGroupedByModule = computed(() =>
  permissionModules.map((module) => ({
    module: module.module,
    permissions: module.permissions.map((permission) => ({
      ...permission,
      users: colleagues.value.filter((colleague) => colleague.permissions.includes(permission.key)),
    })),
  }))
);

const filteredPermissionsGroupedByModule = computed(() => {
  const term = permissionSearch.value.trim().toLowerCase();
  if (!term) return permissionsGroupedByModule.value;

  return permissionsGroupedByModule.value
    .map((module) => {
      const moduleMatch = module.module.toLowerCase().includes(term);
      const permissions = module.permissions.filter((permission) => {
        if (moduleMatch) return true;

        const permissionMatch = permission.label.toLowerCase().includes(term) || permission.key.toLowerCase().includes(term);
        const userMatch = permission.users.some((user) => user.name.toLowerCase().includes(term) || user.role.toLowerCase().includes(term));

        return permissionMatch || userMatch;
      });

      return {
        module: module.module,
        permissions,
      };
    })
    .filter((module) => module.permissions.length > 0);
});

const filteredSelectedPermissionModules = computed(() => {
  const term = moduleSearch.value.trim().toLowerCase();
  if (!term) return permissionModules;

  return permissionModules
    .map((module) => {
      const moduleMatch = module.module.toLowerCase().includes(term);
      const permissions = module.permissions.filter((permission) => {
        if (moduleMatch) return true;
        return permission.label.toLowerCase().includes(term) || permission.key.toLowerCase().includes(term);
      });

      return {
        module: module.module,
        permissions,
      };
    })
    .filter((module) => module.permissions.length > 0);
});

function openPermissions(colleague: ColleagueWithPermissions) {
  selectedColleague.value = colleague;
  selectedUserId.value = colleague.id;
  viewing.value = true;

  nextTick(() => {
    permissionsScroll.value?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

function closePermissions() {
  viewing.value = false;
  selectedUserId.value = null;
  cloneFromId.value = undefined;
  moduleSearch.value = '';
  setTimeout(() => (selectedColleague.value = null), 300);
}

function openUserById(id: string | string[] | null) {
  if (!id) return;

  const normalizedId = Array.isArray(id) ? id[0] : id;
  const user = colleagues.value.find((colleague) => colleague.id === normalizedId);
  if (user) openPermissions(user);
}

function togglePermission(key: string) {
  if (!selectedColleague.value) return;

  const permissions = selectedColleague.value.permissions;

  if (permissions.includes(key)) {
    selectedColleague.value.permissions = permissions.filter((permission) => permission !== key);
  } else {
    selectedColleague.value.permissions = [...permissions, key];
  }
}

function removePermissionFromUser(permissionKey: string, targetUser: ColleagueWithPermissions) {
  const user = colleagues.value.find((colleague) => colleague.id === targetUser.id);
  if (!user) return;

  user.permissions = user.permissions.filter((permission) => permission !== permissionKey);

  if (selectedColleague.value?.id === user.id) {
    selectedColleague.value.permissions = [...user.permissions];
  }
}

function getAvailableUsersForPermission(permissionKey: string) {
  return colleagues.value
    .map((user, index) => ({ user, index }))
    .filter(({ user }) => !user.permissions.includes(permissionKey))
    .map(({ user, index }) => ({
      label: `${user.name} - ${user.role}`,
      value: index.toString(),
    }));
}

function addPermissionToUser(permissionKey: string, selectedValue?: string) {
  if (!selectedValue) return;

  const userIndex = Number(selectedValue);
  const user = colleagues.value[userIndex];
  if (!user) return;

  if (!user.permissions.includes(permissionKey)) {
    user.permissions = [...user.permissions, permissionKey];
  }

  if (selectedColleague.value?.id === user.id) {
    selectedColleague.value.permissions = [...user.permissions];
  }

  selectedUserToAddByPermission[permissionKey] = undefined;
}

function handleSavePermissions() {
  if (!selectedColleague.value) return;

  if (cloneFromId.value) {
    const sourceUser = colleagues.value.find((colleague) => colleague.id === cloneFromId.value);

    if (sourceUser) {
      selectedColleague.value.permissions = [...sourceUser.permissions];
    }
  }

  showToast({
    message: cloneFromId.value ? 'Permissões clonadas com sucesso!' : 'Permissões salvas com sucesso!',
    type: 'success',
  });
}

onMounted(() => {
  if (selectedUserId.value) {
    openUserById(selectedUserId.value);
  }
});

watch(selectedColleague, () => {
  nextTick(() => {
    permissionsScroll.value?.scrollTo({ top: 0 });
  });
});

watch(
  selectedUserId,
  (id) => {
    const query = { ...route.query };
    query.tab = 'colaboradores';

    if (id) query.user = id;
    else delete query.user;

    router.replace({ query });
  },
  { immediate: true }
);
</script>

<style scoped>
.fade-left-enter-active {
  transition:
    opacity 0.5s ease-in-out,
    transform 0.5s ease;
}

.fade-left-leave-active {
  transition:
    opacity 0.15s ease-out,
    transform 0.15s ease-out;
}

.fade-left-enter-from,
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.fade-left-enter-to,
.fade-left-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
