export type FilterType = 'select' | 'multi-select' | 'date-range' | 'checkbox' | 'range' | 'toggle';

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface DataTableState {
  search: string;
  page: number;
  limit: number;
  filters: Record<string, any>;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface DataTableResult<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface UseDataTableProps<T> {
  initialState?: Partial<DataTableState>;
  fetchData: (state: DataTableState) => Promise<DataTableResult<T>>;
  filtersConfig?: FilterConfig[];
  debounceMs?: number;
}
