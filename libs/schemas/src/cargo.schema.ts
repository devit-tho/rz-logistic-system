import { cargoType, containerSize, containerType } from "@monorepo/entities";
import { z } from "zod";
import { paginationResponse, searchSchema } from "./search.schema";
import { shipmentSchema } from "./shipment.schema";
import { ObjectIdSchema } from "./utils";

export const cargoTypeEnum = z.enum([
  cargoType.CONTAINER,
  cargoType.BREAK_BULK,
  cargoType.OUT_OF_GAUGE,
  cargoType.GENERAL,
  cargoType.HAZARDOUS,
  cargoType.REFRIGERATED,
  cargoType.OVERSIZED,
  cargoType.LIQUID,
  cargoType.FRAGILE,
  cargoType.OTHER,
]);

export const containerSizeEnum = z.enum([
  containerSize.FT20,
  containerSize.FT40,
  containerSize.FT45,
]);

export const containerTypeEnum = z.enum([
  containerType.DRY,
  containerType.REEFER,
  containerType.OPEN_TOP,
  containerType.FLAT_RACK,
  containerType.TANK,
]);

export const cargoSchema = z.object({
  id: ObjectIdSchema(),
  name: z
    .string("Name is required")
    .min(3, "Name must be at least 3 characters"),
  type: cargoTypeEnum.nullable(),
  containerNo: z.string().nullable(),
  containerSealNumber: z.string().nullable(),
  containerSize: containerSizeEnum.nullable(),
  containerType: containerTypeEnum.nullable(),
  description: z.string().nullable(),
  hsCode: z.string().nullable(),
  quantity: z
    .number("Quantity is required")
    .min(0, "Quantity must be a positive number"),
  value: z
    .number("Value is required")
    .min(0, "Value must be a positive number"),
  origin: z.string().nullable(),
  destination: z.string().nullable(),
  length: z
    .number("Length is required")
    .nonnegative("Length must be a positive number"),
  width: z.number("Width is required").min(0, "Width must be a positive"),
  height: z.number("Height is required").min(0, "Height must be a positive"),
  grossweight: z
    .number("Grossweight is required")
    .min(0, "Grossweight must be a positive number"),
  cbm: z.number("CBM is required").nonnegative("CBM must be a positive number"),
  shipmentId: ObjectIdSchema({
    required: "Shipment must have relation to another entity",
  }),
  userId: ObjectIdSchema(),
  createdAt: z.date(),
});

export const createOrUpdateCargoSchema = cargoSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const cargoSearchData = cargoSchema.extend({
  shipment: shipmentSchema.pick({ name: true }),
});

export const cargoSearchSchema = searchSchema.extend({});

export const cargoSearchResultSchema = paginationResponse(cargoSearchData);

export type CargoSearchData = z.infer<typeof cargoSearchData>;

export type CargoSearchSchema = z.output<typeof cargoSearchSchema>;

export type CreateOrUpdateCargoSchema = z.infer<
  typeof createOrUpdateCargoSchema
>;

export type CargoSearchResult = z.infer<typeof cargoSearchResultSchema>;

export type CargoSchema = z.infer<typeof cargoSchema>;
