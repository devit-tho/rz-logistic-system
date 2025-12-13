import { truckingType } from "@monorepo/entities";
import { z } from "zod";
import { cargoSchema } from "./cargo.schema";
import { driverSchema } from "./driver.schema";
import { paginationResponse, searchSchema } from "./search.schema";
import { shipmentSchema } from "./shipment.schema";
import { supplierSchema } from "./supplier.schema";
import { ObjectIdSchema, validateDate } from "./utils";

export const truckingTypeEnum = z.enum([
  truckingType.CONTAINER,
  truckingType.FLATBED,
  truckingType.REEFER,
  truckingType.BOX_TRUCK,
  truckingType.HEAVY_HAUL,
  truckingType.TIPPER,
  truckingType.CAR_CARRIER,
  truckingType.CROSS_BORDER,
  truckingType.LTL,
  truckingType.FTL,
  truckingType.LAST_MILE,
  truckingType.TANKER,
  truckingType.LOWBED,
  truckingType.SIDE_LOADER,
  truckingType.HOTSHOT,
]);

export const truckingSchema = z.object({
  id: ObjectIdSchema(),
  truckingType: truckingTypeEnum,
  truckPlateNumber: z
    .string("Truck plate number is required")
    .min(2, "Truck plate number must be at least 2 characters"),
  fee: z.number("Fee is required").nonnegative("Fee must be a positive number"),
  jobsite: z.string().nullable(),
  pickedUpDate: validateDate().nullable(),
  arrivedDate: validateDate().nullable(),
  unloadedDate: validateDate().nullable(),
  truckStandby: z.string().nullable(),
  // packages: z
  //   .number("Packages must be a number")
  //   .nonnegative("Packages must be a positive number"),
  isLost: z.boolean(),
  isDamaged: z.boolean(),
  returnEmptyToDepotDate: validateDate().nullable(),
  remark: z.string().nullable(),
  userId: ObjectIdSchema(),
  driverId: ObjectIdSchema({
    required: "Driver must have relation to another entity",
  }).nullable(),
  shipmentId: ObjectIdSchema({
    required: "Shipment must have relation to another entity",
  }),
  supplierId: ObjectIdSchema({
    required: "Supplier must have relation to another entity",
  }),
  cargoId: ObjectIdSchema({
    required: "Cargo must have relation to another entity",
  }),
  createdAt: z.date(),
});

export const createOrUpdateTruckingSchema = truckingSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const truckingSearchData = truckingSchema.extend({
  cargo: cargoSchema.pick({
    name: true,
    quantity: true,
    containerNo: true,
    containerSealNumber: true,
    containerType: true,
    grossweight: true,
  }),
  supplier: supplierSchema.pick({ organization: true }),
  shipment: shipmentSchema.pick({ name: true }),
  driver: driverSchema.pick({
    name: true,
  }),
});

export const truckingSearchSchema = searchSchema.extend({});

export const truckingSearchResultSchema =
  paginationResponse(truckingSearchData);

export type TruckingSearchData = z.infer<typeof truckingSearchData>;

export type TruckingSearchSchema = z.output<typeof truckingSearchSchema>;

export type CreateOrUpdateTruckingSchema = z.infer<
  typeof createOrUpdateTruckingSchema
>;

export type TruckingSearchResult = z.infer<typeof truckingSearchResultSchema>;

export type TruckingSchema = z.infer<typeof truckingSchema>;
