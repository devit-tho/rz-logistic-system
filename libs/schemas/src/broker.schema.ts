import { z } from "zod";
import { paginationResponse, searchSchema } from "./search.schema";
import { ObjectIdSchema } from "./utils";

export const brokerSchema = z.object({
  id: ObjectIdSchema(),
  organization: z
    .string("Organization is required")
    .min(1, { message: "Organization must be at least 1 character" }),
  address: z.string().nullable(),
  name: z
    .string("Name is required")
    .min(1, { message: "Name must be at least 4 characters" }),
  email: z.email().nullable(),
  phone: z.string().nullable(),
  createdAt: z.date(),
  userId: ObjectIdSchema(),
});

export const createOrUpdateBrokerSchema = brokerSchema.omit({
  id: true,
  createdAt: true,
  userId: true,
});

export const brokerSearchData = brokerSchema;

export const brokerSearchSchema = searchSchema.extend({});

export const brokerSearchResultSchema = paginationResponse(brokerSearchData);

export type BrokerSearchData = z.infer<typeof brokerSearchData>;

export type BrokerSearchSchema = z.output<typeof brokerSearchSchema>;

export type CreateOrUpdateBrokerSchema = z.output<
  typeof createOrUpdateBrokerSchema
>;

export type BrokerSearchResult = z.output<typeof brokerSearchResultSchema>;
