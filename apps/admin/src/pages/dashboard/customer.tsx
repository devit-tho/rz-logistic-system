import { Api, useSearchCustomers } from "@/api";
import { DeleteDialog } from "@/components/delete-dialog";
import { CustomerFormDialog } from "@/components/form-dialog";
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
  CreateOrUpdateCustomerSchema,
  CustomerSearchData,
  CustomerSearchSchema,
} from "@monorepo/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import isEmpty from "lodash/isEmpty";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { Activity, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

function CustomerPage() {
  const user = useSelector(
    (state: RootState) => state.auth.user as UserWithoutPassword,
  );

  const [query, setQuery] = useState<CustomerSearchSchema>({
    page: 1,
    pageSize: 10,
    search: "",
  });

  const [debouncedSearch, setDebounceSearch] = useDebounceValue(
    query.search,
    500,
  );

  const mergedQuery = useMemo<CustomerSearchSchema>(
    () => ({ ...query, search: debouncedSearch }),
    [query, debouncedSearch],
  );

  const {
    customersData,
    customersMeta,
    customersLoading,
    customersMutate,
    customersEmpty,
  } = useSearchCustomers(mergedQuery);

  useEffect(() => {
    setQuery((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const action = useAction<CustomerSearchData>();

  const columns: ColumnDef<CustomerSearchData>[] = [
    {
      id: "organization",
      accessorKey: "organization",
      header: "Organization",
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
      accessorKey: "email",
      header: "Email",
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
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        if (isEmpty(row.original.phone)) return null;

        return <>{row.original.phone}</>;
      },
      enableSorting: true,
    },

    {
      id: "address",
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        return <div className="w-full min-w-lg">{row.original.address}</div>;
      },
      enableSorting: true,
    },
    {
      id: "contact.name",
      accessorKey: "contact.name",
      header: "Name",
      cell: ({ row }) => {
        return <>{row.original.contact.name}</>;
      },
      enableSorting: true,
    },
    {
      id: "contact.email",
      accessorKey: "contact.email",
      header: "Email",
      cell: ({ row }) => {
        return <>{row.original.contact.email}</>;
      },
      enableSorting: true,
    },
    {
      id: "contact.mobile",
      accessorKey: "contact.mobile",
      header: "Mobile",
      cell: ({ row }) => {
        return <>{row.original.contact.mobile}</>;
      },
      enableSorting: true,
    },
    {
      id: "contact.position",
      accessorKey: "contact.position",
      header: "Position",
      cell: ({ row }) => {
        return <>{row.original.contact.position}</>;
      },
      enableSorting: true,
    },
    {
      id: "contact.fax",
      accessorKey: "contact.fax",
      header: "Fax",
      cell: ({ row }) => {
        return <>{row.original.contact.fax}</>;
      },
      enableSorting: true,
    },
    {
      id: "contact.skype",
      accessorKey: "contact.skype",
      header: "Skype",
      cell: ({ row }) => {
        return <>{row.original.contact.skype}</>;
      },
      enableSorting: true,
    },
    {
      id: "contact.wechat",
      accessorKey: "contact.wechat",
      header: "Wechat",
      cell: ({ row }) => {
        return <>{row.original.contact.wechat}</>;
      },
      enableSorting: true,
    },
    {
      id: "contact.whatsapp",
      accessorKey: "contact.whatsapp",
      header: "Whatsapp",
      cell: ({ row }) => {
        return <>{row.original.contact.whatsapp}</>;
      },
      enableSorting: true,
    },
    {
      id: "contact.telegram",
      accessorKey: "contact.telegram",
      header: "Telegram",
      cell: ({ row }) => {
        return <>{row.original.contact.telegram}</>;
      },
      enableSorting: true,
    },
    {
      id: "createdAt",
      header: "Created Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return <>{format(new Date(row.original.createdAt), "dd-MMM,yyyy")}</>;
      },
      enableSorting: true,
    },
    // {
    //   id: "createdBy",
    //   header: "createdBy",
    //   cell: ({ row }) => {
    //     return <>{row.original.createdById}</>;
    //   },
    //   enableSorting: true,
    // },
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

  const table = useTable<CustomerSearchData>({
    datas: customersData,
    columns,
    enableRowSelection: false,
  });

  function onSearch(value: string) {
    setDebounceSearch(value);
  }

  async function onSubmit(data: CreateOrUpdateCustomerSchema) {
    if (action.valueEdit) {
      await Api.customer.updateCustomer(action.valueEdit.id, data);
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
      customersMutate();
    } else {
      await Api.customer.createCustomer(data);
      action.setOpenCreate(false);
      // brokersMutate((v) => [newBroker, ...(v || [])], { revalidate: false });
      toast.success("Created successfully");
      customersMutate();
    }
  }

  async function handleDelete() {
    if (!action.valueDelete) return;
    await Api.customer.deleteCustomer(action.valueDelete as string);
    action.setValueDelete(null);
    action.setDeleteOpen(false);
    toast.success("Deleted successfully");
    customersMutate();
  }

  return (
    <>
      <title>Customer | RZ Logistic System</title>

      <div className="flex flex-col gap-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="sm:max-w-[320px]"
            placeholder="Search by name"
            onChange={(e) => onSearch(e.target.value)}
          />

          <div className="ml-auto space-x-2">
            <RefreshButton onClick={() => customersMutate()} />

            <CustomizeColumns table={table} />

            <CustomerFormDialog
              open={action.openCreate}
              onOpenChange={action.setOpenCreate}
              submit={onSubmit}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <AppTable<CustomerSearchData>
            table={table}
            colSpan={columns.length}
            loading={customersLoading}
            empty={customersEmpty}
          />

          <Activity name="pagination" mode={activityHelper(!customersLoading)}>
            <Pagination
              page={query.page as number}
              pageSize={query.pageSize as number}
              totalPages={customersMeta?.totalPages ?? 0}
              totalResources={customersMeta?.totalResources ?? 0}
              query={query}
              setQuery={setQuery}
            />
          </Activity>
        </div>
      </div>

      <CustomerFormDialog
        isEdit
        open={action.editOpen}
        initialValue={action.valueEdit || undefined}
        onOpenChange={action.setEditOpen}
        submit={onSubmit}
      />

      <DeleteDialog
        title="Delete Customer"
        description="Are you sure you want to delete this customer?"
        open={action.deleteOpen}
        onOpenChange={action.setDeleteOpen}
        submit={handleDelete}
      />
    </>
  );
}

export default CustomerPage;
