export type DataTableFilterType = 'contains' | 'equals' | 'select' | 'boolean';

export type DataTableFilterValue = string | boolean | null | undefined;

export interface DataTableFilterOption {
  label: string;
  value: string;
}

export interface DataTableFilterConfig {
  id: string;
  label: string;
  type: DataTableFilterType;
  field: string;
  placeholder?: string;
  defaultOperator?: 'contains' | 'equals';
  options?: DataTableFilterOption[];
}

export type DataTableFiltersState = Record<string, DataTableFilterValue>;

export const createInitialFiltersState = (filters: DataTableFilterConfig[]): DataTableFiltersState => {
  return filters.reduce<DataTableFiltersState>((acc, filter) => {
    acc[filter.id] = undefined;
    return acc;
  }, {});
};

export const applyDataTableFilters = <T extends Record<string, any>>(rows: T[], filters: DataTableFilterConfig[], state: DataTableFiltersState): T[] => {
  return rows.filter((row) => {
    return filters.every((filter) => {
      const value = state[filter.id];

      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        return true;
      }

      const rowValueRaw = row[filter.field];

      if (filter.type === 'boolean') {
        return Boolean(rowValueRaw) === Boolean(value);
      }

      const rowValue = String(rowValueRaw ?? '').toLowerCase();
      const normalizedValue = String(value).toLowerCase().trim();

      if (filter.type === 'contains') {
        return rowValue.includes(normalizedValue);
      }

      return rowValue === normalizedValue;
    });
  });
};
