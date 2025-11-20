// src/components/ui/datatable/types.ts

export interface DataTableProps<TData, TValue> {
  columns: any[]; // or ColumnDef<TData, TValue>[]
  data: TData[];
  isLoading?: boolean;

  page: number; // current page index (1-based)
  pageSize: number; // rows per page
  total: number; // total items from API
  onPageChange: (page: number) => void; // handler for pagination click
}
