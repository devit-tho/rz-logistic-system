import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserWithoutPassword } from "@monorepo/entities";
import { createUserSchema, CreateUserSchema } from "@monorepo/schemas";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { RHFTextField } from "../hook-form";
import { LoadingButton } from "../loading-button";
import { FormDialogProps } from "./type";

function UserFormDialog({
  open,
  onOpenChange,
  submit,
}: Omit<
  FormDialogProps<UserWithoutPassword, CreateUserSchema>,
  "initialValue" | "isEdit"
>) {
  const form = useForm<CreateUserSchema>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(createUserSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const onSubmit = handleSubmit(async (data) => {
    await submit(data);
    reset();
  });

  return (
    <>
      <Form {...form}>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="cursor-pointer">
              <PlusIcon />
              <span className="hidden lg:inline">Create User</span>
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="User form">
            <form onSubmit={onSubmit} className="flex flex-col gap-y-2.5">
              <DialogTitle>Create User</DialogTitle>

              <div className="flex flex-col gap-y-3 py-4">
                <RHFTextField
                  name="name"
                  label="Name"
                  placeholder="Enter user name"
                />

                <RHFTextField
                  name="email"
                  label="Email"
                  placeholder="Enter user email"
                />

                <RHFTextField
                  name="password"
                  label="Password"
                  placeholder="Enter user password"
                />
              </div>

              <DialogFooter className="flex-row justify-end">
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <LoadingButton type="submit" loading={isSubmitting}>
                  Submit
                </LoadingButton>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  );
}

export default UserFormDialog;
