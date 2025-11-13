<template>
  <UDashboardPanel class="flex flex-col max-w-8xl">
    <template #body>
      <Transition name="fade-left">
        <div v-if="showContent" class="flex flex-col">
          <UPageHeader
            :title="title"
            :description="shouldShowDescription ? description : undefined"
            class="mb-1"
            :ui="{
              links: shouldShowDescription ? 'flex flex-wrap absolute right-0 top-2 mb-4 2xl:relative 2xl:justify-end 2xl:items-center 2xl:mb-0 sm:gap-3 2xl:mt-0.5 overflow-visible' : 'flex flex-wrap absolute right-0 mb-4 2xl:relative 2xl:justify-end 2xl:items-center 2xl:mb-0 sm:gap-3 2xl:mt-0.5 overflow-visible',
            }"
          >
            <template #title>
              <div class="flex items-center gap-2">
                <span>{{ title }}</span>

                <UTooltip :text="pinButtonLabel">
                  <UButton size="xs" :icon="pinButtonIcon" :title="pinButtonLabel" :aria-label="pinButtonLabel" :aria-pressed="isCurrentPagePinned" :color="isCurrentPagePinned ? 'success' : 'neutral'" :variant="isCurrentPagePinned ? 'soft' : 'outline'" class="cursor-pointer transition-colors" @click="toggleCurrentPagePin" @keydown.enter.prevent="toggleCurrentPagePin" @keydown.space.prevent="toggleCurrentPagePin" />
                </UTooltip>
              </div>
            </template>

            <template #links>
              <div class="flex flex-wrap justify-end items-center gap-2 sm:gap-3 w-full md:w-auto">
                <UButton v-if="selectedRows.length > 0 && showBulkActions" size="lg" color="primary" icon="i-lucide-circle-check-big" class="whitespace-nowrap bg-primary-600 text-gray-100" @click="$emit('bulkAction', 'approve', selectedRows)"> Aprovar {{ selectedRows.length }} pedido(s) </UButton>

                <USelectMenu
                  v-if="statusFilterOptions"
                  v-model="selectedStatuses"
                  clear
                  size="lg"
                  :items="statusFilterOptions"
                  icon="i-lucide-filter"
                  class="w-full sm:w-44 md:w-36"
                  multiple
                  arrow
                  :ui="{
                    trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
                    content: 'min-w-fit',
                  }"
                  placeholder="Status"
                  data-table-filter-trigger
                />

                <UInput v-model="searchQuery" size="lg" icon="i-lucide-search" type="search" :placeholder="searchPlaceholder" :class="searchInputClass" />
              </div>
            </template>
          </UPageHeader>

          <div ref="tableContainer" class="flex-1 overflow-auto">
            <slot name="table-wrapper" :table="table" :items="items">
              <UContextMenu
                v-if="showContextMenu"
                :items="contextMenuItems"
                @update:open="
                  (v) => {
                    if (!v) table?.tableApi?.resetRowSelection();
                  }
                "
              >
                <UTable
                  ref="table"
                  v-model:column-filters="columnFilters"
                  v-model:column-visibility="columnVisibility"
                  v-model:pagination="pagination"
                  v-model:column-pinning="columnPinning"
                  v-model:sorting="sorting"
                  v-model:row-selection="rowSelection"
                  :row-class="rowClassFn"
                  :pagination-options="{
                    getPaginationRowModel: getPaginationRowModel(),
                  }"
                  class="shrink-0 flex-1"
                  :data="tableData"
                  :columns="columns"
                  :ui="{
                    base: 'table-fixed border-separate border-spacing-0',
                    thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                    tbody: '[&>tr]:last:[&>td]:border-b-0',
                    th: 'py-1 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                    td: 'border-b border-default py-1',
                  }"
                  @contextmenu="onContextmenu"
                  @select="onSelect"
                >
                  <template v-if="showExpandableRows" #expanded="{ row }">
                    <slot name="expanded-row" :row="row">
                      <div class="px-5 pt-2 pb-5">
                        <UTable :data="row.original.itens || []" :columns="expandedColumns" class="w-fit" />
                      </div>
                    </slot>
                  </template>
                </UTable>
              </UContextMenu>

              <UTable
                v-else
                ref="table"
                v-model:column-filters="columnFilters"
                v-model:column-visibility="columnVisibility"
                v-model:pagination="pagination"
                v-model:column-pinning="columnPinning"
                v-model:sorting="sorting"
                v-model:row-selection="rowSelection"
                :row-class="rowClassFn"
                :pagination-options="{
                  getPaginationRowModel: getPaginationRowModel(),
                }"
                class="shrink-0 flex-1"
                :data="tableData"
                :columns="columns"
                :ui="{
                  base: 'table-fixed border-separate border-spacing-0',
                  thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                  tbody: '[&>tr]:last:[&>td]:border-b-0',
                  th: 'py-1 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                  td: 'border-b border-default py-1',
                }"
                @select="onSelect"
              >
                <template v-if="showExpandableRows" #expanded="{ row }">
                  <slot name="expanded-row" :row="row">
                    <div class="px-5 pt-2 pb-5">
                      <UTable :data="row.original.itens || []" :columns="expandedColumns" class="w-fit" />
                    </div>
                  </slot>
                </template>
              </UTable>
            </slot>
          </div>
        </div>
      </Transition>
    </template>

    <template #footer>
      <Transition name="fade-left">
        <div v-if="showContent" class="flex items-center justify-between gap-3 border-t border-default p-5 px-2 mx-5">
          <div class="flex gap-3">
            <slot name="footer-legend">
              <div v-if="showStatusLegend" class="flex flex-wrap items-center gap-4 text-sm text-muted">
                <div v-for="(legend, key) in statusLegend" :key="key" class="flex items-center gap-1">
                  <div class="h-3 w-3 rounded-full border dark:border-gray-50" :class="rowColorMap[key]" />
                  <span>{{ legend }}</span>
                </div>
              </div>
            </slot>
          </div>

          <div class="flex items-center gap-5">
            <div class="text-sm text-muted flex items-center gap-2">
              <p class="flex items-center gap-x-[2px]">
                Por página:
                <UTooltip text="Paginação ajustada automaticamente conforme o tamanho da tela.">
                  <UIcon name="i-lucide-circle-question-mark" class="size-3 relative -top-1.5" />
                </UTooltip>
              </p>
              <USelect v-model="pagination.pageSize" :items="[5, 10, 20, 50, 100, 200]" />
            </div>
            <UPagination :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1" :items-per-page="table?.tableApi?.getState().pagination.pageSize" :total="table?.tableApi?.getFilteredRowModel().rows.length" @update:page="(p: number) => table?.tableApi?.setPageIndex(p - 1)" />
          </div>
        </div>
      </Transition>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { TableRow } from '@nuxt/ui';
import { getPaginationRowModel } from '@tanstack/table-core';
import { useShortcutsStore } from '@/stores/modules/shortcut.store';
import { useColumnVisibilityStorage } from '@/composables/use-column-visibility-storage';
import { useKeyboardShortcuts } from '@/composables/use-keyboard-shortcuts';

interface IBaseDataTableOrdersProps {
  title: string;
  description?: string;
  items: any[];
  columns: any[];
  expandedColumns?: any[];
  breadcrumbItems?: any[];
  searchPlaceholder?: string;
  searchInputClass?: string;
  showCreateButton?: boolean;
  createButtonLabel?: string;
  autoAdjustPageSize?: boolean;
  initialPageSize?: number;
  showContextMenu?: boolean;
  contextMenuItemsFn?: (row: any) => any[];
  rowColorKey?: string;
  rowColorMap?: Record<string, string>;
  pinnedColumns?: any;
  statusFilterOptions?: any[];
  showExpandableRows?: boolean;
  showBulkActions?: boolean;
  showStatusLegend?: boolean;
  statusLegend?: Record<string, string>;
  persistColumnVisibility?: boolean;
  columnVisibilityStorageKey?: string;
}

const props = withDefaults(defineProps<IBaseDataTableOrdersProps>(), {
  searchPlaceholder: 'Pesquisar...',
  searchInputClass: 'flex-1 min-w-[12rem] sm:min-w-[16rem] md:w-[21rem]',
  showCreateButton: false,
  createButtonLabel: 'Criar Novo',
  autoAdjustPageSize: true,
  initialPageSize: 12,
  showContextMenu: false,
  rowColorKey: 'status',
  showExpandableRows: false,
  showBulkActions: true,
  showStatusLegend: false,
  persistColumnVisibility: true,
});

const table = useTemplateRef('table');
const route = useRoute();
const shortcutsStore = useShortcutsStore();
const { registerShortcuts } = useKeyboardShortcuts();
const tableContainer = ref<HTMLElement | null>(null);
const showContent = ref(false);
const searchQuery = ref('');
const selectedStatuses = ref<string[]>([]);
const columnFilters = ref([]);
const columnVisibility = ref<Record<string, boolean>>({});
const sorting = ref([]);
const rowSelection = ref<Record<string, boolean>>({});
const columnPinning = ref(props.pinnedColumns || { right: ['actions'] });
const tableData = computed(() => props.items);
const contextMenuItems = ref<any[]>([]);
const defaultColumnVisibility = ref<Record<string, boolean>>({});
const resolvedColumnVisibilityStorageKey = computed(() => {
  if (!props.persistColumnVisibility) return undefined;
  if (props.columnVisibilityStorageKey) return props.columnVisibilityStorageKey;
  return `dataTableColumnVisibility:${route.path}:orders`;
});
const { getInitialVisibility, saveVisibility } = useColumnVisibilityStorage(resolvedColumnVisibilityStorageKey);

const pagination = ref({
  pageIndex: 0,
  pageSize: props.initialPageSize,
});

const shouldShowDescription = computed(() => {
  const descriptionMode = localStorage.getItem('nuxt-description-mode');
  return descriptionMode !== 'false';
});

const emit = defineEmits<{
  create: [];
  rowAction: [action: string, row: any];
  contextmenu: [event: Event, row: TableRow<any>];
  select: [event: Event, row: TableRow<any>];
  bulkAction: [action: string, rows: any[]];
}>();

const selectedRows = computed(() =>
  Object.entries(rowSelection.value)
    .filter(([_, isSelected]) => isSelected)
    .map(([rowId]) => props.items[Number(rowId)])
);

const currentPageShortcut = computed(() => shortcutsStore.createFromRoute(route, { title: props.title }));

const isCurrentPagePinned = computed(() => {
  const currentShortcut = currentPageShortcut.value;
  return !!currentShortcut && shortcutsStore.isPinned(currentShortcut.key);
});

const pinButtonLabel = computed(() => (isCurrentPagePinned.value ? 'Desfixar página na Home' : 'Fixar página na Home'));

const pinButtonIcon = computed(() => (isCurrentPagePinned.value ? 'mynaui:pin' : 'i-lucide-pin-off'));

const toggleCurrentPagePin = () => {
  shortcutsStore.toggleRoute(route, { title: props.title });
};

let unregisterTableShortcuts: (() => void) | null = null;

const rowClassFn = computed(() => {
  if (!props.rowColorMap || !props.rowColorKey) return undefined;
  return (row: any) => {
    const value = row.original[props.rowColorKey];
    return props.rowColorMap![value] || '';
  };
});

function onContextmenu(e: Event, row: TableRow<any>) {
  if (props.contextMenuItemsFn) contextMenuItems.value = props.contextMenuItemsFn(row);
  if (!row.getIsSelected()) row.toggleSelected(!row.getIsSelected());
  emit('contextmenu', e, row);
}

function onSelect(e: Event, row: TableRow<any>) {
  if (props.showExpandableRows) {
    row.toggleExpanded(!row.getIsExpanded());
  }
  emit('select', e, row);
}

const autoPageSize = () => {
  if (!props.autoAdjustPageSize || !tableContainer.value) return;
  const screenHeight = window.visualViewport?.height || window.innerHeight;
  const tableRect = tableContainer.value.getBoundingClientRect();
  const heightAvailable = screenHeight - tableRect.top - 120;
  const firstRow = tableContainer.value.querySelector('tbody tr');
  const rowHeight = firstRow?.getBoundingClientRect().height || 45;
  const visibleRows = Math.max(Math.floor(heightAvailable / rowHeight), 5);
  pagination.value.pageSize = visibleRows;
  table.value?.tableApi?.setPageSize(visibleRows);
};

const focusFiltersTrigger = () => {
  const panelRoot = tableContainer.value?.closest('.max-w-8xl') as HTMLElement | null;

  const candidates = panelRoot ? Array.from(panelRoot.querySelectorAll<HTMLElement>('[data-table-filter-trigger], [data-table-extra-filters] button, [data-table-extra-filters] [role="combobox"]')) : Array.from(document.querySelectorAll<HTMLElement>('[data-table-filter-trigger], [data-table-extra-filters] button, [data-table-extra-filters] [role="combobox"]'));

  const target = candidates.find((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

  if (!target) return false;

  target.focus();
  target.click();
  return true;
};

watch(
  () => pagination.value.pageSize,
  (newSize) => {
    if (!table?.value?.tableApi) return;
    table.value.tableApi.setPageSize(newSize);
  }
);

watch(
  () => columnVisibility.value,
  (newVisibility) => {
    if (table.value?.tableApi) {
      table.value.tableApi.setColumnVisibility(newVisibility);
    }

    if (Object.keys(defaultColumnVisibility.value).length > 0) {
      saveVisibility(newVisibility, defaultColumnVisibility.value);
    }
  },
  { deep: true }
);

onMounted(async () => {
  shortcutsStore.load();
  showContent.value = true;
  await nextTick();

  unregisterTableShortcuts = registerShortcuts([
    {
      id: 'table-focus-filters',
      allowWhenModalOpen: false,
      when: () => Boolean(props.statusFilterOptions?.length),
      handler: () => {
        focusFiltersTrigger();
      },
    },
  ]);

  if (props.columns) {
    const initialVisibility: Record<string, boolean> = {};
    props.columns.forEach((col: any) => {
      const colId = col.id || col.accessorKey;
      if (colId && colId !== 'actions') {
        initialVisibility[colId] = true;
      }
    });

    defaultColumnVisibility.value = initialVisibility;
    columnVisibility.value = getInitialVisibility(initialVisibility);
  }

  if (props.autoAdjustPageSize) {
    autoPageSize();
    if (tableContainer.value) {
      const resizeObserver = new ResizeObserver(() => autoPageSize());
      resizeObserver.observe(tableContainer.value);
    }
    window.visualViewport?.addEventListener('resize', autoPageSize);
  }
});

onBeforeUnmount(() => {
  if (props.autoAdjustPageSize) {
    window.visualViewport?.removeEventListener('resize', autoPageSize);
  }

  unregisterTableShortcuts?.();
  unregisterTableShortcuts = null;
});

defineExpose({
  table,
  pagination,
  searchQuery,
  selectedStatuses,
  selectedRows,
  rowSelection,
});
</script>
