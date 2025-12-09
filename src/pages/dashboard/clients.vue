<template>
  <BaseDataTablePage
    title="Clientes"
    description="Acompanhe o relacionamento e mantenha seu cadastro comercial organizado."
    :breadcrumb-items="breadcrumbItems"
    :items="tableData"
    :columns="columns"
    search-placeholder="Pesquisar clientes..."
    search-input-class="w-[16rem]"
    :status-filter-options="statusFilterOptions"
    :show-context-menu="true"
    :context-menu-items-fn="getRowItems"
    :pinned-columns="{ left: ['favorite'], right: ['actions'] }"
    :show-export-button="false"
    create-button-label="Novo"
    :on-mounted="handleTableMounted"
    @create="handleCreate"
    @contextmenu="handleContextMenu"
  />
  <UModal v-model:open="isDeleteOpen" title="Excluir Cliente" :ui="{ footer: 'justify-end' }">
    <template #body>
      <p class="text-gray-700 dark:text-gray-300">
        Tem certeza que deseja excluir o cliente
        <span class="font-semibold">{{ selectedClient?.name }}</span
        >?
      </p>
      <br />
      <p>Esta ação remove o registro mockado da listagem atual.</p>
    </template>
    <template #footer>
      <UButton size="lg" color="neutral" variant="outline" icon="i-lucide-x" label="Fechar" @click="isDeleteOpen = false" />
      <UButton color="error" size="lg" variant="solid" label="Excluir" icon="i-lucide-trash-2" class="text-white" @click="onConfirmDelete" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, TableColumn, TableRow } from '@nuxt/ui';
import { useClientsCrud } from '@/composables/use-admin-template-data';
import { useModalStore } from '@/composables/use-modal';
import { useTableHeader } from '@/composables/use-table-header';
import BaseDataTablePage from '@/components/shared/base/BaseDataTablePage.vue';
import { showToast } from '@/utils/helpers/app/toast';
import { pagesIconsMap } from '@/utils/types/map/icons-map';
import type { ClientRecord } from '@/utils/types/admin';

const { items: clients, remove } = useClientsCrud();
const { openModal } = useModalStore();
const isDeleteOpen = ref(false);
const selectedClient = ref<ClientRecord | null>(null);
const favoritesOnly = ref(false);
const favoritesStorageKey = 'template:clients:favorites';
const favorites = ref<string[]>([]);
const tableRef = ref<any>(null);
const searchingMap = ref<Record<string, boolean>>({});
const columnFiltersMap = ref<Record<string, string>>({});

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const UInput = resolveComponent('UInput');

const breadcrumbItems = [
  { label: 'Meu Dashboard', icon: pagesIconsMap.home_root, to: '/' },
  { label: 'Clientes', icon: pagesIconsMap.clients_root },
];

const statusFilterOptions = [
  { value: 'Ativo', label: 'Ativos' },
  { value: 'Em onboarding', label: 'Em onboarding' },
  { value: 'Inativo', label: 'Inativos' },
];

const favoritesSet = computed(() => new Set(favorites.value));
const getClientId = (row: any) => String((row?.raw ?? row?.original?.raw ?? row?.original)?.id || '');
const isFavorite = (row: any) => favoritesSet.value.has(getClientId(row));

const saveFavorites = () => {
  localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites.value));
};

const toggleFavorite = (row: any) => {
  const id = getClientId(row);
  if (!id) return;

  favorites.value = favoritesSet.value.has(id) ? favorites.value.filter((favorite) => favorite !== id) : [...favorites.value, id];
  saveFavorites();
};

const tableData = computed(() =>
  clients.value.map((client) => ({
    favorite: favoritesSet.value.has(client.id),
    code: client.code,
    name: client.name,
    company: client.company,
    segment: client.segment,
    city: client.city,
    email: client.email,
    lastContact: client.lastContact.split('-').reverse().join('/'),
    status: client.status,
    raw: client,
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
  {
    id: 'favorite',
    accessorKey: 'favorite',
    meta: { label: 'Favorito' },
    header: ({ column }) => {
      const isSorted = computed(() => column.getIsSorted());

      return h(
        UDropdownMenu,
        {
          content: { align: 'start' },
          items: [
            {
              label: 'Asc',
              type: 'checkbox',
              checked: isSorted.value === 'asc',
              onSelect: () => (isSorted.value === 'asc' ? column.clearSorting() : column.toggleSorting(false)),
            },
            {
              label: 'Desc',
              type: 'checkbox',
              checked: isSorted.value === 'desc',
              onSelect: () => (isSorted.value === 'desc' ? column.clearSorting() : column.toggleSorting(true)),
            },
          ],
        },
        () =>
          h(UButton, {
            icon: 'i-lucide-star',
            size: 'xs',
            variant: 'ghost',
            color: 'neutral',
            class: 'mx-auto',
            'aria-label': 'Ordenar por favoritos',
          })
      );
    },
    cell: ({ row }) =>
      h(UButton, {
        icon: isFavorite(row) ? 'i-lucide-star' : 'i-lucide-star-off',
        variant: 'ghost',
        color: 'neutral',
        size: 'xs',
        class: isFavorite(row) ? 'text-amber-500 hover:text-amber-600' : 'mx-auto text-muted hover:text-amber-500',
        'aria-label': isFavorite(row) ? 'Remover dos favoritos' : 'Adicionar aos favoritos',
        onClick: (event: MouseEvent) => {
          event.stopPropagation();
          toggleFavorite(row);
        },
      }),
    enableSorting: true,
    sortingFn: (rowA: any, rowB: any, columnId: string) => {
      const a = rowA.getValue(columnId) === true;
      const b = rowB.getValue(columnId) === true;
      if (a === b) return 0;
      return a ? -1 : 1;
    },
    filterFn: (row: any, columnId: string, filterValue: boolean) => {
      if (!filterValue) return true;
      return row.getValue(columnId) === true;
    },
  },
  { accessorKey: 'code', meta: { label: 'Código' }, header: ({ column }) => getHeader(column, 'Código') },
  { accessorKey: 'name', meta: { label: 'Contato' }, header: ({ column }) => getHeader(column, 'Contato') },
  { accessorKey: 'company', meta: { label: 'Empresa' }, header: ({ column }) => getHeader(column, 'Empresa') },
  { accessorKey: 'segment', meta: { label: 'Segmento' }, header: ({ column }) => getHeader(column, 'Segmento') },
  { accessorKey: 'city', meta: { label: 'Cidade' }, header: ({ column }) => getHeader(column, 'Cidade') },
  { accessorKey: 'lastContact', meta: { label: 'Último Contato' }, header: ({ column }) => getHeader(column, 'Último Contato') },
  {
    accessorKey: 'status',
    meta: { label: 'Status' },
    header: ({ column }) => getHeader(column, 'Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const UBadge = resolveComponent('UBadge');
      const colorMap: Record<string, string> = {
        Ativo: 'success',
        'Em onboarding': 'warning',
        Inativo: 'neutral',
      };

      return h(UBadge, {
        label: status,
        color: colorMap[status] ?? 'neutral',
        variant: 'soft',
      });
    },
  },
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
      label: 'Visualizar Detalhes',
      icon: 'i-lucide-eye',
      onSelect() {
        openModal('novo-cliente', { item: row.original.raw });
      },
    },
    {
      label: 'Editar Cliente',
      icon: 'i-lucide-pencil',
      onSelect() {
        openModal('novo-cliente', { item: row.original.raw });
      },
    },
    { type: 'separator' },
    {
      label: 'Excluir Cliente',
      color: 'error',
      icon: 'i-lucide-trash',
      onSelect() {
        selectedClient.value = row.original.raw;
        isDeleteOpen.value = true;
      },
    },
  ];
}

const applyFavoriteFilter = () => {
  if (!tableRef.value?.tableApi) return;
  const column = tableRef.value.tableApi.getColumn('favorite');
  if (!column) return;
  column.setFilterValue(favoritesOnly.value ? true : undefined);
};

const toggleFavoritesOnly = () => {
  favoritesOnly.value = !favoritesOnly.value;
  applyFavoriteFilter();
};

const handleCreate = () => {
  openModal('novo-cliente');
};

const handleContextMenu = (_event: Event, _row: TableRow<any>) => {};

const handleTableMounted = ({ table }: { table: any }) => {
  tableRef.value = table?.value;
  applyFavoriteFilter();
};

const onConfirmDelete = () => {
  if (!selectedClient.value) return;
  remove(selectedClient.value.id);
  isDeleteOpen.value = false;

  showToast({
    title: 'Cliente removido',
    message: `O cliente ${selectedClient.value.name} foi excluído da lista mockada.`,
    type: 'success',
  });
};

onMounted(() => {
  const stored = localStorage.getItem(favoritesStorageKey);
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      favorites.value = parsed.map((item) => String(item));
    }
  } catch {
    favorites.value = [];
  }
});
</script>
