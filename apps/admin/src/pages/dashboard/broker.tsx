import { Api, useSearchBrokers } from "@/api";
import { DeleteDialog } from "@/components/delete-dialog";
import { BrokerFormDialog } from "@/components/form-dialog";
import { RefreshButton } from "@/components/refresh-button";
import { AppTable, CustomizeColumns, Pagination } from "@/components/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAction } from "@/hooks/use-action";
import { useTable } from "@/hooks/use-table";
import { RootState } from "@/stores";
import { activityHelper } from "@/utils/activity-helper";
import { UserWithoutPassword } from "@monorepo/entities";
import {
  BrokerSearchData,
  BrokerSearchSchema,
  CreateOrUpdateBrokerSchema,
} from "@monorepo/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { Activity, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

function BrokerPage() {
  const user = useSelector(
    (state: RootState) => state.auth.user as UserWithoutPassword,
  );

  const [query, setQuery] = useState<BrokerSearchSchema>({
    page: 1,
    pageSize: 10,
    search: "",
  });

  const [debouncedSearch, setDebounceSearch] = useDebounceValue(
    query.search,
    500,
  );

  const mergedQuery = useMemo<BrokerSearchSchema>(
    () => ({ ...query, search: debouncedSearch }),
    [query, debouncedSearch],
  );

  const {
    brokersData,
    brokersMeta,
    brokersLoading,
    brokersEmpty,
    brokersMutate,
  } = useSearchBrokers(mergedQuery);

  useEffect(() => {
    setQuery((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const action = useAction<BrokerSearchData>();

  const columns = useMemo<ColumnDef<BrokerSearchData>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
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
        id: "organization",
        header: "Organization",
        accessorKey: "organization",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.organization}</span>
            </div>
          );
        },
        enableSorting: true,
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.email}</span>
            </div>
          );
        },
        enableSorting: true,
      },
      {
        id: "phone",
        header: "Phone",
        accessorKey: "phone",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.phone}</span>
            </div>
          );
        },
        enableSorting: true,
        enableHiding: true,
      },
      {
        id: "address",
        header: "Address",
        accessorKey: "address",
        cell: ({ row }) => {
          return (
            <div className="w-full min-w-lg">
              <span>{row.original.address}</span>
            </div>
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
                          requestAnimationFrame(() =>
                            action.setDeleteOpen(true),
                          );
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
    ],
    [],
  );

  const table = useTable({
    datas: brokersData,
    columns,
  });

  function onSearch(value: string) {
    setDebounceSearch(value);
  }

  async function onSubmit(data: CreateOrUpdateBrokerSchema) {
    if (action.valueEdit) {
      await Api.broker.updateBroker(action.valueEdit.id, data);
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
      brokersMutate();
    } else {
      await Api.broker.createBroker(data);
      action.setOpenCreate(false);
      // brokersMutate((v) => [newBroker, ...(v || [])], { revalidate: false });
      toast.success("Created successfully");
      brokersMutate();
    }
  }

  async function handleDelete() {
    if (!action.valueDelete) return;
    await Api.broker.deleteBroker(action.valueDelete as string);
    action.setValueDelete(null);
    action.setDeleteOpen(false);
    toast.success("Deleted successfully");
    brokersMutate();
  }

  return (
    <>
      <title>Broker | RZ Logistic System</title>

      <div className="flex flex-col gap-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="sm:max-w-[320px]"
            placeholder="Search by name"
            onChange={(e) => onSearch(e.target.value)}
          />

          <div className="ml-auto flex flex-wrap justify-end gap-2.5">
            <RefreshButton onClick={() => brokersMutate()} />

            <CustomizeColumns table={table} />

            <BrokerFormDialog
              open={action.openCreate}
              onOpenChange={action.setOpenCreate}
              submit={onSubmit}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <AppTable<BrokerSearchData>
            table={table}
            colSpan={columns.length}
            loading={brokersLoading}
            empty={brokersEmpty}
          />

          <Activity name="pagination" mode={activityHelper(!brokersLoading)}>
            <Pagination
              page={query.page as number}
              pageSize={query.pageSize as number}
              totalPages={brokersMeta?.totalPages ?? 0}
              totalResources={brokersMeta?.totalResources ?? 0}
              query={query}
              setQuery={setQuery}
            />
          </Activity>
        </div>
      </div>

      <BrokerFormDialog
        isEdit
        open={action.editOpen}
        initialValue={action.valueEdit || undefined}
        onOpenChange={action.setEditOpen}
        submit={onSubmit}
      />

      <DeleteDialog
        title="Delete Broker"
        description="Are you sure you want to delete this broker?"
        open={action.deleteOpen}
        onOpenChange={action.setDeleteOpen}
        submit={handleDelete}
      />
    </>
  );
}

export default BrokerPage;
