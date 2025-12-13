import { z } from "zod";
import { contactSchema, createOrUpdateContactSchema } from "./contact.schema";
import { paginationResponse, searchSchema } from "./search.schema";
import { ObjectIdSchema } from "./utils";

export const shippingLineSchema = z.object({
  id: ObjectIdSchema(),
  organization: z
    .string("Organization is required")
    .min(3, "Organization must be at least 3 characters"),
  phone: z.string().nullable(),
  code: z.string().nullable(),
  address: z.string().nullable(),
  email: z.email().nullable(),
  website: z.string().nullable(),
  fax: z.string().nullable(),
  contactId: ObjectIdSchema(),
  userId: ObjectIdSchema(),
  createdAt: z.date(),
});

export const createOrUpdateShippingLineSchema = shippingLineSchema
  .omit({
    id: true,
    userId: true,
    contactId: true,
    createdAt: true,
  })
  .extend({
    contact: createOrUpdateContactSchema,
  });

export const shippingLineSearchData = shippingLineSchema.extend({
  contact: contactSchema,
});

export const shippingLineSearchSchema = searchSchema.extend({});

export const shippingLineSearchResultSchema = paginationResponse(
  shippingLineSearchData
);

export type ShippingLineSearchData = z.infer<typeof shippingLineSearchData>;

export type ShippingLineSearchSchema = z.output<
  typeof shippingLineSearchSchema
>;

export type CreateOrUpdateShippingLineSchema = z.output<
  typeof createOrUpdateShippingLineSchema
>;

export type ShippingLineSearchResult = z.output<
  typeof shippingLineSearchResultSchema
>;

export type ShippingLineSchema = z.infer<typeof shippingLineSchema>;
