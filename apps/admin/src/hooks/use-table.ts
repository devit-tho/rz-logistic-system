import {
  ColumnDef,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  TableOptions,
  useReactTable,
} from "@tanstack/react-table";

interface TableProps<T>
  extends Omit<
    TableOptions<T>,
    | "data"
    | "columns"
    | "state"
    | "getRowId"
    | "onRowSelectionChange"
    | "onSortingChange"
    | "onColumnFiltersChange"
    | "onColumnVisibilityChange"
    | "onPaginationChange"
    | "getCoreRowModel"
    | "getFilteredRowModel"
    | "getPaginationRowModel"
    | "getSortedRowModel"
    | "getFacetedRowModel"
    | "getFacetedUniqueValues"
  > {
  datas: T[];
  columns: ColumnDef<T>[];
}

export function useTable<T extends { id: string | number }>({
  datas,
  columns,
  enableRowSelection = false,
  ...other
}: TableProps<T>) {
  return useReactTable<T>({
    data: datas,
    columns,
    getRowId: (row) => row.id.toString(),
    enableRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    ...other,
  });
}
