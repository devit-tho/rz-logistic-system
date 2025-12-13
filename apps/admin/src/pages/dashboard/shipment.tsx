import { Api, useSearchShipments } from "@/api";
import { DeleteDialog } from "@/components/delete-dialog";
import { ExportDropdown } from "@/components/export-dropdown";
import { ShipmentFormDialog } from "@/components/form-dialog";
import { RefreshButton } from "@/components/refresh-button";
import { AppTable, CustomizeColumns, Pagination } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import { shipmentStatus, UserWithoutPassword } from "@monorepo/entities";
import {
  CreateOrUpdateShipmentSchema,
  ShipmentSearchData,
  ShipmentSearchSchema,
} from "@monorepo/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { capitalCase } from "change-case";
import { format } from "date-fns";
import { omit } from "lodash";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { ChevronDown, EllipsisVertical, Pencil, Trash } from "lucide-react";
import { Activity, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

function ShipmentPage() {
  const user = useSelector(
    (state: RootState) => state.auth.user as UserWithoutPassword,
  );

  const [query, setQuery] = useState<ShipmentSearchSchema>({
    page: 1,
    pageSize: 10,
    status: null,
    search: "",
  });

  const [debouncedSearch, setDebounceSearch] = useDebounceValue(
    query.search,
    500,
  );

  const mergedQuery = useMemo<ShipmentSearchSchema>(
    () => ({ ...query, search: debouncedSearch }),
    [query, debouncedSearch],
  );

  const {
    shipmentsData,
    shipmentsMeta,
    shipmentsLoading,
    shipmentsEmpty,
    shipmentsMutate,
  } = useSearchShipments(mergedQuery);

  useEffect(() => {
    setQuery((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const action = useAction<ShipmentSearchData>();

  const columns = useMemo<ColumnDef<ShipmentSearchData>[]>(
    () => [
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
      },
      {
        id: "jobsheetNo",
        accessorKey: "jobsheetNo",
        header: "Jobsheet No",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.jobsheetNo}</span>
            </div>
          );
        },
      },
      {
        id: "billOfLadingNo",
        accessorKey: "billOfLadingNo",
        accessorFn: (row) => row.billOfLadingNo,
        header: "Bill of Lading No",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.billOfLadingNo}</span>
            </div>
          );
        },
      },
      {
        id: "packages",
        accessorKey: "packages",
        accessorFn: (row) => row.packages,
        header: "Packages",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.packages}</span>
            </div>
          );
        },
      },
      {
        id: "etd",
        accessorKey: "etd",
        accessorFn: (row) => row.etd,
        header: "ETD",
        cell: ({ row }) => {
          if (!row.original.etd) return null;
          return (
            <div className="w-full max-w-full">
              <span>
                {format(new Date(row.original.etd), config.date_format)}
              </span>
            </div>
          );
        },
      },
      {
        id: "eta",
        accessorKey: "eta",
        accessorFn: (row) => row.eta,
        header: "ETA",
        cell: ({ row }) => {
          if (!row.original.eta) return null;
          return (
            <div className="w-full max-w-full">
              <span>
                {format(new Date(row.original.eta), config.date_format)}
              </span>
            </div>
          );
        },
      },
      {
        id: "totalM3",
        accessorKey: "totalM3",
        accessorFn: (row) => row.totalM3,
        header: "Total M\u00B3",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.totalM3} m³</span>
            </div>
          );
        },
      },
      {
        id: "totalContainers",
        accessorKey: "totalContainers",
        header: "Total Containers",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.totalContainers}</span>
            </div>
          );
        },
      },
      {
        id: "grossWeight",
        accessorKey: "grossWeight",
        accessorFn: (row) => row.grossWeight,
        header: "Gross Weight",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.grossWeight.toLocaleString()} kg</span>
            </div>
          );
        },
      },
      {
        id: "completedDate",
        accessorKey: "completedDate",
        header: "Completed Date",
        cell: ({ row }) => {
          if (!row.original.completedDate) return <></>;

          return (
            <div className="w-full max-w-full">
              <span>
                {format(
                  new Date(row.original.completedDate),
                  config.date_format,
                )}
              </span>
            </div>
          );
        },
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.description}</span>
            </div>
          );
        },
      },
      {
        id: "trackingNumber",
        accessorKey: "trackingNumber",
        header: "Tracking Number",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.trackingNumber}</span>
            </div>
          );
        },
      },
      {
        id: "reference",
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.reference}</span>
            </div>
          );
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;

          const getBadgeVariant = (status: string) => {
            switch (status) {
              case shipmentStatus.PENDING:
                return "bg-yellow-400";
              case shipmentStatus.DELIVERED:
                return "bg-green-400";
              case shipmentStatus.IN_TRANSIT:
                return "bg-blue-400";
              case shipmentStatus.ON_HOLD:
                return "bg-gray-400";
              case shipmentStatus.CANCELLED:
                return "bg-red-400";
              default:
                return "bg-default-400";
            }
          };

          return (
            <div className="w-full max-w-full">
              <Badge className={cn("rounded-full", getBadgeVariant(status))}>
                {capitalCase(status)}
              </Badge>
            </div>
          );
        },
      },
      {
        id: "customer",
        accessorKey: "customer",
        header: "Customer",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.customer.organization}</span>
            </div>
          );
        },
      },
      {
        id: "shippingLine",
        accessorKey: "shippingLine",
        header: "Shipping Line",
        cell: ({ row }) => {
          if (isEmpty(row.original.shippingLine)) return <></>;

          return (
            <div className="w-full max-w-full">
              <span>{row.original.shippingLine.organization}</span>
            </div>
          );
        },
      },
      {
        id: "broker",
        accessorKey: "broker",
        header: "Broker",
        cell: ({ row }) => {
          if (isEmpty(row.original.broker)) return <></>;

          return (
            <div className="w-full max-w-full">
              <span>{row.original.broker.name}</span>
            </div>
          );
        },
      },
      {
        id: "user",
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>{row.original.user.name}</span>
            </div>
          );
        },
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Created Date",
        cell: ({ row }) => {
          return (
            <div className="w-full max-w-full">
              <span>
                {format(new Date(row.original.createdAt), config.date_format)}
              </span>
            </div>
          );
        },
      },
      {
        id: "action",
        header: "",
        cell: ({ row }) => {
          return (
            <>
              <div className="sticky flex w-full max-w-2xl gap-2">
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
    [action, user],
  );

  const table = useTable<ShipmentSearchData>({
    datas: shipmentsData,
    columns,
  });

  async function onSubmit(data: CreateOrUpdateShipmentSchema) {
    if (action.valueEdit) {
      await Api.shipment.updateShipment(action.valueEdit.id, data);
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
      shipmentsMutate();
    } else {
      await Api.shipment.createShipment(data);
      action.setOpenCreate(false);
      // brokersMutate((v) => [newBroker, ...(v || [])], { revalidate: false });
      toast.success("Created successfully");
      shipmentsMutate();
    }
  }

  function onChangeStatus(v: keyof typeof shipmentStatus) {
    const isSame = isEqual(query.status, v);
    setQuery((prev) => ({ ...prev, status: isSame ? null : v }));
  }

  function onSearch(value: string) {
    setDebounceSearch(value);
  }

  async function handleDelete() {
    if (!action.valueDelete) return;
    await Api.shipment.deleteShipment(action.valueDelete as string);
    action.setValueDelete(null);
    action.setDeleteOpen(false);
    toast.success("Deleted successfully");
    shipmentsMutate();
  }

  return (
    <>
      <title>Shipment | RZ Logistic System</title>

      <div className="flex flex-col gap-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="sm:max-w-[320px]"
            placeholder="Search by name, jobsheet no, bill of lading no"
            onChange={(e) => onSearch(e.target.value)}
          />

          <div className="ml-auto flex flex-wrap justify-end gap-2.5">
            <RefreshButton onClick={() => shipmentsMutate()} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {query.status ? capitalCase(query.status) : "Status"}
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.keys(shipmentStatus).map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={status === query.status}
                    onSelect={() =>
                      onChangeStatus(status as keyof typeof shipmentStatus)
                    }
                  >
                    {capitalCase(status)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ExportDropdown
              excel={() =>
                exportToExcel(
                  shipmentsData.map((d) => ({
                    ...omit(d, [
                      "id",
                      "customerId",
                      "brokerId",
                      "cargoId",
                      "shippingLineId",
                      "userId",
                    ]),
                    ...(d.etd && {
                      etd: format(new Date(d.etd), config.date_format),
                    }),
                    ...(d.eta && {
                      eta: format(new Date(d.eta), config.date_format),
                    }),
                    completedDate: d.completedDate
                      ? format(new Date(d.completedDate), config.date_format)
                      : null,
                    createdAt: format(
                      new Date(d.createdAt),
                      config.date_format,
                    ),
                    status: capitalCase(d.status),
                  })),
                  "shipments",
                )
              }
            />

            <CustomizeColumns<ShipmentSearchData> table={table} />

            <ShipmentFormDialog
              open={action.openCreate}
              onOpenChange={action.setOpenCreate}
              submit={onSubmit}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-3">
          <AppTable<ShipmentSearchData>
            table={table}
            colSpan={columns.length}
            loading={shipmentsLoading}
            empty={shipmentsEmpty}
          />

          <Activity name="pagination" mode={activityHelper(!shipmentsLoading)}>
            <Pagination
              page={query.page as number}
              pageSize={query.pageSize as number}
              totalPages={shipmentsMeta?.totalPages ?? 0}
              totalResources={shipmentsMeta?.totalResources ?? 0}
              query={query}
              setQuery={setQuery}
            />
          </Activity>
        </div>
      </div>

      <ShipmentFormDialog
        isEdit
        open={action.editOpen}
        initialValue={action.valueEdit || undefined}
        onOpenChange={action.setEditOpen}
        submit={onSubmit}
      />

      <DeleteDialog
        title="Delete Shipment"
        description="Are you sure you want to delete this shipment?"
        open={action.deleteOpen}
        onOpenChange={action.setDeleteOpen}
        submit={handleDelete}
      />
    </>
  );
}

export default ShipmentPage;
