import { Api, useSearchTruckings } from "@/api";
import { DeleteDialog } from "@/components/delete-dialog";
import { ExportDropdown } from "@/components/export-dropdown";
import { TruckingManagementFormDialog } from "@/components/form-dialog";
import { RefreshButton } from "@/components/refresh-button";
import { AppTable, CustomizeColumns, Pagination } from "@/components/table";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { RootState } from "@/stores";
import { activityHelper } from "@/utils/activity-helper";
import { exportToExcel } from "@/utils/excel";
import { UserWithoutPassword } from "@monorepo/entities";
import {
  CreateOrUpdateTruckingSchema,
  TruckingSearchData,
  TruckingSearchSchema,
} from "@monorepo/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { capitalCase } from "change-case";
import { format } from "date-fns";
import isEmpty from "lodash/isEmpty";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { Activity, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

function TruckingManagementPage() {
  const user = useSelector(
    (state: RootState) => state.auth.user as UserWithoutPassword,
  );

  const [query, setQuery] = useState<TruckingSearchSchema>({
    page: 1,
    pageSize: 10,
    search: "",
  });

  const [debouncedSearch, setDebounceSearch] = useDebounceValue(
    query.search,
    500,
  );

  const mergedQuery = useMemo<TruckingSearchSchema>(
    () => ({ ...query, search: debouncedSearch }),
    [query, debouncedSearch],
  );

  const {
    truckingsData,
    truckingsMeta,
    truckingsLoading,
    truckingsEmpty,
    truckingsMutate,
  } = useSearchTruckings(mergedQuery);

  const action = useAction<TruckingSearchData>();

  useEffect(() => {
    setQuery((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const columns: ColumnDef<TruckingSearchData>[] = [
    {
      id: "cargo",
      header: "Cargo Name",
      accessorKey: "cargo",
      cell: ({ row }) => {
        return <>{row.original.cargo.name}</>;
      },
    },
    {
      id: "supplier",
      header: "Supplier",
      accessorKey: "supplier",
      cell: ({ row }) => {
        return <>{row.original.supplier.organization}</>;
      },
    },
    {
      id: "shipment",
      header: "Shipment Name",
      accessorKey: "shipment",
      cell: ({ row }) => {
        return <>{row.original.shipment.name}</>;
      },
      enableSorting: true,
    },
    {
      id: "cargo.containerNo",
      header: "Container No",
      accessorKey: "cargo.containerNo",
      cell: ({ row }) => {
        if (isEmpty(row.original.cargo.containerNo)) return <></>;
        return <>{row.original.cargo.containerNo}</>;
      },
    },
    {
      id: "cargo.containerSealNumber",
      header: "Container Seal Number",
      accessorKey: "cargo.containerSealNumber",
      cell: ({ row }) => {
        if (isEmpty(row.original.cargo.containerSealNumber)) return <></>;
        return <>{row.original.cargo.containerSealNumber}</>;
      },
    },
    {
      id: "cargo.containerType",
      header: "Container Type",
      accessorKey: "cargo.containerType",
      cell: ({ row }) => {
        if (isEmpty(row.original.cargo.containerType)) return <></>;
        return <>{capitalCase(row.original.cargo.containerType as string)}</>;
      },
    },
    {
      id: "cargo.grossweight",
      header: "Gross Weight",
      accessorKey: "cargo.grossweight",
      cell: ({ row }) => {
        return <>{row.original.cargo.grossweight} kg</>;
      },
    },
    {
      id: "truckingType",
      header: "Trucking Type",
      accessorKey: "truckingType",
      cell: ({ row }) => {
        return <>{capitalCase(row.original.truckingType)}</>;
      },
    },
    {
      id: "driverName",
      header: "Driver Name",
      accessorKey: "driverName",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.driver.name}</span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: "truckPlateNumber",
      header: "Truck Plate Number",
      accessorKey: "truckPlateNumber",
      cell: ({ row }) => {
        return <>{row.original.truckPlateNumber}</>;
      },
    },
    {
      id: "fee",
      header: "Fee",
      accessorKey: "fee",
      accessorFn: (row) => row.fee,
      cell: ({ row }) => {
        return <>$ {row.original.fee}</>;
      },
      enableSorting: true,
    },
    {
      id: "jobsite",
      header: "Jobsite",
      accessorKey: "jobsite",
      cell: ({ row }) => {
        return <>{row.original.jobsite}</>;
      },
    },
    {
      id: "pickedUpDate",
      header: "Picked Up Date",
      accessorKey: "pickedUpDate",
      cell: ({ row }) => {
        if (isEmpty(row.original.pickedUpDate)) return <></>;
        return (
          <>
            {format(
              new Date(row.original.pickedUpDate as string),
              config.date_format,
            )}
          </>
        );
      },
    },
    {
      id: "arrivedDate",
      header: "Arrived Date",
      accessorKey: "arrivedDate",
      cell: ({ row }) => {
        if (isEmpty(row.original.arrivedDate)) return <></>;
        return (
          <>
            {format(
              new Date(row.original.arrivedDate as string),
              config.date_format,
            )}
          </>
        );
      },
    },
    {
      id: "unloadedDate",
      header: "Unloaded Date",
      accessorKey: "unloadedDate",
      cell: ({ row }) => {
        if (isEmpty(row.original.unloadedDate)) return <></>;
        return (
          <>
            {format(
              new Date(row.original.unloadedDate as string),
              config.date_format,
            )}
          </>
        );
      },
    },
    {
      id: "truckStandby",
      header: "Truck Standby",
      accessorKey: "truckStandby",
      cell: ({ row }) => {
        return <>{row.original.truckStandby}</>;
      },
    },
    {
      id: "cargo.quantity",
      header: "Packages",
      accessorKey: "cargo.quantity",
      cell: ({ row }) => {
        return <>{row.original.cargo.quantity}</>;
      },
    },
    {
      id: "isLost",
      header: "Cargo Lost",
      accessorKey: "isLost",
      cell: ({ row }) => {
        return (
          <Badge
            className={cn(
              "rounded-full",
              row.original.isLost ? "bg-red-500" : "bg-green-500",
            )}
          >
            {row.original.isLost ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      id: "isDamaged",
      header: "Cargo Damaged",
      accessorKey: "isDamaged",
      cell: ({ row }) => {
        return (
          <Badge
            className={cn(
              "rounded-full",
              row.original.isDamaged ? "bg-red-500" : "bg-green-500",
            )}
          >
            {row.original.isDamaged ? "Yes" : "No"}
          </Badge>
        );
      },
    },
    {
      id: "returnEmptyToDepotDate",
      header: "Return Empty To Depot Date",
      accessorKey: "returnEmptyToDepotDate",
      cell: ({ row }) => {
        if (isEmpty(row.original.returnEmptyToDepotDate)) return null;
        return (
          <>
            {format(
              new Date(row.original.returnEmptyToDepotDate as string),
              config.date_format,
            )}
          </>
        );
      },
    },
    {
      id: "remark",
      header: "Remark",
      accessorKey: "remark",
      cell: ({ row }) => {
        return <>{row.original.remark}</>;
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

  const table = useTable<TruckingSearchData>({
    datas: truckingsData,
    columns,
  });

  async function onSubmit(data: CreateOrUpdateTruckingSchema) {
    if (action.valueEdit) {
      await Api.truckingManagement.updateTrucking(action.valueEdit.id, data);
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
      truckingsMutate();
    } else {
      await Api.truckingManagement.createTrucking(data);
      action.setOpenCreate(false);
      // brokersMutate((v) => [newBroker, ...(v || [])], { revalidate: false });
      toast.success("Created successfully");
      truckingsMutate();
    }
  }

  async function handleDelete() {
    if (!action.valueDelete) return;
    await Api.truckingManagement.deleteTrucking(action.valueDelete as string);
    action.setValueDelete(null);
    action.setDeleteOpen(false);
    toast.success("Deleted successfully");
    truckingsMutate();
  }

  function onSearch(value: string) {
    setDebounceSearch(value);
  }

  return (
    <>
      <title>Trucking Management | RZ Logistic System</title>

      <div className="flex flex-col gap-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="sm:max-w-[320px]"
            placeholder="Search by name"
            onChange={(e) => onSearch(e.target.value)}
          />

          <div className="ml-auto space-x-2">
            <RefreshButton onClick={() => truckingsMutate()} />

            <ExportDropdown
              excel={() => exportToExcel(truckingsData, "truckings")}
            />

            <CustomizeColumns table={table} />

            <TruckingManagementFormDialog
              open={action.openCreate}
              onOpenChange={action.setOpenCreate}
              submit={onSubmit}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <AppTable<TruckingSearchData>
            table={table}
            colSpan={columns.length}
            loading={truckingsLoading}
            empty={truckingsEmpty}
          />

          <Activity name="pagination" mode={activityHelper(!truckingsLoading)}>
            <Pagination
              page={query.page as number}
              pageSize={query.pageSize as number}
              totalPages={truckingsMeta?.totalPages ?? 0}
              totalResources={truckingsMeta?.totalResources ?? 0}
              query={query}
              setQuery={setQuery}
            />
          </Activity>
        </div>
      </div>

      <TruckingManagementFormDialog
        isEdit
        open={action.editOpen}
        initialValue={action.valueEdit || undefined}
        onOpenChange={action.setEditOpen}
        submit={onSubmit}
      />

      <DeleteDialog
        title="Delete Trucking Management"
        description="Are you sure you want to delete this trucking management?"
        open={action.deleteOpen}
        onOpenChange={action.setDeleteOpen}
        submit={handleDelete}
      />
    </>
  );
}

export default TruckingManagementPage;
