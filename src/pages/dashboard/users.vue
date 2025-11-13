<template>
  <BaseDataTablePage
    title="Usuários"
    description="Centralize perfis, acessos e status de colaboradores que utilizam o dashboard."
    :breadcrumb-items="breadcrumbItems"
    :items="tableData"
    :columns="columns"
    search-placeholder="Pesquisar usuários..."
    search-input-class="w-[16rem]"
    :status-filter-options="statusFilterOptions"
    :show-context-menu="true"
    :context-menu-items-fn="getRowItems"
    :pinned-columns="{ right: ['actions'] }"
    :show-export-button="false"
    create-button-label="Novo Usuário"
    :on-mounted="handleTableMounted"
    @create="handleCreate"
    @contextmenu="handleContextMenu"
  />

  <UModal v-model:open="isDeleteOpen" title="Excluir Usuário" :ui="{ footer: 'justify-end' }">
    <template #body>
      <p class="text-gray-700 dark:text-gray-300">
        Tem certeza que deseja excluir o usuário
        <span class="font-semibold">{{ selectedUser?.name }}</span
        >?
      </p>
      <br />
      <p>Essa ação remove apenas o registro mockado disponível neste template.</p>
    </template>
    <template #footer>
      <UButton size="lg" color="neutral" variant="outline" icon="i-lucide-x" label="Fechar" @click="isDeleteOpen = false" />
      <UButton color="error" size="lg" variant="solid" label="Excluir" icon="i-lucide-trash-2" class="text-white" @click="onConfirmDelete" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, TableColumn, TableRow } from '@nuxt/ui';
import { useUsersCrud } from '@/composables/use-admin-template-data';
import { useModalStore } from '@/composables/use-modal';
import { useTableHeader } from '@/composables/use-table-header';
import BaseDataTablePage from '@/components/shared/base/BaseDataTablePage.vue';
import { showToast } from '@/utils/helpers/app/toast';
import { pagesIconsMap } from '@/utils/types/map/icons-map';
import type { UserRecord } from '@/utils/types/admin';

const { items: users, remove } = useUsersCrud();
const { openModal } = useModalStore();
const isDeleteOpen = ref(false);
const selectedUser = ref<UserRecord | null>(null);
const tableRef = ref<any>(null);
const searchingMap = ref<Record<string, boolean>>({});
const columnFiltersMap = ref<Record<string, string>>({});

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const UInput = resolveComponent('UInput');

const breadcrumbItems = [
  { label: 'Meu Dashboard', icon: pagesIconsMap.home_root, to: '/' },
  { label: 'Usuários', icon: pagesIconsMap.users_root },
];

const statusFilterOptions = [
  { value: 'Ativo', label: 'Ativos' },
  { value: 'Convidado', label: 'Convidados' },
  { value: 'Inativo', label: 'Inativos' },
];

const tableData = computed(() =>
  users.value.map((user) => ({
    name: user.name,
    role: user.role,
    department: user.department,
    accessLevel: user.accessLevel,
    email: user.email,
    status: user.status,
    lastLogin: user.lastLogin,
    raw: user,
  }))
);

const onFilterChange = (columnId: string) => {
  if (!tableRef.value?.tableApi) return;
  const value = columnFiltersMap.value[columnId] || undefined;
  tableRef.value.tableApi.getColumn(columnId)?.setFilterValue(value);
};

const { getHeader } = useTableHeader(
  {
    searchingMap,
    columnFiltersMap,
    onFilterChange,
  },
  {
    UButton,
    UDropdownMenu,
    UInput,
  }
);

const columns: TableColumn<any>[] = [
  { accessorKey: 'name', meta: { label: 'Nome' }, header: ({ column }) => getHeader(column, 'Nome') },
  { accessorKey: 'role', meta: { label: 'Cargo' }, header: ({ column }) => getHeader(column, 'Cargo') },
  { accessorKey: 'department', meta: { label: 'Departamento' }, header: ({ column }) => getHeader(column, 'Departamento') },
  { accessorKey: 'accessLevel', meta: { label: 'Acesso' }, header: ({ column }) => getHeader(column, 'Acesso') },
  { accessorKey: 'email', meta: { label: 'E-mail' }, header: ({ column }) => getHeader(column, 'E-mail') },
  {
    accessorKey: 'status',
    meta: { label: 'Status' },
    header: ({ column }) => getHeader(column, 'Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const UBadge = resolveComponent('UBadge');
      const colorMap: Record<string, string> = {
        Ativo: 'success',
        Convidado: 'warning',
        Inativo: 'neutral',
      };

      return h(UBadge, {
        label: status,
        color: colorMap[status] ?? 'neutral',
        variant: 'soft',
      });
    },
  },
  { accessorKey: 'lastLogin', meta: { label: 'Último Acesso' }, header: ({ column }) => getHeader(column, 'Último Acesso') },
  {
    id: 'actions',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: { align: 'end' },
            items: getRowItems(row),
            'onUpdate:open': (open: boolean) => {
              if (!open) row.toggleSelected(false);
            },
          },
          {
            default: () =>
              h(UButton, {
                icon: 'i-lucide-ellipsis-vertical',
                variant: 'ghost',
                color: 'neutral',
                onClick: (event: MouseEvent) => {
                  event.stopPropagation();
                  if (!row.getIsSelected()) row.toggleSelected(true);
                },
              }),
          }
        )
      ),
  },
];

function getRowItems(row: TableRow<any>): DropdownMenuItem[] {
  return [
    { type: 'label', label: 'Ações Disponíveis' },
    { type: 'separator' },
    {
      label: 'Visualizar Perfil',
      icon: 'i-lucide-eye',
      onSelect() {
        openModal('novo-usuario', { item: row.original.raw });
      },
    },
    {
      label: 'Editar Usuário',
      icon: 'i-lucide-pencil',
      onSelect() {
        openModal('novo-usuario', { item: row.original.raw });
      },
    },
    { type: 'separator' },
    {
      label: 'Excluir Usuário',
      color: 'error',
      icon: 'i-lucide-trash',
      onSelect() {
        selectedUser.value = row.original.raw;
        isDeleteOpen.value = true;
      },
    },
  ];
}

const handleCreate = () => {
  openModal('novo-usuario');
};

const handleContextMenu = (_event: Event, _row: TableRow<any>) => {};

const handleTableMounted = ({ table }: { table: any }) => {
  tableRef.value = table?.value;
};

const onConfirmDelete = () => {
  if (!selectedUser.value) return;
  remove(selectedUser.value.id);
  isDeleteOpen.value = false;

  showToast({
    title: 'Usuário removido',
    message: `O usuário ${selectedUser.value.name} foi removido da base mockada.`,
    type: 'success',
  });
};
</script>
