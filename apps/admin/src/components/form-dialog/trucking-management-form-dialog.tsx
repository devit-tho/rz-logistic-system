import { useCargos, useDrivers, useShipments, useSuppliers } from "@/api";
import {
  RHFCheckbox,
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
import { truckingType } from "@monorepo/entities";
import {
  CreateOrUpdateTruckingSchema,
  createOrUpdateTruckingSchema,
  TruckingSearchData,
} from "@monorepo/schemas";
import { capitalCase } from "change-case";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SelectOption } from "../hook-form/rhf-select";
import { Separator } from "../ui/separator";
import { FormDialogProps } from "./type";

function TruckingManagementFormDialog({
  isEdit = false,
  initialValue,
  open,
  onOpenChange,
  submit,
}: FormDialogProps<TruckingSearchData, CreateOrUpdateTruckingSchema>) {
  const { cargosField } = useCargos();
  const { suppliersField } = useSuppliers();
  const { shipmentsField } = useShipments();
  const { driversField } = useDrivers();

  const defaultValues: CreateOrUpdateTruckingSchema = {
    driverId: null,
    truckingType: "CONTAINER",
    truckPlateNumber: "",
    fee: 0,
    jobsite: null,
    pickedUpDate: null,
    arrivedDate: null,
    unloadedDate: null,
    truckStandby: null,
    isLost: false,
    isDamaged: false,
    returnEmptyToDepotDate: null,
    remark: "",
    cargoId: "",
    supplierId: "",
    shipmentId: "",
  };

  const form = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(createOrUpdateTruckingSchema),
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (initialValue) {
      setValue("truckingType", initialValue.truckingType);
      setValue("driverId", initialValue.driverId);
      setValue("truckPlateNumber", initialValue.truckPlateNumber);
      setValue("fee", initialValue.fee);
      setValue("jobsite", initialValue.jobsite);
      setValue(
        "pickedUpDate",
        initialValue.pickedUpDate ? new Date(initialValue.pickedUpDate) : null,
      );
      setValue(
        "arrivedDate",
        initialValue.arrivedDate ? new Date(initialValue.arrivedDate) : null,
      );
      setValue(
        "unloadedDate",
        initialValue.unloadedDate ? new Date(initialValue.unloadedDate) : null,
      );
      setValue("truckStandby", initialValue.truckStandby);
      setValue("isLost", initialValue.isLost);
      setValue("isDamaged", initialValue.isDamaged);
      setValue(
        "returnEmptyToDepotDate",
        initialValue.returnEmptyToDepotDate
          ? new Date(initialValue.returnEmptyToDepotDate)
          : null,
      );
      setValue("remark", initialValue.remark);
      setValue("cargoId", initialValue.cargoId ?? 0);
      setValue("supplierId", initialValue.supplierId ?? 0);
      setValue("shipmentId", initialValue.shipmentId ?? 0);
    }

    return () => {
      form.reset(defaultValues);
    };
  }, [initialValue]);

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
    if (!open) {
      form.reset(defaultValues);
    }
  }

  const onSubmit = handleSubmit(async (data: CreateOrUpdateTruckingSchema) => {
    await submit(data);
    form.reset(defaultValues);
  });

  return (
    <>
      <Form {...form}>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          {!isEdit && (
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="cursor-pointer">
                <PlusIcon />
                <span className="hidden lg:inline">
                  Add Trucking Management
                </span>
              </Button>
            </DialogTrigger>
          )}
          <DialogContent
            aria-describedby="Shipping Line form"
            className="w-full sm:max-w-5xl"
          >
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {isEdit ? "Edit" : "Add"} Trucking Management
                </DialogTitle>
              </DialogHeader>

              <div className="flex h-[80vh] flex-col gap-y-6 overflow-y-scroll py-6 sm:h-auto sm:overflow-y-hidden">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <RHFCombo
                    name="shipmentId"
                    label="Shipment"
                    options={shipmentsField}
                  />

                  <RHFCombo
                    name="supplierId"
                    label="Supplier"
                    options={suppliersField}
                  />

                  <RHFCombo
                    name="cargoId"
                    label="Cargo"
                    options={cargosField}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <RHFCombo
                    name="driverId"
                    label="Driver"
                    options={driversField}
                  />

                  <RHFSelect
                    name="truckingType"
                    label="Trucking Type"
                    options={Object.values(truckingType).map<SelectOption>(
                      (type) => ({
                        value: type,
                        label: capitalCase(type),
                      }),
                    )}
                  />

                  <RHFTextField
                    name="truckPlateNumber"
                    label="Truck Plate Number"
                    placeholder="Enter your truck plate number"
                  />

                  <RHFTextField
                    name="fee"
                    label="Fee"
                    placeholder="Enter your fee"
                    type="number"
                  />
                  <RHFTextField
                    name="jobsite"
                    label="Jobsite"
                    placeholder="Jobsite"
                  />
                  <RHFDatePicker name="pickedUpDate" label="Picked Up Date" />
                  <RHFDatePicker name="arrivedDate" label="Arrived Date" />
                  <RHFDatePicker name="unloadedDate" label="Unloaded Date" />
                  <RHFTextField
                    name="truckStandby"
                    label="Truck Standby"
                    placeholder="Enter your truck standby"
                  />
                  <RHFDatePicker
                    name="returnEmptyToDepotDate"
                    label="Return Empty To Depot Date"
                  />
                  <RHFTextField
                    name="remark"
                    label="Remark"
                    placeholder="Remark"
                  />
                  <div className="col-span-full flex items-center justify-end gap-2">
                    <RHFCheckbox name="isLost" label="Cargo Lost" />

                    <RHFCheckbox name="isDamaged" label="Cargo Damaged" />
                  </div>
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

export default TruckingManagementFormDialog;
