import { useShipments } from "@/api";
import { RHFCombo, RHFSelect, RHFTextField } from "@/components/hook-form";
import { SelectOption } from "@/components/hook-form/rhf-select";
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
import { cargoType, containerSize, containerType } from "@monorepo/entities";
import {
  CargoSearchData,
  createOrUpdateCargoSchema,
  CreateOrUpdateCargoSchema,
} from "@monorepo/schemas";
import { capitalCase } from "change-case";
import upperCase from "lodash/upperCase";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormDialogProps } from "./type";

function CargoFormDialog({
  isEdit = false,
  initialValue,
  open,
  onOpenChange,
  submit,
}: FormDialogProps<CargoSearchData, CreateOrUpdateCargoSchema>) {
  const { shipmentsField } = useShipments();

  const defaultValues: CreateOrUpdateCargoSchema = {
    name: "",
    type: null,
    containerNo: null,
    containerSealNumber: null,
    containerSize: null,
    containerType: null,
    description: null,
    hsCode: null,
    quantity: 0,
    value: 0,
    origin: null,
    destination: null,
    length: 0,
    width: 0,
    height: 0,
    cbm: 0,
    shipmentId: "",
    grossweight: 0,
  };

  const form = useForm<CreateOrUpdateCargoSchema>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(createOrUpdateCargoSchema),
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (initialValue) {
      setValue("name", initialValue.name ?? "");
      setValue("type", initialValue.type);
      setValue("containerNo", initialValue.containerNo);
      setValue("containerSealNumber", initialValue.containerSealNumber);
      setValue("containerSize", initialValue.containerSize);
      setValue("containerType", initialValue.containerType);
      setValue("description", initialValue.description);
      setValue("hsCode", initialValue.hsCode ?? "");
      setValue("quantity", initialValue.quantity);
      setValue("value", initialValue.value);
      setValue("origin", initialValue.origin);
      setValue("destination", initialValue.destination);
      setValue("length", initialValue.length);
      setValue("width", initialValue.width);
      setValue("height", initialValue.height);
      setValue("grossweight", initialValue.grossweight);
      setValue("cbm", initialValue.cbm);
      setValue("shipmentId", initialValue.shipmentId);
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
                <span className="hidden lg:inline">Add Cargo</span>
              </Button>
            </DialogTrigger>
          )}
          <DialogContent
            aria-describedby="Cargo form"
            className="w-full sm:max-w-4xl"
          >
            <form onSubmit={onSubmit}>
              <DialogHeader>
                <DialogTitle>{isEdit ? "Edit" : "Add"} Cargo</DialogTitle>
              </DialogHeader>

              <div className="grid gap-3 py-4 sm:grid-cols-2 lg:grid-cols-3">
                <RHFCombo
                  name="shipmentId"
                  label="Shipment"
                  options={shipmentsField}
                />

                <RHFTextField
                  name="name"
                  label="Cargo Name"
                  placeholder="Enter your name"
                />

                <RHFSelect
                  name="type"
                  label="Cargo Type"
                  options={Object.values(cargoType).map<SelectOption>(
                    (type) => ({
                      value: type,
                      label: capitalCase(type),
                    }),
                  )}
                />

                <RHFTextField
                  name="containerNo"
                  label="Container No"
                  placeholder="Enter your container no"
                />

                <RHFTextField
                  name="containerSealNumber"
                  label="Container seal number"
                  placeholder="Enter your container seal number"
                />

                <RHFSelect
                  name="containerType"
                  label="Container Type"
                  options={Object.values(containerType).map<SelectOption>(
                    (type) => ({
                      value: type,
                      label: capitalCase(type),
                    }),
                  )}
                />

                <RHFSelect
                  name="containerSize"
                  label="Container Size"
                  options={Object.values(containerSize).map<SelectOption>(
                    (size) => ({
                      value: size,
                      label: upperCase(size),
                    }),
                  )}
                />

                <RHFTextField
                  name="description"
                  label="Description"
                  placeholder="Enter your description"
                />

                <RHFTextField
                  name="hsCode"
                  label="HS Code"
                  placeholder="HS Code"
                />

                <RHFTextField
                  name="quantity"
                  label="Quantity"
                  type="number"
                  placeholder="Enter your quantity"
                />

                <RHFTextField
                  name="value"
                  label="Value"
                  type="number"
                  placeholder="Enter your value"
                />

                <RHFTextField
                  name="origin"
                  label="Origin"
                  placeholder="Origin"
                />

                <RHFTextField
                  name="destination"
                  label="Destination"
                  placeholder="Destination"
                />

                <RHFTextField
                  name="length"
                  label="Length (m)"
                  placeholder="Enter your Length cargo"
                  type="number"
                />

                <RHFTextField
                  name="width"
                  label="Width (m)"
                  placeholder="Enter your width cargo"
                  type="number"
                />

                <RHFTextField
                  name="height"
                  label="Height (m)"
                  placeholder="Enter your height cargo"
                  type="number"
                />

                <RHFTextField
                  name="grossweight"
                  label="Gross Weight (kg)"
                  placeholder="Enter your gross weight"
                  type="number"
                />

                <RHFTextField
                  name="cbm"
                  label="CBM (m³)"
                  placeholder="Enter your cbm cargo"
                  type="number"
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

export default CargoFormDialog;
