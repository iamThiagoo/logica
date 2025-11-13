import { getShortcutDefaultKeys, isReservedShortcut, keyboardEventToToken, KEYBOARD_SHORTCUT_CATALOG, KEYBOARD_SHORTCUT_SEQUENCE_TIMEOUT_MS, KEYBOARD_SHORTCUTS_BY_ID, normalizeShortcutKeys, serializeShortcutKeys } from '@/utils/constants/keyboard-shortcuts';
import { useModalStore } from '@/composables/use-modal';
import { useKeyboardShortcutsStore } from '@/stores/modules/keyboard-shortcuts.store';
import type { KeyboardShortcutCatalogItem, KeyboardShortcutConflict, KeyboardShortcutContext, KeyboardShortcutDefinition, KeyboardShortcutRegistration, KeyboardShortcutResolvableId, KeyboardShortcutValidationResult, TableShortcutActionItem, UseTableKeyboardShortcutOptions } from '@/utils/types/keyboard-shortcuts';

type ResolvedKeyboardShortcutDefinition = Omit<KeyboardShortcutDefinition, 'keys'> & {
  keys: string[];
};

function isEditableElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
}

function isVisible(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el);
  return style.visibility !== 'hidden' && style.display !== 'none';
}

function resolveDisabledFlag(item: TableShortcutActionItem | null): boolean {
  if (!item) return true;
  return Boolean(item.disabled);
}

const _useKeyboardShortcuts = () => {
  const keyboardShortcutsStore = useKeyboardShortcutsStore();
  const { modals } = useModalStore();

  const registrations = ref(new Map<symbol, KeyboardShortcutRegistration>());
  const sequenceBuffer = ref<string[]>([]);
  const sequenceResetTimer = ref<number | null>(null);
  const listenerAttached = ref(false);

  const enabled = computed(() => keyboardShortcutsStore.enabled);

  const resolveDefinitionKeys = (shortcut: KeyboardShortcutDefinition): string[] => {
    if (shortcut.useCatalogKeys === false && shortcut.keys?.length) {
      return normalizeShortcutKeys(shortcut.keys);
    }

    const byStore = keyboardShortcutsStore.getBinding(shortcut.id);
    if (byStore?.length) return byStore;

    if (shortcut.keys?.length) return normalizeShortcutKeys(shortcut.keys);

    const fallback = getShortcutDefaultKeys(shortcut.id);
    return fallback || [];
  };

  const resolveCatalogConflict = (id: KeyboardShortcutResolvableId, keys: string[]): KeyboardShortcutConflict | null => {
    // Conflito e validado contra o catalogo central para manter consistencia global.
    const serialized = serializeShortcutKeys(keys);

    const allShortcuts = KEYBOARD_SHORTCUT_CATALOG.flatMap((group) => group.shortcuts);

    for (const shortcut of allShortcuts) {
      if (shortcut.id === id) continue;

      const shortcutKeys = keyboardShortcutsStore.getBinding(shortcut.id);
      if (!shortcutKeys?.length) continue;

      if (serializeShortcutKeys(shortcutKeys) === serialized) {
        return { id: shortcut.id, label: shortcut.label };
      }
    }

    return null;
  };

  const validateShortcutKeys = (id: KeyboardShortcutResolvableId, keys: string[]): KeyboardShortcutValidationResult => {
    const normalized = normalizeShortcutKeys(keys);
    if (!normalized.length) {
      return {
        valid: false,
        reason: 'conflict',
        conflictWith: null,
      };
    }

    if (isReservedShortcut(normalized)) {
      return {
        valid: false,
        reason: 'reserved',
        conflictWith: null,
      };
    }

    const conflict = resolveCatalogConflict(id, normalized);
    if (conflict) {
      return {
        valid: false,
        reason: 'conflict',
        conflictWith: conflict,
      };
    }

    return {
      valid: true,
      reason: null,
      conflictWith: null,
    };
  };

  const isAnyModalOpen = () => {
    const openedInStore = Object.values(modals).some((modal) => modal?.open);
    if (openedInStore) return true;

    const dialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"], [aria-modal="true"]'));

    return dialogs.some((dialog) => {
      if (dialog.getAttribute('aria-hidden') === 'true') return false;
      return isVisible(dialog);
    });
  };

  const clearSequence = () => {
    sequenceBuffer.value = [];

    if (sequenceResetTimer.value !== null) {
      window.clearTimeout(sequenceResetTimer.value);
      sequenceResetTimer.value = null;
    }
  };

  const scheduleSequenceReset = () => {
    if (sequenceResetTimer.value !== null) {
      window.clearTimeout(sequenceResetTimer.value);
    }

    sequenceResetTimer.value = window.setTimeout(() => clearSequence(), KEYBOARD_SHORTCUT_SEQUENCE_TIMEOUT_MS);
  };

  const resolveShortcuts = (event: KeyboardEvent) => {
    // Ignore atalhos quando o foco está em campos editáveis, exceto se o atalho liberar explicitamente.
    const typing = isEditableElement(event.target) || isEditableElement(document.activeElement ?? null);
    const modalOpen = isAnyModalOpen();

    return Array.from(registrations.value.values())
      .filter((registration) => registration.isActive?.() ?? true)
      .flatMap((registration) =>
        registration.shortcuts.map((shortcut) => ({
          ...shortcut,
          keys: resolveDefinitionKeys(shortcut),
        }))
      )
      .filter((shortcut): shortcut is ResolvedKeyboardShortcutDefinition => {
        if (!shortcut.keys?.length) return false;
        if (!shortcut.allowInEditable && typing) return false;
        if (!shortcut.allowWhenModalOpen && modalOpen) return false;
        if (shortcut.when && !shortcut.when()) return false;
        return true;
      });
  };

  const triggerShortcut = (shortcut: KeyboardShortcutDefinition, event: KeyboardEvent) => {
    if (shortcut.preventDefault ?? true) {
      event.preventDefault();
    }

    if (shortcut.stopPropagation) {
      event.stopPropagation();
    }

    const context: KeyboardShortcutContext = { event };
    shortcut.handler(context);
  };

  const handleSequenceShortcuts = (key: string, event: KeyboardEvent, shortcuts: ResolvedKeyboardShortcutDefinition[]) => {
    // Suporta sequências estilo "g d" com janela curta para reset automático.
    const sequenceShortcuts = shortcuts.filter((shortcut) => shortcut.keys.length > 1);
    if (!sequenceShortcuts.length) return false;

    const tryTokens = [...sequenceBuffer.value, key];

    const partialMatches = sequenceShortcuts.filter((shortcut) =>
      shortcut.keys.every((shortcutKey, index) => {
        if (index >= tryTokens.length) return true;
        return shortcutKey === tryTokens[index];
      })
    );

    const exactMatches = partialMatches.filter((shortcut) => shortcut.keys.length === tryTokens.length);

    if (exactMatches.length > 0) {
      const matched = exactMatches[exactMatches.length - 1];
      clearSequence();
      triggerShortcut(matched, event);
      return true;
    }

    if (partialMatches.length > 0) {
      sequenceBuffer.value = tryTokens;
      scheduleSequenceReset();
      return true;
    }

    const firstTokenMatches = sequenceShortcuts.filter((shortcut) => shortcut.keys[0] === key);

    if (firstTokenMatches.length > 0) {
      sequenceBuffer.value = [key];
      scheduleSequenceReset();
      return true;
    }

    clearSequence();
    return false;
  };

  const handleSingleShortcuts = (key: string, event: KeyboardEvent, shortcuts: ResolvedKeyboardShortcutDefinition[]) => {
    const singleMatch = shortcuts.filter((shortcut) => shortcut.keys.length === 1).find((shortcut) => shortcut.keys[0] === key);

    if (!singleMatch) return false;

    triggerShortcut(singleMatch, event);
    return true;
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!enabled.value) return;
    if (event.repeat) return;

    const key = keyboardEventToToken(event);
    if (!key) return;

    const shortcuts = resolveShortcuts(event);

    const handledBySequence = handleSequenceShortcuts(key, event, shortcuts);
    if (handledBySequence) return;

    handleSingleShortcuts(key, event, shortcuts);
  };

  const ensureListener = () => {
    if (listenerAttached.value || typeof window === 'undefined') return;

    window.addEventListener('keydown', handleKeydown, { passive: false });
    listenerAttached.value = true;
  };

  const removeListener = () => {
    if (!listenerAttached.value || typeof window === 'undefined') return;

    window.removeEventListener('keydown', handleKeydown);
    listenerAttached.value = false;
  };

  const register = (registration: KeyboardShortcutRegistration) => {
    ensureListener();

    const id = Symbol('keyboard-shortcut-registration');
    registrations.value.set(id, registration);

    return () => {
      registrations.value.delete(id);
      if (registrations.value.size === 0) {
        clearSequence();
        removeListener();
      }
    };
  };

  const registerShortcuts = (shortcuts: KeyboardShortcutDefinition[], options?: { isActive?: () => boolean }) => {
    return register({ shortcuts, isActive: options?.isActive });
  };

  const buildTableActionShortcut = (id: 'table-edit' | 'table-delete', getAction: () => TableShortcutActionItem | null, options: UseTableKeyboardShortcutOptions): KeyboardShortcutDefinition => ({
    id,
    allowWhenModalOpen: false,
    when: () => {
      if (!(options.isActive?.() ?? true)) return false;
      if (!options.hasSelectedRow()) return false;

      const action = getAction();
      return !resolveDisabledFlag(action);
    },
    handler: () => {
      const action = getAction();
      if (!action || resolveDisabledFlag(action)) return;

      if (id === 'table-delete') {
        const confirmed = window.confirm('Tem certeza que deseja excluir o item selecionado?');

        if (!confirmed) return;
      }

      action.onSelect?.();
    },
  });

  const registerTableShortcuts = (options: UseTableKeyboardShortcutOptions) => {
    const shortcuts: KeyboardShortcutDefinition[] = [
      {
        id: 'table-search',
        allowWhenModalOpen: false,
        when: () => (options.isActive?.() ?? true) && options.canSearch(),
        handler: () => {
          options.focusSearch();
        },
      },
      {
        id: 'table-focus-filters',
        allowWhenModalOpen: false,
        when: () => (options.isActive?.() ?? true) && (options.canFilter?.() ?? false),
        handler: () => {
          options.focusFilters?.();
        },
      },
      {
        id: 'table-focus-favorites',
        allowWhenModalOpen: false,
        when: () => (options.isActive?.() ?? true) && (options.canFocusFavorites?.() ?? false),
        handler: () => {
          options.focusFavorites?.();
        },
      },
      {
        id: 'table-create',
        allowWhenModalOpen: false,
        when: () => (options.isActive?.() ?? true) && options.canCreate(),
        handler: () => {
          options.triggerCreate();
        },
      },
      buildTableActionShortcut('table-edit', options.getEditAction, options),
      buildTableActionShortcut('table-delete', options.getDeleteAction, options),
    ];

    return registerShortcuts(shortcuts, {
      isActive: () => options.isActive?.() ?? true,
    });
  };

  onUnmounted(() => {
    clearSequence();
  });

  const setShortcutKeys = (id: KeyboardShortcutResolvableId, keys: string[]): KeyboardShortcutValidationResult => {
    const validation = validateShortcutKeys(id, keys);
    if (!validation.valid) return validation;

    keyboardShortcutsStore.setBinding(id, normalizeShortcutKeys(keys));
    return validation;
  };

  const resetShortcutKeys = (id: KeyboardShortcutResolvableId) => {
    keyboardShortcutsStore.resetBinding(id);
  };

  const resetAllShortcutKeys = () => {
    keyboardShortcutsStore.resetAllBindings();
  };

  const getShortcutKeys = (id: KeyboardShortcutResolvableId, fallback?: string[]) => {
    const storeValue = keyboardShortcutsStore.getBinding(id);
    if (storeValue?.length) return storeValue;

    if (fallback?.length) return normalizeShortcutKeys(fallback);

    return getShortcutDefaultKeys(id) || [];
  };

  const getCatalogShortcutKeys = (shortcut: KeyboardShortcutCatalogItem) => getShortcutKeys(shortcut.id, shortcut.defaultKeys);

  return {
    enabled,
    registerShortcuts,
    registerTableShortcuts,
    setEnabled: keyboardShortcutsStore.setEnabled,
    toggleEnabled: keyboardShortcutsStore.toggleEnabled,
    validateShortcutKeys,
    setShortcutKeys,
    resetShortcutKeys,
    resetAllShortcutKeys,
    getShortcutKeys,
    getCatalogShortcutKeys,
    shortcutsById: KEYBOARD_SHORTCUTS_BY_ID,
    shortcutCatalog: KEYBOARD_SHORTCUT_CATALOG,
  };
};

export const useKeyboardShortcuts = createSharedComposable(_useKeyboardShortcuts);
