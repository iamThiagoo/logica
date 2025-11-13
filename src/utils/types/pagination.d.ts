/**
 * Types
 */
export type TFieldSearch = {
  field: string;
  value: string;
};

/**
 * Interfaces
 */
export interface IPagination {
  pageTake: number;
  pageSize: number;
  search: string;
  sortBy: string;
  sortDir: 'ASC' | 'DESC';
  filters: TFieldSearch[];
}
