import { shipmentStatus } from "@monorepo/entities";
import { z } from "zod";
import { brokerSchema } from "./broker.schema";
import { customerSchema } from "./customer.schema";
import { paginationResponse, searchSchema } from "./search.schema";
import { shippingLineSchema } from "./shipping-line.schema";
import { userSchema } from "./user.schema";
import { ObjectIdSchema, validateDate } from "./utils";

export const shipmentEnum = z.enum([
  shipmentStatus.PENDING,
  shipmentStatus.DELIVERED,
  shipmentStatus.IN_TRANSIT,
  shipmentStatus.ON_HOLD,
  shipmentStatus.CANCELLED,
]);

export const shipmentSchema = z.object({
  id: ObjectIdSchema(),
  name: z
    .string("Name is required")
    .min(3, "Name must be at least 3 characters"),
  jobsheetNo: z.string().nullable(),
  billOfLadingNo: z.string().nullable(),
  packages: z
    .number("Packages is required")
    .nonnegative("Packages must be a positive number")
    .max(10000),
  etd: validateDate().nullable(),
  eta: validateDate().nullable(),
  totalM3: z
    .number("Total M\u00B3 is required")
    .nonnegative("Total M\u00B3 must be a positive number"),
  totalContainers: z
    .number("Total Containers is required")
    .nonnegative("Total Containers must be a positive number"),
  grossWeight: z
    .number("Gross Weight is required")
    .nonnegative("Gross Weight must be a positive number"),
  completedDate: validateDate().nullable(),
  description: z.string().nullable(),
  trackingNumber: z.string().nullable(),
  reference: z.string().nullable(),
  status: shipmentEnum,
  userId: ObjectIdSchema(),
  customerId: ObjectIdSchema({
    required: "Customer must have relation to another entity",
  }),
  shippingLineId: ObjectIdSchema().nullable(),
  brokerId: ObjectIdSchema().nullable(),
  createdAt: z.date(),
});

export const createOrUpdateShipmentSchema = shipmentSchema.omit({
  id: true,
  createdAt: true,
  userId: true,
});

export const shipmentSearchData = shipmentSchema.extend({
  user: userSchema.pick({ name: true }),
  broker: brokerSchema.pick({ name: true }),
  customer: customerSchema.pick({ organization: true }),
  shippingLine: shippingLineSchema.pick({ organization: true }),
});

export const shipmentSearchSchema = searchSchema.extend({
  status: shipmentEnum.nullable().optional(),
});

export const shipmentSearchResultSchema =
  paginationResponse(shipmentSearchData);

export type ShipmentSearchSchema = z.output<typeof shipmentSearchSchema>;

export type CreateOrUpdateShipmentSchema = z.infer<
  typeof createOrUpdateShipmentSchema
>;

export type ShipmentSearchData = z.infer<typeof shipmentSearchData>;

export type ShipmentSearchResult = z.infer<typeof shipmentSearchResultSchema>;

export type ShipmentSchema = z.infer<typeof shipmentSchema>;
