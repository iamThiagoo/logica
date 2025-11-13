import type { TableRow, TableColumn } from '@nuxt/ui';
import type { Row } from '@tanstack/table-core';
import type { Component, ConcreteComponent } from 'vue';

export type ViewMode = 'table' | 'cards';

export interface CardConfig {
  title?: (item: any) => string;
  subtitle?: (item: any) => string;
  description?: (item: any) => string;
  badge?: (item: any) => { label: string; color?: string; variant?: string };
  footer?: (item: any) => string;
  avatar?: (item: any) => { src?: string; alt?: string; text?: string };
  icon?: (item: any) => string;
  slots?: {
    header?: Component | ConcreteComponent;
    body?: Component | ConcreteComponent;
    footer?: Component | ConcreteComponent;
  };
}

export interface IBaseDataTablePageProps {
  items: any[];
  columns: TableColumn<any>[];
  totalItems?: number;
  showColumnVisibility?: boolean;
  persistColumnVisibility?: boolean;
  columnVisibilityStorageKey?: string;

  title: string;
  description?: string;
  breadcrumbItems?: any[];

  statusFilterOptions?: any[];
  showSearchInput?: boolean;
  searchPlaceholder?: string;
  searchInputClass?: string;

  showCreateButton?: boolean;
  createButtonLabel?: string;
  showExportButton?: boolean;
  exportButtonLabel?: string;

  showColumnVisibility?: boolean;
  pinnedColumns?: {
    left?: string[];
    right?: string[];
  };

  showContextMenu?: boolean;
  contextMenuItemsFn?: (row: TableRow<any>) => any[];

  autoAdjustPageSize?: boolean;
  initialPageSize?: number;

  rowColorMap?: Record<string, string>;
  rowColorKey?: string;

  enableUrlSync?: boolean;

  // View mode toggle
  showViewModeToggle?: boolean;
  defaultViewMode?: ViewMode;
  persistViewMode?: boolean;
  viewModeStorageKey?: string;

  // Cards configuration
  cardConfig?: CardConfig;
  cardsPerRow?: number;
  cardClass?: string;

  onSelectRow?: (event: Event, row: TableRow<any>) => void;
  onExport?: () => void;
  onMounted?: (refs: { table: any; pagination: any; searchQuery: any; selectedStatuses: any; columnFilters: any; sorting: any }) => void;
  onCardClick?: (item: any) => void;
}

export interface UseTableHeaderOptions {
  searchingMap: Ref<Record<string, boolean>>;
  columnFiltersMap: Ref<Record<string, string>>;
  onFilterChange: (columnId: string) => void;
}

export interface TableHeaderComponents {
  UButton: Component | ConcreteComponent;
  UDropdownMenu: Component | ConcreteComponent;
  UInput: Component | ConcreteComponent;
}
