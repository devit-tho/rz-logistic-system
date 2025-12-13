import { RHFTextField } from "@/components/hook-form";
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
  BrokerSearchData,
  createOrUpdateBrokerSchema,
  CreateOrUpdateBrokerSchema,
} from "@monorepo/schemas";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormDialogProps } from "./type";

function BrokerFormDialog({
  isEdit = false,
  initialValue,
  open,
  onOpenChange,
  submit,
}: FormDialogProps<BrokerSearchData, CreateOrUpdateBrokerSchema>) {
  const defaultValues: CreateOrUpdateBrokerSchema = {
    organization: "",
    name: "",
    address: null,
    email: null,
    phone: null,
  };

  const form = useForm<CreateOrUpdateBrokerSchema>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(createOrUpdateBrokerSchema),
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (initialValue) {
      setValue("organization", initialValue.organization);
      setValue("name", initialValue.name);
      setValue("email", initialValue.email);
      setValue("phone", initialValue.phone);
      setValue("address", initialValue.address);
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
                <span className="hidden lg:inline">Add Broker</span>
              </Button>
            </DialogTrigger>
          )}
          <DialogContent aria-describedby="Broker form">
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{isEdit ? "Edit" : "Add"} Broker</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-3 py-4">
                <RHFTextField
                  name="organization"
                  label="Organization"
                  placeholder="Enter your organization"
                />

                <RHFTextField
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
                  autoComplete="off"
                />

                <RHFTextField
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  autoComplete="off"
                />

                <RHFTextField
                  name="phone"
                  label="Phone"
                  placeholder="Enter your phone number"
                  autoComplete="off"
                />

                <RHFTextField
                  name="address"
                  label="Address"
                  placeholder="Enter your address"
                  autoComplete="off"
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

export default BrokerFormDialog;
