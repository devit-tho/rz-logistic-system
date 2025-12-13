import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, Table as TableType } from "@tanstack/react-table";
import { Loader } from "lucide-react";

interface AppTableProps<T> {
  table: TableType<T>;
  colSpan?: number;
  loading: boolean;
  empty?: boolean;
}

function AppTable<T>({
  table,
  colSpan,
  loading,
  empty = false,
}: AppTableProps<T>) {
  const dataContent = table.getRowModel().rows.length > 0 &&
    !loading &&
    !empty && (
      <>
        {table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="relative z-0"
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id} className="py-2.5">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );

  const noResultsContent = empty && (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-[40dvh]">
        <div className="flex flex-col items-center justify-center">
          <img src="/images/no-result.png" alt="Empty" className="size-28" />
          <span className="text-muted-foreground">No results found.</span>
        </div>
      </TableCell>
    </TableRow>
  );

  const loadingContent = loading && (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-[40dvh]">
        <div className="flex flex-col items-center justify-center gap-y-3.5">
          <Loader className="text-muted-foreground size-10 animate-spin" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {dataContent}
            {noResultsContent}
            {loadingContent}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default AppTable;
