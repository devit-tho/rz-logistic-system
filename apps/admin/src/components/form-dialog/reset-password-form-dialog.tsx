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
import { resetPasswordSchema, ResetPasswordSchema } from "@monorepo/schemas";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormDialogProps } from "./type";

function ResetPasswordFormDialog({
  initialValue,
  open,
  onOpenChange,
  submit,
}: Omit<
  FormDialogProps<Pick<ResetPasswordSchema, "id">, ResetPasswordSchema>,
  "isEdit"
>) {
  const defaultValues: ResetPasswordSchema = {
    id: "",
    password: "",
  };

  const form = useForm<ResetPasswordSchema>({
    defaultValues,
    resolver: zodResolver(resetPasswordSchema),
    mode: "onSubmit",
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
              <DialogTitle>Reset user password</DialogTitle>

              <div className="flex flex-col gap-y-3 py-4">
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

export default ResetPasswordFormDialog;
