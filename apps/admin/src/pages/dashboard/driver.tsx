import { Api, useSearchDrivers } from "@/api";
import { DeleteDialog } from "@/components/delete-dialog";
import { DriverFormDialog } from "@/components/form-dialog";
import { RefreshButton } from "@/components/refresh-button";
import { AppTable, CustomizeColumns, Pagination } from "@/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import config from "@/config";
import { useAction } from "@/hooks/use-action";
import { useTable } from "@/hooks/use-table";
import { RootState } from "@/stores";
import { activityHelper } from "@/utils/activity-helper";
import { UserWithoutPassword } from "@monorepo/entities";
import {
  CreateOrUpdateDriverSchema,
  DriverSearchData,
  DriverSearchSchema,
} from "@monorepo/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { Activity, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

function DriverPage() {
  const user = useSelector(
    (state: RootState) => state.auth.user as UserWithoutPassword,
  );

  const [query, setQuery] = useState<DriverSearchSchema>({
    page: 1,
    pageSize: 10,
    search: "",
  });

  const [debouncedSearch, setDebounceSearch] = useDebounceValue(
    query.search,
    500,
  );

  const mergedQuery = useMemo<DriverSearchSchema>(
    () => ({ ...query, search: debouncedSearch }),
    [query, debouncedSearch],
  );

  const {
    driversData,
    driversMeta,
    driversLoading,
    driversMutate,
    driversEmpty,
  } = useSearchDrivers(mergedQuery);

  useEffect(() => {
    setQuery((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const action = useAction<DriverSearchData>();

  const columns: ColumnDef<DriverSearchData>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.name}</span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: "phone",
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        return <>{row.original.phone}</>;
      },
      enableSorting: true,
    },
    {
      id: "idCard",
      accessorKey: "idCard",
      header: "ID Card",
      cell: ({ row }) => {
        return <>{row.original.idCard}</>;
      },
      enableSorting: true,
    },
    {
      id: "code",
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => {
        return <>{row.original.code}</>;
      },
    },
    {
      id: "createdAt",
      header: "Created Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return (
          <>{format(new Date(row.original.createdAt), config.date_format)}</>
        );
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <>
            <div className="flex w-full max-w-2xl gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <EllipsisVertical className="size-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={() => {
                      action.setValueEdit(row.original);
                      requestAnimationFrame(() => action.setEditOpen(true));
                    }}
                  >
                    <Pencil />
                    Edit
                  </DropdownMenuItem>

                  {user.isSuperAdmin && (
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => {
                        action.setValueDelete(row.original.id);
                        requestAnimationFrame(() => action.setDeleteOpen(true));
                      }}
                    >
                      <Trash />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        );
      },
    },
  ];

  const table = useTable<DriverSearchData>({
    datas: driversData,
    columns,
    enableRowSelection: false,
  });

  function onSearch(value: string) {
    setDebounceSearch(value);
  }

  async function onSubmit(data: CreateOrUpdateDriverSchema) {
    if (action.valueEdit) {
      await Api.driver.updatedriver(action.valueEdit.id, data);
      action.setEditOpen(false);
      // brokersMutate(
      //   (v) => {
      //     if (!v) return;
      //     const newData = v.map((item) => {
      //       if (item.id === action.valueEdit?.id) {
      //         return { ...data, id: item.id, createdAt: item.createdAt };
      //       }
      //       return item;
      //     });
      //     return newData;
      //   },
      //   {
      //     revalidate: false,
      //   },
      // );
      toast.success("Saved successfully");
      driversMutate();
    } else {
      await Api.driver.createdriver(data);
      action.setOpenCreate(false);
      // brokersMutate((v) => [newBroker, ...(v || [])], { revalidate: false });
      toast.success("Created successfully");
      driversMutate();
    }
  }

  async function handleDelete() {
    if (!action.valueDelete) return;
    await Api.driver.deletedriver(action.valueDelete as string);
    action.setValueDelete(null);
    action.setDeleteOpen(false);
    toast.success("Deleted successfully");
    driversMutate();
  }

  return (
    <>
      <title>Driver | RZ Logistic System</title>

      <div className="flex flex-col gap-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="sm:max-w-[320px]"
            placeholder="Search by name"
            onChange={(e) => onSearch(e.target.value)}
          />

          <div className="ml-auto space-x-2">
            <RefreshButton onClick={() => driversMutate()} />

            <CustomizeColumns table={table} />

            <DriverFormDialog
              open={action.openCreate}
              onOpenChange={action.setOpenCreate}
              submit={onSubmit}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <AppTable<DriverSearchData>
            table={table}
            colSpan={columns.length}
            loading={driversLoading}
            empty={driversEmpty}
          />

          <Activity name="pagination" mode={activityHelper(!driversLoading)}>
            <Pagination
              page={query.page as number}
              pageSize={query.pageSize as number}
              totalPages={driversMeta?.totalPages ?? 0}
              totalResources={driversMeta?.totalResources ?? 0}
              query={query}
              setQuery={setQuery}
            />
          </Activity>
        </div>
      </div>

      <DriverFormDialog
        isEdit
        open={action.editOpen}
        initialValue={action.valueEdit || undefined}
        onOpenChange={action.setEditOpen}
        submit={onSubmit}
      />

      <DeleteDialog
        title="Delete Driver"
        description="Are you sure you want to delete this driver?"
        open={action.deleteOpen}
        onOpenChange={action.setDeleteOpen}
        submit={handleDelete}
      />
    </>
  );
}

export default DriverPage;
