import { Api, useSearchShippingLines } from "@/api";
import { DeleteDialog } from "@/components/delete-dialog";
import { ShippingLineFormDialog } from "@/components/form-dialog";
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
  CreateOrUpdateShippingLineSchema,
  ShippingLineSearchData,
  ShippingLineSearchSchema,
} from "@monorepo/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { Activity, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

function ShippingLinePage() {
  const user = useSelector(
    (state: RootState) => state.auth.user as UserWithoutPassword,
  );

  const [query, setQuery] = useState<ShippingLineSearchSchema>({
    page: 1,
    pageSize: 10,
    search: "",
  });

  const [debouncedSearch, setDebounceSearch] = useDebounceValue(
    query.search,
    500,
  );

  const mergedQuery = useMemo<ShippingLineSearchSchema>(
    () => ({ ...query, search: debouncedSearch }),
    [query, debouncedSearch],
  );

  const {
    shippingLinesData,
    shippingLinesMeta,
    shippingLinesLoading,
    shippingLinesEmpty,
    shippingLinesMutate,
  } = useSearchShippingLines(mergedQuery);

  const action = useAction<ShippingLineSearchData>();

  useEffect(() => {
    setQuery((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const columns: ColumnDef<ShippingLineSearchData>[] = [
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
    },
    {
      id: "fax",
      header: "Fax",
      accessorKey: "fax",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.fax}</span>
          </div>
        );
      },
    },
    {
      id: "website",
      header: "Website",
      accessorKey: "website",
      cell: ({ row }) => {
        if (!row.original.website) return <></>;
        return (
          <div className="w-full max-w-full">
            {/* <Link
              to={row.original.website}
              target="_blank"
              className="text-blue-400 hover:underline"
            >
            </Link> */}
            {row.original.website}
          </div>
        );
      },
    },
    {
      id: "address",
      header: "Address",
      accessorKey: "address",
      cell: ({ row }) => {
        return (
          <div className="w-full min-w-lg text-wrap">
            <span>{row.original.address}</span>
          </div>
        );
      },
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
    },
    {
      id: "code",
      header: "Code",
      accessorKey: "code",
      cell: ({ row }) => {
        return <>{row.original.code}</>;
      },
      enableSorting: true,
    },
    {
      id: "contact.name",
      accessorKey: "contact.name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.contact.name}</span>
          </div>
        );
      },
    },
    {
      id: "contact.email",
      accessorKey: "contact.email",
      header: "Email",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.contact.email}</span>
          </div>
        );
      },
    },
    {
      id: "contact.mobile",
      accessorKey: "contact.mobile",
      header: "Mobile",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.contact.mobile}</span>
          </div>
        );
      },
    },
    {
      id: "contact.position",
      accessorKey: "contact.position",
      header: "Position",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.contact.position}</span>
          </div>
        );
      },
    },
    {
      id: "contact.fax",
      accessorKey: "contact.fax",
      header: "Fax",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.contact.fax}</span>
          </div>
        );
      },
    },
    {
      id: "contact.skype",
      accessorKey: "contact.skype",
      header: "Skype",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.contact.skype}</span>
          </div>
        );
      },
    },
    {
      id: "contact.wechat",
      accessorKey: "contact.wechat",
      header: "Wechat",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.contact.wechat}</span>
          </div>
        );
      },
    },
    {
      id: "contact.whatsapp",
      accessorKey: "contact.whatsapp",
      header: "Whatsapp",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.contact.whatsapp}</span>
          </div>
        );
      },
    },
    {
      id: "contact.telegram",
      accessorKey: "contact.telegram",
      header: "Telegram",
      cell: ({ row }) => {
        return (
          <div className="w-full max-w-full">
            <span>{row.original.contact.telegram}</span>
          </div>
        );
      },
    },
    {
      id: "createdAt",
      header: "Created Date",
      accessorKey: "createdAt",
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

  const table = useTable<ShippingLineSearchData>({
    datas: shippingLinesData,
    columns,
  });

  function onSearch(value: string) {
    setDebounceSearch(value);
  }

  async function onSubmit(data: CreateOrUpdateShippingLineSchema) {
    if (action.valueEdit) {
      await Api.shippingLine.updateShippingLine(action.valueEdit.id, data);
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
      shippingLinesMutate();
    } else {
      await Api.shippingLine.createShippingLine(data);
      action.setOpenCreate(false);
      // brokersMutate((v) => [newBroker, ...(v || [])], { revalidate: false });
      toast.success("Created successfully");
      shippingLinesMutate();
    }
  }

  async function handleDelete() {
    if (!action.valueDelete) return;
    await Api.shippingLine.deleteShippingLine(action.valueDelete as string);
    action.setValueDelete(null);
    action.setDeleteOpen(false);
    toast.success("Deleted successfully");
    shippingLinesMutate();
  }

  return (
    <>
      <title>Product | RZ Logistic System</title>

      <div className="flex flex-col gap-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="sm:max-w-[320px]"
            placeholder="Search by name"
            onChange={(e) => onSearch(e.target.value)}
          />

          <div className="ml-auto space-x-2">
            <RefreshButton onClick={() => shippingLinesMutate()} />

            <CustomizeColumns table={table} />

            <ShippingLineFormDialog
              open={action.openCreate}
              onOpenChange={action.setOpenCreate}
              submit={onSubmit}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <AppTable<ShippingLineSearchData>
            table={table}
            colSpan={columns.length}
            loading={shippingLinesLoading}
            empty={shippingLinesEmpty}
          />

          <Activity
            name="pagination"
            mode={activityHelper(!shippingLinesLoading)}
          >
            <Pagination
              page={query.page as number}
              pageSize={query.pageSize as number}
              totalPages={shippingLinesMeta?.totalPages ?? 0}
              totalResources={shippingLinesMeta?.totalResources ?? 0}
              query={query}
              setQuery={setQuery}
            />
          </Activity>
        </div>
      </div>

      <ShippingLineFormDialog
        isEdit
        open={action.editOpen}
        initialValue={action.valueEdit || undefined}
        onOpenChange={action.setEditOpen}
        submit={onSubmit}
      />

      <DeleteDialog
        title="Delete Shipping Line"
        description="Are you sure you want to delete this shipping line?"
        open={action.deleteOpen}
        onOpenChange={action.setDeleteOpen}
        submit={handleDelete}
      />
    </>
  );
}

export default ShippingLinePage;
