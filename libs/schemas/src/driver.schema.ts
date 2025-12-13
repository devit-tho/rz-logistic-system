import { z } from "zod";
import { paginationResponse, searchSchema } from "./search.schema";
import { ObjectIdSchema } from "./utils";

export const driverSchema = z.object({
  id: ObjectIdSchema(),
  name: z.string().min(3, "Name must be 3 characters above"),
  idCard: z.string().min(10, "ID card must be 10 characters above"),
  phone: z.string().min(10, "Phone number must be 7 characters above"),
  code: z.string(),
  createdAt: z.date(),
});

export const createOrUpdateDriverSchema = driverSchema.omit({
  id: true,
  createdAt: true,
  code: true,
});

export const driverLoginSchema = driverSchema.pick({
  code: true,
});

export const driverSearchData = driverSchema.extend({});

export const driverSearchSchema = searchSchema.extend({});

export const driverSearchResultSchema = paginationResponse(driverSearchData);

export type DriverSearchResult = z.infer<typeof driverSearchResultSchema>;

export type CreateOrUpdateDriverSchema = z.infer<
  typeof createOrUpdateDriverSchema
>;

export type DriverLoginSchema = z.infer<typeof driverLoginSchema>;

export type DriverSearchSchema = z.infer<typeof driverSearchSchema>;

export type DriverSearchData = z.infer<typeof driverSearchData>;

export type DriverSchema = z.infer<typeof driverSchema>;
