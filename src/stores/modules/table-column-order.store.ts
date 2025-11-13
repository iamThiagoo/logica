import { defineStore } from 'pinia';

type ColumnOrderState = Record<string, string[]>;

export const useTableColumnOrderStore = defineStore('table-column-order', {
  persist: true,
  state: () => ({
    orders: {} as ColumnOrderState,
  }),
  actions: {
    getOrder(tableKey: string): string[] | null {
      if (!tableKey) return null;
      const order = this.orders[tableKey];
      return Array.isArray(order) ? [...order] : null;
    },
    setOrder(tableKey: string, order: string[]): void {
      if (!tableKey) return;
      const sanitized = Array.isArray(order) ? [...new Set(order.filter((key) => typeof key === 'string' && key))] : [];

      this.orders = {
        ...this.orders,
        [tableKey]: sanitized,
      };
    },
    applyOrder<T extends { key: string }>(tableKey: string, cols: T[]): T[] {
      if (!Array.isArray(cols) || cols.length === 0) return [];

      const savedOrder = this.getOrder(tableKey);
      if (!savedOrder || savedOrder.length === 0) return [...cols];

      const byKey = new Map(cols.map((col) => [col.key, col]));
      const savedSet = new Set(savedOrder);

      const orderedFromSaved = savedOrder.map((key) => byKey.get(key)).filter((col): col is T => Boolean(col));

      const appendedNewColumns = cols.filter((col) => !savedSet.has(col.key));

      return [...orderedFromSaved, ...appendedNewColumns];
    },
  },
});
