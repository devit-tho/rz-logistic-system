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
  createOrUpdateShippingLineSchema,
  CreateOrUpdateShippingLineSchema,
  ShippingLineSearchData,
} from "@monorepo/schemas";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "../ui/separator";
import ContactForm from "./contact-form";
import { FormDialogProps } from "./type";

function ShippingLineFormDialog({
  isEdit = false,
  initialValue,
  open,
  onOpenChange,
  submit,
}: FormDialogProps<ShippingLineSearchData, CreateOrUpdateShippingLineSchema>) {
  const defaultValues: CreateOrUpdateShippingLineSchema = {
    organization: "",
    email: null,
    fax: null,
    website: null,
    address: null,
    phone: null,
    code: null,
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

  const form = useForm<CreateOrUpdateShippingLineSchema>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(createOrUpdateShippingLineSchema),
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
      setValue("phone", initialValue.phone);
      setValue("address", initialValue.address);
      setValue("fax", initialValue.fax);
      setValue("website", initialValue.website);
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
                <span className="hidden lg:inline">Add Shipping Line</span>
              </Button>
            </DialogTrigger>
          )}
          <DialogContent
            aria-describedby="Shipping Line form"
            className="w-full sm:max-w-4xl"
          >
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {isEdit ? "Edit" : "Add"} Shipping Line
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-3 py-4">
                <div className="flex flex-col gap-y-2">
                  <h2 className="font-semibold">Shipping Line Details</h2>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <RHFTextField
                      name="organization"
                      label="Organization"
                      placeholder="Enter your organization"
                      autoComplete="off"
                    />

                    <RHFTextField
                      name="email"
                      label="Email"
                      placeholder="Enter your email"
                      autoComplete="off"
                    />

                    <RHFTextField
                      name="fax"
                      label="Fax"
                      placeholder="Enter your fax"
                      autoComplete="off"
                    />

                    <RHFTextField
                      name="website"
                      label="Website"
                      placeholder="Enter your website"
                      autoComplete="off"
                    />

                    <div className="col-span-full">
                      <RHFTextField
                        name="address"
                        label="Address"
                        placeholder="Enter your address"
                        autoComplete="off"
                      />
                    </div>

                    <RHFTextField
                      name="phone"
                      label="Phone"
                      placeholder="Enter your phone number"
                      autoComplete="off"
                    />

                    <RHFTextField
                      name="code"
                      label="Code"
                      placeholder="Enter your code"
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

export default ShippingLineFormDialog;
