import { defineStore } from 'pinia';
import { KEYBOARD_SHORTCUT_DEFAULTS_BY_ID, getShortcutDefaultKeys, normalizeShortcutKeys } from '@/utils/constants/keyboard-shortcuts';

type ShortcutBindings = Record<string, string[]>;

export const useKeyboardShortcutsStore = defineStore('keyboardShortcuts', {
  persist: true,
  state: () => ({
    enabled: true,
    bindings: {} as ShortcutBindings,
  }),
  getters: {
    resolvedBindings: (state) => {
      const merged: ShortcutBindings = {};

      Object.entries(KEYBOARD_SHORTCUT_DEFAULTS_BY_ID).forEach(([id, keys]) => {
        const custom = state.bindings[id];
        merged[id] = custom?.length ? custom : keys;
      });

      return merged;
    },
    getBinding: (state) => (id: string) => {
      const custom = state.bindings[id];
      if (custom?.length) return custom;

      return getShortcutDefaultKeys(id) || null;
    },
  },
  actions: {
    setEnabled(value: boolean) {
      this.enabled = value;
    },
    toggleEnabled() {
      this.enabled = !this.enabled;
    },
    setBinding(id: string, keys: string[]) {
      const normalized = normalizeShortcutKeys(keys);
      if (!normalized.length) return;

      const defaultKeys = getShortcutDefaultKeys(id);
      const isDefaultBinding = defaultKeys && normalized.join(' ') === defaultKeys.join(' ');

      if (isDefaultBinding) {
        delete this.bindings[id];
        return;
      }

      this.bindings[id] = normalized;
    },
    resetBinding(id: string) {
      delete this.bindings[id];
    },
    resetAllBindings() {
      this.bindings = {};
    },
  },
});
