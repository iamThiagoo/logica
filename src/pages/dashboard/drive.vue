<template>
  <BaseDataTablePage
    title="Drive Compartilhado"
    description="Gerencie arquivos compartilhados internamente ou com contatos externos usando dados mockados."
    :items="tableData"
    :columns="columns"
    :breadcrumb-items="breadcrumbItems"
    search-input-class="w-[18rem]"
    :show-context-menu="true"
    :show-export-button="false"
    :context-menu-items-fn="getRowItems"
    :pinned-columns="{ right: ['actions'] }"
    create-button-label="Novo"
    :on-mounted="handleTableMounted"
    @create="handleCreate"
    @contextmenu="handleContextMenu"
  />

  <UModal v-model:open="isDeleteOpen" title="Excluir Arquivo" :ui="{ footer: 'justify-end' }">
    <template #body>
      <p class="text-gray-700 dark:text-gray-300">
        Tem certeza que deseja remover o arquivo
        <span class="font-semibold">{{ selectedFile?.name }}</span
        >?
      </p>
      <br />
      <p>O registro será removido apenas da coleção mockada do template.</p>
    </template>
    <template #footer>
      <UButton size="lg" color="neutral" variant="outline" icon="i-lucide-x" label="Fechar" @click="isDeleteOpen = false" />
      <UButton color="error" size="lg" variant="solid" label="Excluir" icon="i-lucide-trash-2" class="text-white" @click="onConfirmDelete" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, TableColumn, TableRow } from '@nuxt/ui';
import { useDriveCrud } from '@/composables/use-admin-template-data';
import { useModalStore } from '@/composables/use-modal';
import { useTableHeader } from '@/composables/use-table-header';
import BaseDataTablePage from '@/components/shared/base/BaseDataTablePage.vue';
import { showToast } from '@/utils/helpers/app/toast';
import { pagesIconsMap } from '@/utils/types/map/icons-map';
import type { DriveFileRecord } from '@/utils/types/admin';

const { items: driveFiles, remove } = useDriveCrud();
const { openModal } = useModalStore();
const isDeleteOpen = ref(false);
const selectedFile = ref<DriveFileRecord | null>(null);
const tableRef = ref<any>(null);
const searchingMap = ref<Record<string, boolean>>({});
const columnFiltersMap = ref<Record<string, string>>({});

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const UInput = resolveComponent('UInput');

const breadcrumbItems = [
  { label: 'Meu Dashboard', icon: pagesIconsMap.home_root, to: '/' },
  { label: 'Drive Compartilhado', icon: pagesIconsMap.drive_root },
];

const tableData = computed(() =>
  driveFiles.value.map((file) => ({
    uploadedBy: file.uploadedBy,
    file: `${file.name}.${file.extension}`,
    size: file.size,
    uploadedAt: file.uploadedAt.split('-').reverse().join('/'),
    expires: `${file.expiresInDays} dia(s)`,
    status: file.status,
    raw: file,
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
  { accessorKey: 'uploadedBy', meta: { label: 'Responsável' }, header: ({ column }) => getHeader(column, 'Responsável') },
  { accessorKey: 'file', meta: { label: 'Arquivo' }, header: ({ column }) => getHeader(column, 'Arquivo') },
  { accessorKey: 'size', meta: { label: 'Tamanho' }, header: ({ column }) => getHeader(column, 'Tamanho') },
  { accessorKey: 'uploadedAt', meta: { label: 'Data de Upload' }, header: ({ column }) => getHeader(column, 'Data de Upload') },
  { accessorKey: 'expires', meta: { label: 'Validade' }, header: ({ column }) => getHeader(column, 'Validade') },
  {
    accessorKey: 'status',
    meta: { label: 'Status' },
    header: ({ column }) => getHeader(column, 'Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const UBadge = resolveComponent('UBadge');
      const colorMap: Record<string, string> = {
        Disponível: 'success',
        'Expira hoje': 'warning',
        Arquivado: 'neutral',
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
        openModal('novo-drive', { item: row.original.raw });
      },
    },
    {
      label: 'Editar Arquivo',
      icon: 'i-lucide-pencil',
      onSelect() {
        openModal('novo-drive', { item: row.original.raw });
      },
    },
    {
      label: 'Copiar Link',
      icon: 'i-lucide-link-2',
      onSelect() {
        showToast({
          title: 'Link mockado copiado',
          message: `Um link fictício para ${row.original.raw.name} foi preparado para compartilhamento.`,
          type: 'info',
        });
      },
    },
    { type: 'separator' },
    {
      label: 'Excluir Arquivo',
      color: 'error',
      icon: 'i-lucide-trash',
      onSelect() {
        selectedFile.value = row.original.raw;
        isDeleteOpen.value = true;
      },
    },
  ];
}

const handleCreate = () => {
  openModal('novo-drive');
};

const handleContextMenu = (_event: Event, _row: TableRow<any>) => {};

const handleTableMounted = ({ table }: { table: any }) => {
  tableRef.value = table?.value;
};

const onConfirmDelete = () => {
  if (!selectedFile.value) return;
  remove(selectedFile.value.id);
  isDeleteOpen.value = false;

  showToast({
    title: 'Arquivo removido',
    message: `O arquivo ${selectedFile.value.name} foi removido do drive mockado.`,
    type: 'success',
  });
};
</script>
