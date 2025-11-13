export type KeyboardShortcutCategory = 'navigation' | 'table' | 'form' | 'system';

export type KeyboardShortcutId = 'nav-dashboard' | 'nav-settings' | 'nav-meetings' | 'table-search' | 'table-create' | 'table-focus-filters' | 'table-focus-favorites' | 'table-edit' | 'table-delete' | 'form-save' | 'system-cheatsheet' | 'system-feedback' | 'system-logout';

export type KeyboardShortcutResolvableId = KeyboardShortcutId | (string & {});

export interface KeyboardShortcutCatalogItem {
  id: KeyboardShortcutResolvableId;
  category: KeyboardShortcutCategory;
  label: string;
  description: string;
  defaultKeys: string[];
  customizable?: boolean;
}

export interface KeyboardShortcutCatalogGroup {
  category: KeyboardShortcutCategory;
  title: string;
  description: string;
  shortcuts: KeyboardShortcutCatalogItem[];
}

export interface KeyboardShortcutContext {
  event: KeyboardEvent;
}

export interface KeyboardShortcutDefinition {
  id: KeyboardShortcutResolvableId;
  keys?: string[];
  handler: (context: KeyboardShortcutContext) => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  allowInEditable?: boolean;
  allowWhenModalOpen?: boolean;
  when?: () => boolean;
  useCatalogKeys?: boolean;
}

export interface KeyboardShortcutRegistration {
  shortcuts: KeyboardShortcutDefinition[];
  isActive?: () => boolean;
}

export interface TableShortcutActionItem {
  label?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface UseTableKeyboardShortcutOptions {
  canCreate: () => boolean;
  canSearch: () => boolean;
  canFilter?: () => boolean;
  canFocusFavorites?: () => boolean;
  hasSelectedRow: () => boolean;
  getEditAction: () => TableShortcutActionItem | null;
  getDeleteAction: () => TableShortcutActionItem | null;
  focusSearch: () => void;
  focusFilters?: () => void;
  focusFavorites?: () => void;
  triggerCreate: () => void;
  isActive?: () => boolean;
}

export interface KeyboardShortcutConflict {
  id: KeyboardShortcutResolvableId;
  label: string;
}

export interface KeyboardShortcutValidationResult {
  valid: boolean;
  reason: 'reserved' | 'conflict' | null;
  conflictWith: KeyboardShortcutConflict | null;
}
