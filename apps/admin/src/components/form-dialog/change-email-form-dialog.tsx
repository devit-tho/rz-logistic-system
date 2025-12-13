import { RHFTextField } from "@/components/hook-form";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changeUserEmailSchema,
  ChangeUserEmailSchema,
} from "@monorepo/schemas";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormDialogProps } from "./type";

function ChangeEmailFormDialog({
  initialValue,
  onOpenChange,
  open,
  submit,
}: Omit<
  FormDialogProps<
    Pick<ChangeUserEmailSchema, "id" | "email">,
    ChangeUserEmailSchema
  >,
  "isEdit"
>) {
  const defaultValues: ChangeUserEmailSchema = {
    id: "",
    email: "",
    newEmail: "",
  };

  const form = useForm<ChangeUserEmailSchema>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(changeUserEmailSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    reset,
  } = form;

  useEffect(() => {
    if (!initialValue) return;
    setValue("id", initialValue.id);
    setValue("email", initialValue.email);
  }, [initialValue]);

  const onSubmit = handleSubmit(async (data) => {
    await submit(data);
    reset(defaultValues);
  });

  return (
    <>
      <Form {...form}>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <form className="flex flex-col gap-y-2.5" onSubmit={onSubmit}>
              <DialogTitle>Change User Email</DialogTitle>

              <div className="flex flex-col gap-y-3 py-4">
                <RHFTextField
                  name="email"
                  label="Email"
                  placeholder="Enter your Email"
                  autoComplete="off"
                  disabled
                />

                <RHFTextField name="newEmail" label="New Email" />
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

export default ChangeEmailFormDialog;
