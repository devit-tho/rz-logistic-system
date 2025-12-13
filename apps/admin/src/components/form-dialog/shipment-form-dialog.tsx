import {
  useBrokers,
  // useCargos,
  useCustomers,
  useShippingLines,
} from "@/api";
import {
  RHFCombo,
  RHFDatePicker,
  RHFSelect,
  RHFTextField,
} from "@/components/hook-form";
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
import { shipmentStatus } from "@monorepo/entities";
import {
  createOrUpdateShipmentSchema,
  CreateOrUpdateShipmentSchema,
  ShipmentSchema,
} from "@monorepo/schemas";
import { capitalCase } from "change-case";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormDialogProps } from "./type";

function ShipmentFormDialog({
  isEdit = false,
  initialValue,
  open,
  onOpenChange,
  submit,
}: FormDialogProps<ShipmentSchema, CreateOrUpdateShipmentSchema>) {
  const { customersField } = useCustomers();
  // const { cargosField } = useCargos();
  const { shippingLinesField } = useShippingLines();
  const { brokersField } = useBrokers();

  const defaultValues: CreateOrUpdateShipmentSchema = {
    name: "",
    jobsheetNo: "",
    billOfLadingNo: "",
    packages: 0,
    etd: null,
    eta: null,
    totalM3: 0,
    totalContainers: 0,
    grossWeight: 0,
    completedDate: null,
    description: "",
    trackingNumber: null,
    reference: null,
    status: "PENDING",
    customerId: "",
    shippingLineId: null,
    brokerId: null,
  };

  const form = useForm<CreateOrUpdateShipmentSchema>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(createOrUpdateShipmentSchema),
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (initialValue) {
      setValue("name", initialValue.name);
      setValue("jobsheetNo", initialValue.jobsheetNo);
      setValue("billOfLadingNo", initialValue.billOfLadingNo);
      setValue("packages", initialValue.packages);
      setValue("etd", initialValue.etd ? new Date(initialValue.etd) : null);
      setValue("eta", initialValue.eta ? new Date(initialValue.eta) : null);
      setValue("totalM3", initialValue.totalM3);
      setValue("totalContainers", initialValue.totalContainers);
      setValue("grossWeight", initialValue.grossWeight);
      setValue(
        "completedDate",
        initialValue.completedDate
          ? new Date(initialValue.completedDate)
          : null,
      );
      setValue("description", initialValue.description);
      setValue("status", initialValue.status);
      setValue("customerId", initialValue.customerId);
      setValue("shippingLineId", initialValue.shippingLineId);
      setValue("brokerId", initialValue.brokerId);
    }
  }, [initialValue]);

  function handleDialog(v: boolean) {
    onOpenChange(v);
    if (!v) {
      form.reset(defaultValues);
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    await submit(data);
    reset(defaultValues);
  });

  return (
    <>
      <Form {...form}>
        <Dialog open={open} onOpenChange={handleDialog}>
          {!isEdit && (
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <PlusIcon />
                <span className="hidden lg:inline">Add Shipment</span>
              </Button>
            </DialogTrigger>
          )}

          <DialogContent
            aria-describedby="Shipment form"
            className="w-full md:max-w-3xl"
          >
            <form
              onSubmit={onSubmit}
              className="relative flex flex-col gap-y-3"
            >
              <DialogHeader>
                <DialogTitle>{isEdit ? "Edit" : "Add"} Shipment</DialogTitle>
              </DialogHeader>

              <div className="z-100 h-[75vh] overflow-y-scroll md:h-auto md:overflow-y-hidden md:px-0">
                <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-3">
                  <RHFTextField
                    name="name"
                    label="Name"
                    placeholder="Enter your name"
                  />

                  <RHFTextField
                    name="jobsheetNo"
                    label="Jobsheet No"
                    placeholder="Enter your Jobsheet No"
                  />

                  <RHFTextField
                    name="billOfLadingNo"
                    label="Bill Of Lading No"
                    placeholder="Enter your Bill Of Lading No"
                  />

                  <RHFTextField
                    name="packages"
                    label="Packages"
                    type="number"
                    placeholder="Enter your packages"
                  />

                  <RHFDatePicker name="etd" label="ETD" />

                  <RHFDatePicker name="eta" label="ETA" />

                  <RHFTextField
                    name="totalM3"
                    label="Total M³"
                    type="number"
                    placeholder="Enter your Total M3"
                  />

                  <RHFTextField
                    name="totalContainers"
                    label="Total Containers"
                    type="number"
                    placeholder="Enter your Total Containers"
                  />

                  <RHFTextField
                    name="grossWeight"
                    label="Gross Weight (kg)"
                    type="number"
                    placeholder="Enter your Gross Weight"
                  />

                  <RHFDatePicker name="completedDate" label="Completed Date" />

                  <RHFTextField
                    name="description"
                    label="Description"
                    placeholder="Enter your Description"
                  />

                  <RHFTextField
                    name="trackingNumber"
                    label="Tracking Number"
                    placeholder="Enter your Tracking Number"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <RHFCombo
                    name="customerId"
                    label="Customer"
                    options={customersField}
                  />

                  <RHFCombo
                    name="shippingLineId"
                    label="Shipping Line"
                    options={shippingLinesField}
                  />

                  <RHFCombo
                    name="brokerId"
                    label="Broker"
                    options={brokersField}
                  />

                  <RHFTextField
                    name="reference"
                    label="Reference"
                    placeholder="Enter your Reference"
                  />

                  <RHFSelect
                    name="status"
                    label="Status"
                    options={Object.values(shipmentStatus).map((status) => ({
                      value: status,
                      label: capitalCase(status),
                    }))}
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

export default ShipmentFormDialog;
