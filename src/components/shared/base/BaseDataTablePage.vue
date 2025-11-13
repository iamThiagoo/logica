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
              body: 'overflow-x-auto',
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
              <div class="hidden 2xl:flex items-center gap-3">
                <slot name="actions" />

                <!-- <UButton
                  v-if="showViewModeToggle"
                  size="lg"
                  :icon="
                    viewMode === 'table'
                      ? 'i-lucide-layout-grid'
                      : 'i-lucide-table-properties'
                  "
                  color="neutral"
                  variant="outline"
                  class="cursor-pointer"
                  @click="toggleViewMode"
                >
                  <UTooltip>
                    <template #content>
                      {{
                        viewMode === 'table'
                          ? 'Visualizar em cards'
                          : 'Visualizar em tabela'
                      }}
                    </template>
                  </UTooltip>
                </UButton> -->

                <slot name="export-button">
                  <UPopover v-if="showExportButton" :popper="{ placement: 'bottom-end' }">
                    <UButton size="lg" icon="i-lucide-download" color="neutral" variant="outline" class="cursor-pointer">
                      <UTooltip>
                        <template #content>
                          {{ exportButtonLabel || 'Exportar' }}
                        </template>
                      </UTooltip>
                    </UButton>

                    <template #content>
                      <div class="flex flex-col p-4 gap-3">
                        <UButton
                          size="md"
                          color="neutral"
                          variant="outline"
                          icon="hugeicons:csv-01"
                          label="Exportar como CSV"
                          @click="
                            () => {
                              handleExport();
                            }
                          "
                        />
                        <UButton
                          size="md"
                          color="neutral"
                          variant="outline"
                          icon="vscode-icons:file-type-excel2"
                          label="Exportar como Excel"
                          @click="
                            () => {
                              handleExport();
                            }
                          "
                        />
                      </div>
                    </template>
                  </UPopover>
                </slot>

                <UDropdownMenu
                  v-if="showColumnVisibility && viewMode === 'table'"
                  :content="{ align: 'end' }"
                  :ui="{ content: 'w-fit' }"
                  :items="[
                    [
                      {
                        label: 'Visibilidade das Colunas',
                        type: 'label',
                      },
                    ],
                    columnVisibilityItems,
                    [
                      {
                        label: 'Restaurar Ordem',
                        icon: 'i-lucide-arrow-left-right',
                        onSelect: restoreDefaultColumnOrder,
                      },
                      {
                        label: 'Restaurar Padrão',
                        icon: 'i-lucide-rotate-ccw',
                        onSelect: restoreDefaultVisibility,
                      },
                    ],
                  ]"
                >
                  <UButton class="cursor-pointer" size="lg" label="Colunas" icon="i-lucide-columns-2" color="neutral" variant="outline" />
                </UDropdownMenu>

                <div data-table-extra-filters class="contents">
                  <slot name="extra-filters" />
                </div>

                <USelectMenu
                  v-if="statusFilterOptions && statusFilterOptions.length > 0"
                  v-model="selectedStatuses"
                  clear
                  arrow
                  :items="statusFilterOptions"
                  icon="i-lucide-filter"
                  class="w-auto"
                  color="neutral"
                  variant="outline"
                  size="lg"
                  multiple
                  :ui="{
                    trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
                    content: 'min-w-fit',
                  }"
                  placeholder="Filtros"
                  data-table-filter-trigger
                />

                <USeparator
                  v-if="showSearchInput || showExportButton"
                  orientation="vertical"
                  class="h-8"
                  :ui="{
                    border: 'dark:border-neutral-600',
                  }"
                />

                <UInput v-if="showSearchInput" v-model="searchQuery" size="lg" icon="i-lucide-search" type="search" :placeholder="searchPlaceholder" :class="[searchInputClass]" data-table-search-input>
                  <template #trailing>
                    <UKbd v-if="keyboardShortcutsEnabled" value="/" />
                  </template>
                </UInput>

                <slot name="create-button">
                  <UButton v-if="showCreateButton" size="lg" color="primary" icon="i-lucide-plus" class="w-auto btn-plus bg-primary-600 dark:text-gray-100 hover:text-white flex" :label="createButtonLabel" @click="$emit('create')">
                    <template #leading>
                      <lord-icon trigger="hover" target=".btn-plus" :colors="`primary:#fff`" src="/lord-icon/plus.json" class="h-5 w-5" />
                    </template>
                    <template #trailing>
                      <UKbd v-if="keyboardShortcutsEnabled" value="A" />
                    </template>
                  </UButton>
                </slot>
              </div>

              <UPopover class="flex 2xl:hidden" :popper="{ placement: 'bottom-end' }">
                <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="outline" label="Filtros & Ações" trailing-icon="i-lucide-chevron-down" />

                <template #content>
                  <div class="flex flex-col gap-3 p-4 w-72">
                    <USelectMenu
                      v-if="statusFilterOptions && statusFilterOptions.length > 0"
                      v-model="selectedStatuses"
                      clear
                      size="lg"
                      arrow
                      :items="statusFilterOptions"
                      icon="i-lucide-filter"
                      class="w-full"
                      multiple
                      :ui="{
                        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
                        content: 'min-w-fit',
                      }"
                      placeholder="Status"
                      data-table-filter-trigger
                    />

                    <div data-table-extra-filters class="contents">
                      <slot name="extra-filters" />
                    </div>

                    <UInput v-if="showSearchInput" v-model="searchQuery" size="lg" icon="i-lucide-search" type="search" :placeholder="searchPlaceholder" class="w-full" data-table-search-input>
                      <template #trailing>
                        <UKbd v-if="keyboardShortcutsEnabled" value="/" />
                      </template>
                    </UInput>

                    <slot name="create-button">
                      <UButton v-if="showCreateButton" size="lg" color="primary" icon="i-lucide-plus" class="w-auto btn-plus bg-primary-600 dark:text-gray-100 hover:text-white flex" :label="createButtonLabel" @click="$emit('create')">
                        <template #leading>
                          <lord-icon trigger="hover" target=".btn-plus" :colors="`primary:#fff`" src="/lord-icon/plus.json" class="h-5 w-5" />
                        </template>
                        <template #trailing>
                          <UKbd v-if="keyboardShortcutsEnabled" value="A" />
                        </template>
                      </UButton>
                    </slot>
                  </div>
                </template>
              </UPopover>
            </template>
          </UPageHeader>

          <div ref="tableContainer" class="flex-1 overflow-auto">
            <!-- Table View -->
            <slot v-if="viewMode === 'table'" name="table-wrapper" :table="table" :items="items">
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
                  v-model:column-order="columnOrder"
                  v-model:pagination="pagination"
                  v-model:sorting="sorting"
                  v-model:row-selection="rowSelection"
                  v-model:column-pinning="columnPinning"
                  :row-class="rowClassFn"
                  :pagination-options="{
                    getPaginationRowModel: getPaginationRowModel(),
                  }"
                  class="shrink-0 flex-1"
                  :data="tableData"
                  :columns="draggableColumns"
                  :meta="tableMeta"
                  :ui="{
                    base: 'table-fixed border-separate border-spacing-0',
                    thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                    tbody: '[&>tr]:last:[&>td]:border-b-0',
                    th: 'py-1 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                    td: 'border-b border-default py-1',
                    tr: 'cursor-pointer',
                  }"
                  @select="activeContextMenu"
                  @contextmenu="onContextmenu"
                />
              </UContextMenu>

              <UTable
                v-else
                ref="table"
                v-model:column-filters="columnFilters"
                v-model:column-visibility="columnVisibility"
                v-model:column-order="columnOrder"
                v-model:pagination="pagination"
                v-model:sorting="sorting"
                v-model:row-selection="rowSelection"
                v-model:column-pinning="columnPinning"
                :row-class="rowClassFn"
                :pagination-options="{
                  getPaginationRowModel: getPaginationRowModel(),
                }"
                class="shrink-0 flex-1"
                :data="tableData"
                :columns="draggableColumns"
                :meta="tableMeta"
                :ui="{
                  base: 'table-fixed border-separate border-spacing-0',
                  thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
                  tbody: '[&>tr]:last:[&>td]:border-b-0',
                  th: 'py-1 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
                  td: 'border-b border-default py-1',
                }"
                @select="handleSelect"
              />
            </slot>

            <!-- Cards View -->
            <div v-else class="px-0.5 py-2">
              <slot name="cards-wrapper" :items="paginatedItems">
                <div :class="['grid gap-4', `grid-cols-1 md:grid-cols-2 xl:grid-cols-${cardsPerRow}`]">
                  <UContextMenu v-for="(item, index) in paginatedItems" :key="index" :items="getCardContextMenuItems(item)">
                    <UCard :class="['cursor-pointer transition-all hover:shadow-lg', cardClass]" @click="handleCardClick(item)">
                      <template #header>
                        <slot name="card-header" :item="item">
                          <div class="flex items-start justify-between gap-3">
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                              <UAvatar v-if="cardConfig?.avatar?.(item)" :src="cardConfig.avatar(item).src" :alt="cardConfig.avatar(item).alt" :text="cardConfig.avatar(item).text" size="md" />
                              <UIcon v-else-if="cardConfig?.icon?.(item)" :name="cardConfig.icon(item)" class="size-10 text-primary" />
                              <div class="flex-1 min-w-0">
                                <h3 class="text-base font-semibold truncate">
                                  {{ cardConfig?.title?.(item) || 'Sem título' }}
                                </h3>
                                <p v-if="cardConfig?.subtitle?.(item)" class="text-sm text-muted truncate">
                                  {{ cardConfig.subtitle(item) }}
                                </p>
                              </div>
                            </div>
                            <UBadge v-if="cardConfig?.badge?.(item)" :label="cardConfig.badge(item).label" :color="cardConfig.badge(item).color || 'neutral'" :variant="cardConfig.badge(item).variant || 'soft'" />
                          </div>
                        </slot>
                      </template>

                      <slot name="card-body" :item="item">
                        <div class="text-sm text-muted">
                          {{ cardConfig?.description?.(item) || '' }}
                        </div>
                      </slot>

                      <template v-if="cardConfig?.footer || $slots['card-footer']" #footer>
                        <slot name="card-footer" :item="item">
                          <div class="text-xs text-muted flex items-center justify-between">
                            <span>{{ cardConfig?.footer?.(item) || '' }}</span>
                            <UButton
                              v-if="showContextMenu"
                              icon="i-lucide-ellipsis-vertical"
                              variant="ghost"
                              color="neutral"
                              size="xs"
                              @click.stop="
                                (e: MouseEvent) => {
                                  const mockRow = {
                                    original: item,
                                    getIsSelected: () => false,
                                    toggleSelected: () => {},
                                  } as any;
                                  onContextmenu(e, mockRow);
                                }
                              "
                            />
                          </div>
                        </slot>
                      </template>
                    </UCard>
                  </UContextMenu>
                </div>
              </slot>
            </div>
          </div>
        </div>
      </Transition>
    </template>

    <template #footer>
      <Transition name="fade-left">
        <div v-if="showContent" class="flex items-center justify-between gap-3 border-t border-default p-5 px-2 mx-5">
          <slot name="footer-left">
            <div class="text-sm text-muted">
              Exibindo
              {{ (table?.tableApi?.getState().pagination.pageIndex || 0) * (table?.tableApi?.getState().pagination.pageSize || 0) + 1 }}
              –
              {{ Math.min(((table?.tableApi?.getState().pagination.pageIndex || 0) + 1) * (table?.tableApi?.getState().pagination.pageSize || 0), table?.tableApi?.getFilteredRowModel().rows.length || 0) }}
              de
              {{ totalItems || table?.tableApi?.getFilteredRowModel().rows.length || 0 }}
              resultados
            </div>
          </slot>

          <div class="flex items-center gap-5">
            <div class="text-sm text-muted flex items-center gap-2">
              <p class="flex items-center gap-x-[2px]">
                Por página:
                <UTooltip text="Paginação ajustada automaticamente conforme o tamanho da tela.">
                  <UIcon name="i-lucide-circle-question-mark" class="size-3 relative -top-1.5" />
                </UTooltip>
              </p>
              <USelect v-model="pagination.pageSize" :items="[5, 10, 20, 50, 100, 200]" @change="handlePageSizeChange" />
            </div>

            <UPagination :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1" :items-per-page="table?.tableApi?.getState().pagination.pageSize" :total="totalItems || table?.tableApi?.getFilteredRowModel().rows.length || 0" @update:page="handlePageChange" />
          </div>
        </div>
      </Transition>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { TableRow } from '@nuxt/ui';
import { getPaginationRowModel } from '@tanstack/table-core';
import { pageSize } from '@/utils/helpers/app';
import { useBreadcrumb } from '../../../composables/use-breadcrumb';
import { IBaseDataTablePageProps } from '@/utils/types/data-table';
import { defineElement } from '@lordicon/element';
import { useShortcutsStore } from '@/stores/modules/shortcut.store';
import { useKeyboardShortcuts } from '@/composables/use-keyboard-shortcuts';
import { useColumnVisibilityStorage } from '@/composables/use-column-visibility-storage';
import type { TableShortcutActionItem } from '@/utils/types/keyboard-shortcuts';
import { useTableColumnOrderStore } from '@/stores/modules/table-column-order.store';
import { h } from 'vue';

defineElement();

const emit = defineEmits<{
  create: [];
  export: [];
  rowAction: [action: string, row: any];
  contextmenu: [event: Event, row: TableRow<any>];
  select: [event: Event, row: TableRow<any>];
  pageChange: [page: number];
  pageSizeChange: [size: number];
}>();

const props = withDefaults(defineProps<IBaseDataTablePageProps>(), {
  searchPlaceholder: 'Pesquisar...',
  searchInputClass: 'w-[25rem]',
  showCreateButton: true,
  createButtonLabel: 'Criar Novo',
  showExportButton: true,
  exportButtonLabel: 'Exportar',
  autoAdjustPageSize: true,
  initialPageSize: 12,
  showContextMenu: true,
  rowColorKey: 'status',
  showSearchInput: true,
  showColumnVisibility: true,
  enableUrlSync: false,
  showViewModeToggle: true,
  defaultViewMode: 'table',
  persistViewMode: true,
  viewModeStorageKey: 'dataTableViewMode',
  persistColumnVisibility: true,
  cardsPerRow: 3,
});

const UButton = resolveComponent('UButton');
const UDropdownMenu = resolveComponent('UDropdownMenu');
const UInput = resolveComponent('UInput');
const UTable = resolveComponent('UTable');
const UCard = resolveComponent('UCard');
const UBadge = resolveComponent('UBadge');
const UAvatar = resolveComponent('UAvatar');

const router = useRouter();
const route = useRoute();
const slots = useSlots();
const shortcutsStore = useShortcutsStore();
const tableColumnOrderStore = useTableColumnOrderStore();
const { registerTableShortcuts, enabled } = useKeyboardShortcuts();
const table = useTemplateRef('table');
const { setBreadcrumb } = useBreadcrumb();
const tableData = computed(() => props.items);
let resizeObserver: ResizeObserver | null = null;

const showContent = ref(false);
const searchQuery = ref('');
const selectedStatuses = ref<string[]>([]);
const columnFilters = ref([]);
const columnVisibility = ref<Record<string, boolean>>({});
const columnOrder = ref<string[]>([]);
const sorting = ref([]);
const rowSelection = ref<Record<string, boolean>>({});
const tableContainer = ref<HTMLElement | null>(null);
const columnPinning = ref(props.pinnedColumns || { right: ['actions'] });
const isAutoAdjusting = ref(false);
const userChangeSize = ref(false);
const contextMenuItems = ref<any[]>([]);
const pagination = ref({
  pageIndex: 0,
  pageSize: null as number | null,
});
const viewMode = ref<'table' | 'cards'>(props.defaultViewMode || 'table');
const keyboardShortcutsEnabled = computed(() => enabled.value);
const draggingColumnId = ref<string | null>(null);
const dragOverColumnId = ref<string | null>(null);

// Computed para verificar se deve mostrar a descrição
const shouldShowDescription = computed(() => {
  const descriptionMode = localStorage.getItem('nuxt-description-mode');
  return descriptionMode !== 'false';
});
const resolvedColumnVisibilityStorageKey = computed(() => {
  if (!props.persistColumnVisibility) return undefined;
  if (props.columnVisibilityStorageKey) return props.columnVisibilityStorageKey;
  return `dataTableColumnVisibility:${route.path}`;
});
const resolvedColumnOrderStorageKey = computed(() => `dataTableColumnOrder:${route.path}`);
const { getInitialVisibility, saveVisibility, clearVisibility } = useColumnVisibilityStorage(resolvedColumnVisibilityStorageKey);

const currentPageShortcut = computed(() => shortcutsStore.createFromRoute(route, { title: props.title }));

const isCurrentPagePinned = computed(() => {
  const currentShortcut = currentPageShortcut.value;
  return !!currentShortcut && shortcutsStore.isPinned(currentShortcut.key);
});

const pinButtonLabel = computed(() => (isCurrentPagePinned.value ? 'Desfixar página na Home' : 'Fixar página na Home'));

const pinButtonIcon = computed(() => (isCurrentPagePinned.value ? 'mynaui:pin' : 'i-lucide-pin-off'));
let unregisterTableShortcuts: (() => void) | null = null;

const toggleCurrentPagePin = () => {
  shortcutsStore.toggleRoute(route, { title: props.title });
};

const defaultColumnVisibility = ref<Record<string, boolean>>({});
const tableMeta = computed(() => {
  if (!props.rowColorMap || !props.rowColorKey) return undefined;

  return {
    class: {
      tr: (row: any) => {
        const value = row.original[props.rowColorKey];
        return props.rowColorMap![value] || '';
      },
    },
  };
});

const getColumnId = (col: any): string | null => {
  const id = col?.id || col?.accessorKey;
  return typeof id === 'string' && id.length > 0 ? id : null;
};

const getLeafColumnIds = (columns: any[] = []): string[] => {
  const ids: string[] = [];

  for (const col of columns) {
    if (Array.isArray(col?.columns) && col.columns.length > 0) {
      ids.push(...getLeafColumnIds(col.columns));
      continue;
    }

    const id = getColumnId(col);
    if (!id) continue;
    ids.push(id);
  }

  return ids;
};

const normalizeColumnOrder = (defaultIds: string[], preferredIds: string[] = []): string[] => {
  if (!defaultIds.length) return [];

  const defaultSet = new Set(defaultIds);
  const preferred = preferredIds.filter((id, index) => defaultSet.has(id) && preferredIds.indexOf(id) === index);
  const preferredSet = new Set(preferred);
  const missing = defaultIds.filter((id) => !preferredSet.has(id));
  return [...preferred, ...missing];
};

const reorderColumns = (ids: string[], sourceId: string, targetId: string): string[] => {
  const sourceIndex = ids.indexOf(sourceId);
  const targetIndex = ids.indexOf(targetId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return ids;
  }

  const next = [...ids];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
};

const handleColumnDragStart = (event: DragEvent, columnId: string) => {
  draggingColumnId.value = columnId;
  dragOverColumnId.value = null;

  if (!event.dataTransfer) return;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', columnId);
};

const handleColumnDragOver = (event: DragEvent, targetColumnId: string) => {
  if (!draggingColumnId.value || draggingColumnId.value === targetColumnId) {
    return;
  }

  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  dragOverColumnId.value = targetColumnId;
};

const handleColumnDrop = (event: DragEvent, targetColumnId: string) => {
  event.preventDefault();

  const sourceColumnId = draggingColumnId.value || event.dataTransfer?.getData('text/plain');

  if (!sourceColumnId || sourceColumnId === targetColumnId) {
    dragOverColumnId.value = null;
    return;
  }

  const baseOrder = columnOrder.value.length ? columnOrder.value : getLeafColumnIds(props.columns);

  columnOrder.value = reorderColumns(baseOrder, sourceColumnId, targetColumnId);
  dragOverColumnId.value = null;
};

const handleColumnDragEnd = () => {
  draggingColumnId.value = null;
  dragOverColumnId.value = null;
};

const draggableColumns = computed(() => {
  const wrapColumns = (columns: any[]): any[] => {
    return columns.map((col: any) => {
      const cloned = { ...col };

      if (Array.isArray(col.columns) && col.columns.length > 0) {
        cloned.columns = wrapColumns(col.columns);
        return cloned;
      }

      const columnId = getColumnId(col);
      const canDrag = Boolean(columnId && columnId !== 'actions');
      const originalHeader = col.header;

      cloned.header = (ctx: any) => {
        if (columnId === 'actions') {
          return h('span', { class: 'sr-only' }, 'Ações');
        }

        const content = typeof originalHeader === 'function' ? originalHeader(ctx) : (originalHeader ?? col.meta?.label ?? col.accessorKey ?? col.id ?? '');

        if (!canDrag || !columnId) return content;

        return h(
          'div',
          {
            class: ['flex items-center min-w-0 select-none cursor-grab', draggingColumnId.value === columnId ? 'opacity-50' : '', dragOverColumnId.value === columnId && draggingColumnId.value !== columnId ? 'rounded bg-primary/10 px-1 -mx-1' : ''],
            draggable: true,
            onDragstart: (event: DragEvent) => handleColumnDragStart(event, columnId),
            onDragover: (event: DragEvent) => handleColumnDragOver(event, columnId),
            onDrop: (event: DragEvent) => handleColumnDrop(event, columnId),
            onDragend: handleColumnDragEnd,
          },
          [content]
        );
      };

      return cloned;
    });
  };

  return wrapColumns(props.columns || []);
});

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'table' ? 'cards' : 'table';

  if (props.persistViewMode && props.viewModeStorageKey) {
    localStorage.setItem(props.viewModeStorageKey, viewMode.value);
  }
};

const paginatedItems = computed(() => {
  if (!props.items) return [];

  const start = pagination.value.pageIndex * (pagination.value.pageSize || 12);
  const end = start + (pagination.value.pageSize || 12);

  return props.items.slice(start, end);
});

const handleCardClick = (item: any) => {
  if (props.onCardClick) {
    props.onCardClick(item);
  }
};

const getCardContextMenuItems = (item: any) => {
  if (!props.contextMenuItemsFn) return [];
  const mockRow = {
    original: item,
    getIsSelected: () => false,
    toggleSelected: () => {},
  } as any;

  return props.contextMenuItemsFn(mockRow);
};

const columnVisibilityItems = computed(() => {
  if (!props.columns) return [];

  return props.columns
    .filter((col: any) => col.id !== 'actions')
    .map((col: any) => {
      const colId = col.id || col.accessorKey;
      return {
        label: col.meta?.label ?? col.header ?? col.accessorKey ?? col.id,
        type: 'checkbox' as const,
        checked: columnVisibility.value[colId] !== false,
        onUpdateChecked: (val: boolean) => {
          columnVisibility.value = {
            ...columnVisibility.value,
            [colId]: val,
          };
        },
        onSelect: (e: Event) => e.preventDefault(),
      };
    });
});

const restoreDefaultVisibility = () => {
  columnVisibility.value = { ...defaultColumnVisibility.value };
  clearVisibility();
};

const restoreDefaultColumnOrder = () => {
  const defaultOrder = getLeafColumnIds(props.columns || []);
  columnOrder.value = defaultOrder;
};

const rowClassFn = computed(() => {
  if (!props.rowColorMap || !props.rowColorKey) return undefined;
  return (row: any) => {
    const value = row.original[props.rowColorKey];
    return props.rowColorMap![value] || '';
  };
});

const activeContextMenu = (e: any, _row: TableRow<any>) => {
  if (e.button !== 0) return;
  e.preventDefault();

  const contextEvent = new MouseEvent('contextmenu', {
    bubbles: true,
    cancelable: true,
    view: window,
    button: 2,
    buttons: 2,
    clientX: e.clientX,
    clientY: e.clientY,
  });

  const target = e.currentTarget as HTMLElement;
  target?.dispatchEvent(contextEvent);
};

const focusSearchInput = () => {
  const searchInputs = Array.from(document.querySelectorAll<HTMLInputElement>('[data-table-search-input] input, input[data-table-search-input]'));

  const targetInput = searchInputs.find((input) => !input.disabled && input.tabIndex !== -1 && input.offsetParent !== null);

  if (!targetInput) return false;

  targetInput.focus();
  targetInput.select();
  return true;
};

const focusFiltersTrigger = () => {
  const panelRoot = tableContainer.value?.closest('.max-w-8xl') as HTMLElement | null;

  const selectors = ['[data-table-extra-filters] [data-table-filter-trigger]', '[data-table-extra-filters] button', '[data-table-extra-filters] [role="combobox"]', '[data-table-filter-trigger]'];

  for (const selector of selectors) {
    const candidates = panelRoot ? Array.from(panelRoot.querySelectorAll<HTMLElement>(selector)) : Array.from(document.querySelectorAll<HTMLElement>(selector));

    const target = candidates.find((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

    if (!target) continue;

    target.focus();
    target.click();
    return true;
  }

  return false;
};

const focusFavoritesTrigger = () => {
  const panelRoot = tableContainer.value?.closest('.max-w-8xl') as HTMLElement | null;

  const selectors = ['[data-table-extra-filters] [data-table-favorites-trigger]', '[data-table-extra-filters] button[title*="favorit" i]', '[data-table-extra-filters] button[aria-label*="favorit" i]', '[data-table-extra-filters] [role="button"][title*="favorit" i]', '[data-table-extra-filters] [role="button"][aria-label*="favorit" i]'];

  for (const selector of selectors) {
    const candidates = panelRoot ? Array.from(panelRoot.querySelectorAll<HTMLElement>(selector)) : Array.from(document.querySelectorAll<HTMLElement>(selector));

    const target = candidates.find((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

    if (!target) continue;

    target.focus();
    target.click();
    return true;
  }

  const iconCandidates = panelRoot ? Array.from(panelRoot.querySelectorAll<HTMLElement>('[data-table-extra-filters] [class*="lucide-star"], [data-table-extra-filters] [class*="i-lucide-star"]')) : Array.from(document.querySelectorAll<HTMLElement>('[data-table-extra-filters] [class*="lucide-star"], [data-table-extra-filters] [class*="i-lucide-star"]'));

  const iconTarget = iconCandidates.map((icon) => icon.closest<HTMLElement>('button, [role="button"]')).find((el): el is HTMLElement => Boolean(el) && !el.hasAttribute('disabled') && el.offsetParent !== null);

  if (iconTarget) {
    iconTarget.focus();
    iconTarget.click();
    return true;
  }

  const textButtonCandidates = panelRoot ? Array.from(panelRoot.querySelectorAll<HTMLElement>('[data-table-extra-filters] button, [data-table-extra-filters] [role="button"]')) : Array.from(document.querySelectorAll<HTMLElement>('[data-table-extra-filters] button, [data-table-extra-filters] [role="button"]'));

  const textTarget = textButtonCandidates.find((el) => {
    if (el.hasAttribute('disabled') || el.offsetParent === null) return false;
    return (el.textContent || '').toLowerCase().includes('favorit');
  });

  if (textTarget) {
    textTarget.focus();
    textTarget.click();
    return true;
  }

  return false;
};

const getSelectedRow = () => table.value?.tableApi?.getSelectedRowModel()?.rows?.[0] as TableRow<any> | undefined;

const findActionByPatterns = (row: TableRow<any> | undefined, patterns: RegExp[]): TableShortcutActionItem | null => {
  if (!row || !props.contextMenuItemsFn) return null;

  const items = props.contextMenuItemsFn(row) || [];
  return (
    items.find((item: any) => {
      const label = String(item?.label || '');
      if (!label) return false;
      return patterns.some((pattern) => pattern.test(label));
    }) || null
  );
};

const handleSelect = (e: Event, row: TableRow<any>) => {
  if (props.onSelectRow) {
    props.onSelectRow(e, row);
  }

  emit('select', e, row);
};

const handleExport = () => {
  if (props.onExport) {
    props.onExport();
  }

  emit('export');
};

const handlePageChange = (page: number) => {
  table.value?.tableApi?.setPageIndex(page - 1);
  if (props.enableUrlSync) {
    router.replace({
      query: {
        ...route.query,
        page: page,
      },
    });
  }

  emit('pageChange', page);
};

const handlePageSizeChange = () => {
  userChangeSize.value = true;
  emit('pageSizeChange', pagination.value.pageSize || 12);
};

const onContextmenu = (e: Event, row: TableRow<any>) => {
  if (props.contextMenuItemsFn) contextMenuItems.value = props.contextMenuItemsFn(row);

  if (!row.getIsSelected()) row.toggleSelected(!row.getIsSelected());
  emit('contextmenu', e, row);
};

const calculateRows = () => {
  if (!tableContainer.value) return props.initialPageSize;

  const screenHeight = window.visualViewport?.height || window.innerHeight;
  const tableRect = tableContainer.value.getBoundingClientRect();
  const heightAvailable = screenHeight - tableRect.top - 115;
  const firstRow = tableContainer.value.querySelector('tbody tr');
  const rowHeight = firstRow?.getBoundingClientRect().height || 45;

  return Math.max(Math.floor(heightAvailable / rowHeight), 5);
};

const autoPageSize = async () => {
  if (!props.autoAdjustPageSize || !tableContainer.value || !isAutoAdjusting.value || userChangeSize.value) return;

  const visibleRows = calculateRows();

  if (pagination.value.pageSize !== visibleRows) {
    pagination.value.pageSize = visibleRows;
    table.value?.tableApi?.setPageSize(visibleRows);
  }
};

watch(
  () => pagination.value.pageSize,
  (newSize) => {
    if (userChangeSize.value) {
      table.value?.tableApi?.setPageSize(newSize);
    }

    if (!table?.value?.tableApi || isAutoAdjusting.value) {
      return;
    }

    table.value.tableApi.setPageSize(newSize);
  }
);

watch(
  () => pagination.value.pageIndex,
  (newPage) => {
    if (props.enableUrlSync) {
      router.replace({
        query: {
          ...route.query,
          page: newPage + 1,
        },
      });
    }
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

watch(
  () => props.columns,
  (columns) => {
    const defaultIds = getLeafColumnIds(columns || []);
    if (!defaultIds.length) {
      columnOrder.value = [];
      return;
    }

    const savedOrder = tableColumnOrderStore.getOrder(resolvedColumnOrderStorageKey.value);
    const preferred = columnOrder.value.length ? columnOrder.value : (savedOrder ?? []);

    columnOrder.value = normalizeColumnOrder(defaultIds, preferred);
  },
  { deep: true, immediate: true }
);

watch(
  () => columnOrder.value,
  (newOrder) => {
    if (!newOrder.length) return;

    tableColumnOrderStore.setOrder(resolvedColumnOrderStorageKey.value, newOrder);
  },
  { deep: true }
);

onMounted(async () => {
  shortcutsStore.load();
  showContent.value = true;
  await nextTick();

  // Restaurar modo de visualização do localStorage
  if (props.persistViewMode && props.viewModeStorageKey) {
    const savedViewMode = localStorage.getItem(props.viewModeStorageKey);
    if (savedViewMode === 'table' || savedViewMode === 'cards') {
      viewMode.value = savedViewMode;
    }
  }

  if (props.columns) {
    const initialVisibility: Record<string, boolean> = {};
    props.columns.forEach((col: any) => {
      const colId = col.id || col.accessorKey;
      if (colId !== 'actions') {
        initialVisibility[colId] = true;
      }
    });
    defaultColumnVisibility.value = initialVisibility;
    columnVisibility.value = getInitialVisibility(initialVisibility);
  }

  if (props.enableUrlSync) {
    const pageFromUrl = Number(route.query.page);
    if (pageFromUrl && !isNaN(pageFromUrl)) {
      pagination.value.pageIndex = pageFromUrl - 1;
    }
  }

  if (pageSize() !== null && pageSize()! > 0) {
    pagination.value.pageSize = pageSize()!;
  }

  if ((pageSize() ?? 0) <= 0 && props.autoAdjustPageSize) {
    if (tableContainer.value) {
      resizeObserver = new ResizeObserver(autoPageSize);
      resizeObserver.observe(tableContainer.value);
    }

    window.visualViewport?.addEventListener('resize', autoPageSize);
    isAutoAdjusting.value = true;
    await autoPageSize();
  }

  if (props.onMounted) {
    props.onMounted({
      table,
      pagination,
      searchQuery,
      selectedStatuses,
      columnFilters,
      sorting,
    });
  }

  unregisterTableShortcuts = registerTableShortcuts({
    canCreate: () => Boolean(props.showCreateButton),
    canSearch: () => Boolean(props.showSearchInput),
    canFilter: () => Boolean(props.statusFilterOptions?.length) || Boolean(slots['extra-filters']),
    canFocusFavorites: () => Boolean(slots['extra-filters']),
    hasSelectedRow: () => Boolean(getSelectedRow()),
    getEditAction: () => findActionByPatterns(getSelectedRow(), [/\bedit\b/i, /\beditar\b/i]),
    getDeleteAction: () => findActionByPatterns(getSelectedRow(), [/\bdelete\b/i, /\bdel\b/i, /\bexcluir\b/i, /\bremover\b/i]),
    focusSearch: () => {
      focusSearchInput();
    },
    focusFilters: () => {
      focusFiltersTrigger();
    },
    focusFavorites: () => {
      focusFavoritesTrigger();
    },
    triggerCreate: () => {
      if (!props.showCreateButton) return;
      emit('create');
    },
  });

  setBreadcrumb(props.breadcrumbItems || []);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.visualViewport?.removeEventListener('resize', autoPageSize);
});

onUnmounted(() => {
  unregisterTableShortcuts?.();
  unregisterTableShortcuts = null;
});

defineExpose({
  table,
  pagination,
  searchQuery,
  selectedStatuses,
  columnVisibility,
  columnOrder,
  sorting,
  rowSelection,
});
</script>
