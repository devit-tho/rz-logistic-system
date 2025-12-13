import { SearchSchema } from "@monorepo/schemas";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PaginationProps<Q> {
  page: number;
  pageSize: number;
  totalPages: number;
  totalResources: number;
  query: Q;
  setQuery: React.Dispatch<React.SetStateAction<Q>>;
}

function Pagination<Q extends SearchSchema>({
  page,
  totalPages,
  pageSize,
  totalResources,
  setQuery,
}: PaginationProps<Q>) {
  const showingResult = Math.min(page * pageSize, totalResources);
  const total = totalResources === 0 ? 1 : totalPages;

  function onChangeValue(value: string) {
    const parsed = parseInt(value, 10);
    setQuery((prev) => ({ ...prev, pageSize: parsed }));
  }

  function onNextPage() {
    setQuery((prev) => {
      const currentPage = typeof prev.page === "number" ? prev.page : 1;
      const nextPage = currentPage < totalPages ? currentPage + 1 : currentPage;

      return {
        ...prev,
        page: nextPage,
      };
    });
  }

  function onPreviousPage() {
    setQuery((prev) => {
      const currentPage = typeof prev.page === "number" ? prev.page : 1;
      const previousPage = currentPage > 1 ? currentPage - 1 : currentPage;

      return {
        ...prev,
        page: previousPage,
      };
    });
  }

  function goToPage(pageNumber: number) {
    setQuery((prev) => {
      if (prev.page === pageNumber) return prev;
      return {
        ...prev,
        page: pageNumber,
      };
    });
  }

  function onFirstPage() {
    goToPage(1);
  }

  function onLastPage() {
    goToPage(totalPages);
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 px-2">
        <div className="text-muted-foreground flex-1 text-sm text-nowrap">
          Showing {showingResult} of {totalResources} results
        </div>

        <div className="ml-auto flex items-center gap-x-3 lg:gap-x-6">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select value={pageSize.toString()} onValueChange={onChangeValue}>
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue placeholder={""} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-muted-foreground text-sm text-nowrap">
            Page {page} of {total}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden size-8 md:flex"
              size="icon"
              onClick={onFirstPage}
              disabled={page === 1}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={onPreviousPage}
              disabled={page === 1}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={onNextPage}
              disabled={page === totalPages}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 md:flex"
              size="icon"
              onClick={onLastPage}
              disabled={page === totalPages}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Pagination;
