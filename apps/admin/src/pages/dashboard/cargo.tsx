import { Api, useSearchCargos } from "@/api";
import { DeleteDialog } from "@/components/delete-dialog";
import { ExportDropdown } from "@/components/export-dropdown";
import { CargoFormDialog } from "@/components/form-dialog";
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
import { exportToExcel } from "@/utils/excel";
import { UserWithoutPassword } from "@monorepo/entities";
import {
  CargoSearchData,
  CargoSearchSchema,
  CreateOrUpdateCargoSchema,
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

function CargoPage() {
  const user = useSelector(
    (state: RootState) => state.auth.user as UserWithoutPassword,
  );

  const [query, setQuery] = useState<CargoSearchSchema>({
    page: 1,
    pageSize: 10,
    search: "",
  });

  const [debouncedSearch, setDebounceSearch] = useDebounceValue(
    query.search,
    500,
  );

  const mergedQuery = useMemo<CargoSearchSchema>(
    () => ({ ...query, search: debouncedSearch }),
    [query, debouncedSearch],
  );

  const { cargosData, cargosMeta, cargosLoading, cargosEmpty, cargosMutate } =
    useSearchCargos(mergedQuery);

  useEffect(() => {
    setQuery((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const action = useAction<CargoSearchData>();

  const columns: ColumnDef<CargoSearchData>[] = [
    {
      id: "name",
      header: "Cargo Name",
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
      id: "type",
      header: "Cargo Type",
      accessorKey: "type",
      cell: ({ row }) => {
        if (isEmpty(row.original.type)) return null;
        return <>{capitalCase(row.original.type as string)}</>;
      },
      enableSorting: true,
    },
    {
      id: "containerNo",
      header: "Container No",
      accessorKey: "containerNo",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.containerNo}</span>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      id: "containerSealNumber",
      header: "Container Seal Number",
      accessorKey: "containerSealNumber",
      cell: ({ row }) => {
        return <>{row.original.containerSealNumber}</>;
      },
      enableSorting: true,
    },
    {
      id: "containerType",
      header: "Container Type",
      accessorKey: "containerType",
      cell: ({ row }) => {
        if (isEmpty(row.original.containerType)) return null;
        return <>{capitalCase(row.original.containerType as string)}</>;
      },
    },
    {
      id: "containerSize",
      header: "Container Size",
      accessorKey: "containerSize",
      cell: ({ row }) => {
        return <>{row.original.containerSize}</>;
      },
      enableSorting: true,
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => {
        return <>{row.original.description}</>;
      },
      enableSorting: true,
    },
    {
      id: "hsCode",
      header: "HS Code",
      accessorKey: "hsCode",
      cell: ({ row }) => {
        return <>{row.original.hsCode}</>;
      },
      enableSorting: true,
    },
    {
      id: "quantity",
      header: "Quantity",
      accessorKey: "quantity",
      cell: ({ row }) => {
        return <>{row.original.quantity.toLocaleString()}</>;
      },
      enableSorting: true,
    },
    {
      id: "value",
      header: "Value",
      accessorKey: "value",
      cell: ({ row }) => {
        return <>$ {row.original.value.toLocaleString()}</>;
      },
      enableSorting: true,
    },
    {
      id: "origin",
      header: "Origin",
      accessorKey: "origin",
      cell: ({ row }) => {
        return <>{row.original.origin}</>;
      },
      enableSorting: true,
    },
    {
      id: "destination",
      header: "Destination",
      accessorKey: "destination",
      cell: ({ row }) => {
        return <>{row.original.destination}</>;
      },
      enableSorting: true,
    },
    {
      id: "length",
      header: "Length",
      accessorKey: "length",
      cell: ({ row }) => {
        return <>{row.original.length.toLocaleString()} m</>;
      },
      enableSorting: true,
    },
    {
      id: "width",
      header: "Width",
      accessorKey: "width",
      cell: ({ row }) => {
        return <>{row.original.width} m</>;
      },
      enableSorting: true,
    },
    {
      id: "height",
      header: "Height",
      accessorKey: "height",
      cell: ({ row }) => {
        return <>{row.original.height} m</>;
      },
      enableSorting: true,
    },
    {
      id: "grossweight",
      header: "Gross Weight",
      accessorKey: "grossweight",
      cell: ({ row }) => {
        return <>{row.original.grossweight.toLocaleString()} kg</>;
      },
      enableSorting: false,
    },
    {
      id: "cbm",
      header: "CBM",
      accessorKey: "cbm",
      cell: ({ row }) => {
        return <>{row.original.cbm} m³</>;
      },
      enableSorting: true,
    },
    {
      id: "shipmentId",
      header: "Shipment Name",
      accessorKey: "shipmentId",
      cell: ({ row }) => {
        return <>{row.original.shipment.name}</>;
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

  const table = useTable({
    datas: cargosData,
    columns,
  });

  function onSearch(value: string) {
    setDebounceSearch(value);
  }

  async function onSubmit(data: CreateOrUpdateCargoSchema) {
    if (action.valueEdit) {
      await Api.cargo.updateCargo(action.valueEdit.id, data);
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
      cargosMutate();
    } else {
      await Api.cargo.createCargo(data);
      action.setOpenCreate(false);
      // brokersMutate((v) => [newBroker, ...(v || [])], { revalidate: false });
      toast.success("Created successfully");
      cargosMutate();
    }
  }

  async function handleDelete() {
    if (!action.valueDelete) return;
    await Api.cargo.deleteCargo(action.valueDelete as string);
    action.setValueDelete(null);
    action.setDeleteOpen(false);
    toast.success("Deleted successfully");
    cargosMutate();
  }

  return (
    <>
      <title>Cargo | RZ Logistic System</title>

      <div className="flex flex-col gap-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="sm:max-w-[320px]"
            placeholder="Search by name"
            onChange={(e) => onSearch(e.target.value)}
          />

          <div className="ml-auto space-x-2">
            <RefreshButton onClick={() => cargosMutate()} />

            <ExportDropdown excel={() => exportToExcel(cargosData, "cargos")} />

            <CustomizeColumns table={table} />

            <CargoFormDialog
              open={action.openCreate}
              onOpenChange={action.setOpenCreate}
              submit={onSubmit}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <AppTable<CargoSearchData>
            table={table}
            colSpan={columns.length}
            loading={cargosLoading}
            empty={cargosEmpty}
          />

          <Activity name="pagination" mode={activityHelper(!cargosLoading)}>
            <Pagination
              page={query.page as number}
              pageSize={query.pageSize as number}
              totalPages={cargosMeta?.totalPages ?? 0}
              totalResources={cargosMeta?.totalResources ?? 0}
              query={query}
              setQuery={setQuery}
            />
          </Activity>
        </div>
      </div>

      <CargoFormDialog
        isEdit
        open={action.editOpen}
        initialValue={action.valueEdit || undefined}
        onOpenChange={action.setEditOpen}
        submit={onSubmit}
      />

      <DeleteDialog
        title="Delete Cargo"
        description="Are you sure you want to delete this cargo?"
        open={action.deleteOpen}
        onOpenChange={action.setDeleteOpen}
        submit={handleDelete}
      />
    </>
  );
}

export default CargoPage;
