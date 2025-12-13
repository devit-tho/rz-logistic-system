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
  createOrUpdateSupplierSchema,
  CreateOrUpdateSupplierSchema,
  SupplierSearchData,
} from "@monorepo/schemas";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RHFTextField } from "../hook-form";
import { Separator } from "../ui/separator";
import ContactForm from "./contact-form";
import { FormDialogProps } from "./type";

function SupplierFormDialog({
  isEdit = false,
  initialValue,
  open,
  onOpenChange,
  submit,
}: FormDialogProps<SupplierSearchData, CreateOrUpdateSupplierSchema>) {
  const defaultValues: CreateOrUpdateSupplierSchema = {
    organization: "",
    address: null,
    email: null,
    phone: null,
    contact: {
      name: null,
      position: null,
      email: null,
      mobile: null,
      fax: null,
      skype: null,
      wechat: null,
      whatsapp: null,
      telegram: null,
    },
  };

  const form = useForm<CreateOrUpdateSupplierSchema>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(createOrUpdateSupplierSchema),
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (initialValue) {
      setValue("organization", initialValue.organization);
      setValue("email", initialValue.email);
      setValue("address", initialValue.address);
      setValue("phone", initialValue.phone);
      setValue("contact", initialValue.contact);
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
                <span className="hidden lg:inline">Add Supplier</span>
              </Button>
            </DialogTrigger>
          )}
          <DialogContent
            aria-describedby="Supplier form"
            className="sm:max-w-4xl"
          >
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{isEdit ? "Edit" : "Add"} Supplier</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-y-4 py-4">
                <div className="flex flex-col gap-y-2">
                  <h2 className="font-semibold">Supplier Details</h2>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <RHFTextField
                      name="organization"
                      label="Organization"
                      placeholder="Enter your organization"
                      autoComplete="off"
                    />

                    <RHFTextField
                      name="address"
                      label="Address"
                      placeholder="Enter your address"
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
                  </div>
                </div>

                <Separator />

                <ContactForm />
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

export default SupplierFormDialog;
