import { z } from "zod";
import { contactSchema, createOrUpdateContactSchema } from "./contact.schema";
import { paginationResponse, searchSchema } from "./search.schema";
import { ObjectIdSchema } from "./utils";

export const customerSchema = z.object({
  id: ObjectIdSchema(),
  organization: z.string().nullable(),
  email: z.email("Must be a valid email").nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  contactId: ObjectIdSchema(),
  userId: ObjectIdSchema(),
  createdAt: z.date(),
});

export const createOrUpdateCustomerSchema = customerSchema
  .omit({
    id: true,
    createdAt: true,
    userId: true,
    contactId: true,
  })
  .extend({
    contact: createOrUpdateContactSchema,
  });

export const customerSearchData = customerSchema.extend({
  contact: contactSchema,
});

export const customerSearchSchema = searchSchema.extend({});

export const customerSearchResultSchema =
  paginationResponse(customerSearchData);

export type CustomerSearchData = z.infer<typeof customerSearchData>;

export type CustomerSearchSchema = z.output<typeof customerSearchSchema>;

export type CreateOrUpdateCustomerSchema = z.output<
  typeof createOrUpdateCustomerSchema
>;

export type CustomerSearchResult = z.output<typeof customerSearchResultSchema>;

export type CustomerSchema = z.infer<typeof customerSchema>;
