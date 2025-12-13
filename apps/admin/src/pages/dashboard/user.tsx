import { Api, useSearchUsers } from "@/api";
import { DeleteDialog } from "@/components/delete-dialog";
import {
  ChangeEmailFormDialog,
  UserFormDialog,
} from "@/components/form-dialog";
import ResetPasswordFormDialog from "@/components/form-dialog/reset-password-form-dialog";
import { RefreshButton } from "@/components/refresh-button";
import { AppTable, CustomizeColumns, Pagination } from "@/components/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  ChangeUserEmailSchema,
  CreateUserSchema,
  ResetPasswordSchema,
  UserSearchSchema,
} from "@monorepo/schemas";
import { ColumnDef } from "@tanstack/react-table";
import { differenceInCalendarDays, format } from "date-fns";
import { isEqual } from "lodash";
import { EllipsisVertical, Lock, Mail } from "lucide-react";
import { Activity, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";

function UserPage() {
  const user = useSelector(
    (state: RootState) => state.auth.user as UserWithoutPassword,
  );

  const [changeEmail, setChangeEmail] =
    useState<Pick<ChangeUserEmailSchema, "id" | "email">>();
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);

  const [resetPassword, setResetPassword] =
    useState<Pick<ResetPasswordSchema, "id">>();
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  const [query, setQuery] = useState<UserSearchSchema>({
    search: "",
    page: 1,
    pageSize: 10,
  });

  const [debouncedSearch, setDebouncedSearch] = useDebounceValue(
    query.search,
    500,
  );

  const mergedQuery = useMemo(
    () => ({
      ...query,
      search: debouncedSearch,
    }),
    [debouncedSearch, query],
  );

  const { usersData, usersMeta, usersLoading, usersEmpty, usersMutate } =
    useSearchUsers(mergedQuery);

  const action = useAction<UserWithoutPassword>();

  useEffect(() => {
    setQuery((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearch]);

  const columns = useMemo<ColumnDef<UserWithoutPassword>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        cell: ({ row }) => {
          const avatarFallback = () => {
            const name = row.original.name;
            const firstLetter = name
              .split(" ")
              .map((word) => word[0]?.toUpperCase())
              .join("");
            return firstLetter;
          };

          return (
            <>
              <div className="flex items-center gap-x-2.5">
                <Avatar>
                  <AvatarImage
                    src={row.original.imageUrl ?? ""}
                    alt={row.original.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {avatarFallback()}
                  </AvatarFallback>
                </Avatar>

                {row.original.name}
              </div>
            </>
          );
        },
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => row.original.email,
      },
      {
        id: "isSuperAdmin",
        header: "Role",
        accessorKey: "isSuperAdmin",
        cell: ({ row }) => (row.original.isSuperAdmin ? "Super Admin" : "User"),
      },
      {
        id: "lastLogin",
        header: "Last Login",
        accessorKey: "lastLogin",
        cell: ({ row }) => {
          function formatFriendlyDate(date: Date) {
            const now = new Date();
            const diff = differenceInCalendarDays(now, date);
            if (diff === 0) return "Today";
            if (diff === 1) return "Yesterday";
            if (diff < 7) return `${diff} days ago`;
            if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
            if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
            return `${Math.floor(diff / 365)} years ago`;
          }
          if (!row.original.lastLogin) return <></>;
          return <>{formatFriendlyDate(new Date(row.original.lastLogin))}</>;
        },
      },
      {
        id: "createdAt",
        header: "Created Date",
        accessorKey: "createdAt",
        cell: ({ row }) =>
          format(new Date(row.original.createdAt), "dd-MMM, yyyy"),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          if (isEqual(user.id, row.original.id)) return null;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={() => {
                    setChangeEmail({
                      id: row.original.id,
                      email: row.original.email,
                    });
                    setChangeEmailOpen(true);
                  }}
                >
                  <Mail />
                  Change Email
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => {
                    setResetPassword({
                      id: row.original.id,
                    });
                    setResetPasswordOpen(true);
                  }}
                >
                  <Lock />
                  Reset Password
                </DropdownMenuItem>

                {/* <DropdownMenuItem
                  variant="destructive"
                  onSelect={() => action.setDeleteOpen(true)}
                >
                  <Trash />
                  Delete
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useTable<UserWithoutPassword>({
    datas: usersData,
    columns,
  });

  function onSearch(value: string) {
    setDebouncedSearch(value);
  }

  // async function onSubmit(data: CreateUserSchema) {
  //   if (action.valueEdit) {
  //     // await Api.supplier.updateSupplier(action.valueEdit.id, data);
  //     // action.setEditOpen(false);
  //     // brokersMutate(
  //     //   (v) => {
  //     //     if (!v) return;
  //     //     const newData = v.map((item) => {
  //     //       if (item.id === action.valueEdit?.id) {
  //     //         return { ...data, id: item.id, createdAt: item.createdAt };
  //     //       }
  //     //       return item;
  //     //     });
  //     //     return newData;
  //     //   },
  //     //   {
  //     //     revalidate: false,
  //     //   },
  //     // );
  //     toast.success("Saved successfully", {});
  //     usersMutate();
  //   } else {
  //     await Api.user.createUser(data);
  //     action.setOpenCreate(false);
  //     toast.success("Created successfully");
  //     usersMutate();
  //   }
  // }

  async function onCreate(data: CreateUserSchema) {
    await Api.user.createUser(data);
    action.setOpenCreate(false);
    toast.success("Created successfully");
    usersMutate();
  }

  async function onChangeUserEmail(data: ChangeUserEmailSchema) {
    await Api.user.changeUserEmail(data);
    setChangeEmail(undefined);
    setChangeEmailOpen(false);
    toast.success("Changed successfully");
    usersMutate();
  }

  async function onResetPassword(data: ResetPasswordSchema) {
    await Api.user.resetPassword(data);
    setResetPassword(undefined);
    setResetPasswordOpen(false);
    toast.success("Reset password successfully");
    // usersMutate();
  }

  async function handleDelete() {
    // await Api.user.del(action.valueEdit?.id as number);
    toast.success("Deleted successfully");
    usersMutate();
  }

  return (
    <>
      <title>User | RZ Logistic System</title>

      <div className="flex flex-col gap-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="sm:max-w-[320px]"
            placeholder="Search by name"
            onChange={(e) => onSearch(e.target.value)}
          />

          <div className="ml-auto space-x-2">
            <RefreshButton onClick={() => usersMutate()} />

            <CustomizeColumns table={table} />

            <UserFormDialog
              open={action.openCreate}
              onOpenChange={action.setOpenCreate}
              submit={onCreate}
            />
          </div>
        </div>

        <div className="flex flex-col gap-y-4">
          <AppTable<UserWithoutPassword>
            table={table}
            colSpan={columns.length}
            loading={usersLoading}
            empty={usersEmpty}
          />

          <Activity name="pagination" mode={activityHelper(!usersLoading)}>
            <Pagination
              page={query.page as number}
              pageSize={query.pageSize as number}
              totalPages={usersMeta?.totalPages ?? 0}
              totalResources={usersMeta?.totalResources ?? 0}
              query={query}
              setQuery={setQuery}
            />
          </Activity>
        </div>
      </div>

      <DeleteDialog
        title="Delete User"
        description="Are you sure you want to delete this user?"
        open={action.deleteOpen}
        onOpenChange={action.setDeleteOpen}
        submit={handleDelete}
      />

      <ChangeEmailFormDialog
        initialValue={changeEmail}
        open={changeEmailOpen}
        onOpenChange={setChangeEmailOpen}
        submit={onChangeUserEmail}
      />

      <ResetPasswordFormDialog
        initialValue={resetPassword}
        open={resetPasswordOpen}
        onOpenChange={setResetPasswordOpen}
        submit={onResetPassword}
      />
    </>
  );
}

export default UserPage;
