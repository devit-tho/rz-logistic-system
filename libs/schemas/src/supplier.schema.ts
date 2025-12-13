import { z } from "zod";
import { contactSchema, createOrUpdateContactSchema } from "./contact.schema";
import { paginationResponse, searchSchema } from "./search.schema";
import { ObjectIdSchema } from "./utils";

export const supplierSchema = z.object({
  id: ObjectIdSchema(),
  organization: z
    .string("Organization is required")
    .min(3, "Organization must be at least 3 characters"),
  address: z.string().nullable(),
  email: z.email("Must be a valid email").nullable(),
  phone: z.string().nullable(),
  contactId: ObjectIdSchema(),
  userId: ObjectIdSchema(),
  createdAt: z.date(),
});

export const createOrUpdateSupplierSchema = supplierSchema
  .omit({
    id: true,
    createdAt: true,
    userId: true,
    contactId: true,
  })
  .extend({
    contact: createOrUpdateContactSchema,
  });

export const supplierSearchData = supplierSchema.extend({
  contact: contactSchema,
});

export const supplierSearchSchema = searchSchema.extend({});

export const supplierSearchResultSchema =
  paginationResponse(supplierSearchData);

export type SupplierSearchData = z.infer<typeof supplierSearchData>;

export type SupplierSearchSchema = z.output<typeof supplierSearchSchema>;

export type CreateOrUpdateSupplierSchema = z.output<
  typeof createOrUpdateSupplierSchema
>;

export type SupplierSearchResult = z.output<typeof supplierSearchResultSchema>;

export type SupplierSchema = z.output<typeof supplierSchema>;
