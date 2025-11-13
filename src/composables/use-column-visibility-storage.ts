import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';

type ColumnVisibility = Record<string, boolean>;

function parseHiddenColumns(rawValue: string | null): string[] | null {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return null;
  }
}

export function useColumnVisibilityStorage(storageKey: MaybeRefOrGetter<string | undefined>) {
  const resolveKey = () => {
    const key = toValue(storageKey);
    if (!key) return null;
    const trimmed = key.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  const getInitialVisibility = (defaultVisibility: ColumnVisibility): ColumnVisibility => {
    const key = resolveKey();
    if (!key || typeof window === 'undefined') {
      return { ...defaultVisibility };
    }

    const hiddenColumns = parseHiddenColumns(window.localStorage.getItem(key));
    if (!hiddenColumns) {
      return { ...defaultVisibility };
    }

    const hiddenColumnsSet = new Set(hiddenColumns);

    return Object.keys(defaultVisibility).reduce<ColumnVisibility>((acc, id) => {
      acc[id] = !hiddenColumnsSet.has(id);
      return acc;
    }, {});
  };

  const saveVisibility = (visibility: ColumnVisibility, defaultVisibility: ColumnVisibility) => {
    const key = resolveKey();
    if (!key || typeof window === 'undefined') return;

    const hiddenColumns = Object.keys(defaultVisibility).filter((id) => visibility[id] === false);

    if (hiddenColumns.length === 0) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(hiddenColumns));
  };

  const clearVisibility = () => {
    const key = resolveKey();
    if (!key || typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  };

  return {
    getInitialVisibility,
    saveVisibility,
    clearVisibility,
  };
}
