import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createOrUpdateDriverSchema,
  CreateOrUpdateDriverSchema,
  DriverSearchData,
} from "@monorepo/schemas";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RHFTextField } from "../hook-form";
import { FormDialogProps } from "./type";

function DriverFormDialog({
  isEdit = false,
  initialValue,
  open,
  onOpenChange,
  submit,
}: FormDialogProps<DriverSearchData, CreateOrUpdateDriverSchema>) {
  const defaultValues: CreateOrUpdateDriverSchema = {
    name: "",
    phone: "",
    idCard: "",
  };

  const form = useForm<CreateOrUpdateDriverSchema>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(createOrUpdateDriverSchema),
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (initialValue) {
      setValue("name", initialValue.name);
      setValue("phone", initialValue.phone);
      setValue("idCard", initialValue.idCard);
    }

    return () => {
      form.reset(defaultValues);
    };
  }, [initialValue]);

  const onSubmit = handleSubmit(async (data) => {
    await submit(data);
    form.reset(defaultValues);
  });

  return (
    <>
      <Form {...form}>
        <Dialog open={open} onOpenChange={onOpenChange}>
          {!isEdit && (
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <PlusIcon />
                <span className="hidden lg:inline">Add Driver</span>
              </Button>
            </DialogTrigger>
          )}
          <DialogContent
            aria-describedby="Broker form"
            className="sm:max-w-4xl"
          >
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{isEdit ? "Edit" : "Add"} Driver</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-4 py-7">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <RHFTextField
                    name="name"
                    label="Name"
                    placeholder="Enter your name"
                    autoComplete="off"
                  />

                  <RHFTextField
                    name="phone"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    autoComplete="off"
                  />

                  <RHFTextField
                    name="idCard"
                    label="ID Card"
                    placeholder="Enter your ID Card"
                    autoComplete="off"
                  />
                </div>
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

export default DriverFormDialog;
