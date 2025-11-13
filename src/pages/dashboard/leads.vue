<template>
  <BaseDataTablePage
    title="Leads"
    description="Priorize abordagens e mantenha o funil comercial sempre atualizado."
    :breadcrumb-items="breadcrumbItems"
    :items="tableData"
    :columns="columns"
    search-placeholder="Pesquisar leads..."
    search-input-class="w-[16rem]"
    :status-filter-options="stageFilterOptions"
    :show-context-menu="true"
    :context-menu-items-fn="getRowItems"
    :pinned-columns="{ right: ['actions'] }"
    :show-export-button="false"
    create-button-label="Novo Lead"
    :on-mounted="handleTableMounted"
    @create="handleCreate"
    @contextmenu="handleContextMenu"
  />

  <UModal v-model:open="isDeleteOpen" title="Excluir Lead" :ui="{ footer: 'justify-end' }">
    <template #body>
      <p class="text-gray-700 dark:text-gray-300">
        Tem certeza que deseja excluir o lead
        <span class="font-semibold">{{ selectedLead?.name }}</span
        >?
      </p>
      <br />
      <p>Esta ação remove apenas o dado mockado utilizado pelo template.</p>
    </template>
    <template #footer>
      <UButton size="lg" color="neutral" variant="outline" icon="i-lucide-x" label="Fechar" @click="isDeleteOpen = false" />
      <UButton color="error" size="lg" variant="solid" label="Excluir" icon="i-lucide-trash-2" class="text-white" @click="onConfirmDelete" />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, TableColumn, TableRow } from '@nuxt/ui';
import { useLeadsCrud } from '@/composables/use-admin-template-data';
import { useModalStore } from '@/composables/use-modal';
import { useTableHeader } from '@/composables/use-table-header';
import BaseDataTablePage from '@/components/shared/base/BaseDataTablePage.vue';
import { showToast } from '@/utils/helpers/app/toast';
import { pagesIconsMap } from '@/utils/types/map/icons-map';
import type { LeadRecord } from '@/utils/types/admin';

const { items: leads, remove } = useLeadsCrud();
const { openModal } = useModalStore();
const isDeleteOpen = ref(false);
const selectedLead = ref<LeadRecord | null>(null);
const tableRef = ref<any>(null);
const searchingMap = ref<Record<string, boolean>>({});
const columnFiltersMap = ref<Record<string, string>>({});

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const UInput = resolveComponent('UInput');

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const breadcrumbItems = [
  { label: 'Meu Dashboard', icon: pagesIconsMap.home_root, to: '/' },
  { label: 'Leads', icon: pagesIconsMap.leads_root },
];

const stageFilterOptions = [
  { value: 'Novo', label: 'Novos' },
  { value: 'Qualificado', label: 'Qualificados' },
  { value: 'Proposta', label: 'Em proposta' },
  { value: 'Convertido', label: 'Convertidos' },
];

const tableData = computed(() =>
  leads.value.map((lead) => ({
    name: lead.name,
    company: lead.company,
    source: lead.source,
    owner: lead.owner,
    stage: lead.stage,
    score: `${lead.score}`,
    expectedValue: currency.format(lead.expectedValue),
    lastInteraction: lead.lastInteraction.split('-').reverse().join('/'),
    raw: lead,
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
  { accessorKey: 'name', meta: { label: 'Lead' }, header: ({ column }) => getHeader(column, 'Lead') },
  { accessorKey: 'company', meta: { label: 'Empresa' }, header: ({ column }) => getHeader(column, 'Empresa') },
  { accessorKey: 'source', meta: { label: 'Origem' }, header: ({ column }) => getHeader(column, 'Origem') },
  { accessorKey: 'owner', meta: { label: 'Responsável' }, header: ({ column }) => getHeader(column, 'Responsável') },
  {
    accessorKey: 'stage',
    meta: { label: 'Etapa' },
    header: ({ column }) => getHeader(column, 'Etapa'),
    cell: ({ row }) => {
      const stage = row.getValue('stage') as string;
      const UBadge = resolveComponent('UBadge');
      const colorMap: Record<string, string> = {
        Novo: 'neutral',
        Qualificado: 'info',
        Proposta: 'warning',
        Convertido: 'success',
      };

      return h(UBadge, {
        label: stage,
        color: colorMap[stage] ?? 'neutral',
        variant: 'soft',
      });
    },
  },
  {
    accessorKey: 'score',
    meta: { label: 'Score' },
    header: ({ column }) => getHeader(column, 'Score'),
    cell: ({ row }) => h('div', { class: 'font-medium text-primary' }, `${row.getValue('score')} / 100`),
  },
  { accessorKey: 'expectedValue', meta: { label: 'Valor Esperado' }, header: ({ column }) => getHeader(column, 'Valor Esperado') },
  { accessorKey: 'lastInteraction', meta: { label: 'Última Interação' }, header: ({ column }) => getHeader(column, 'Última Interação') },
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
        openModal('novo-lead', { item: row.original.raw });
      },
    },
    {
      label: 'Editar Lead',
      icon: 'i-lucide-pencil',
      onSelect() {
        openModal('novo-lead', { item: row.original.raw });
      },
    },
    { type: 'separator' },
    {
      label: 'Excluir Lead',
      color: 'error',
      icon: 'i-lucide-trash',
      onSelect() {
        selectedLead.value = row.original.raw;
        isDeleteOpen.value = true;
      },
    },
  ];
}

const handleCreate = () => {
  openModal('novo-lead');
};

const handleContextMenu = (_event: Event, _row: TableRow<any>) => {};

const handleTableMounted = ({ table }: { table: any }) => {
  tableRef.value = table?.value;
};

const onConfirmDelete = () => {
  if (!selectedLead.value) return;
  remove(selectedLead.value.id);
  isDeleteOpen.value = false;

  showToast({
    title: 'Lead removido',
    message: `O lead ${selectedLead.value.name} foi excluído da base mockada.`,
    type: 'success',
  });
};
</script>
