import { z } from "zod";
import { ObjectIdSchema } from "./utils";

export const contactSchema = z.object({
  id: ObjectIdSchema(),
  name: z.string().nullable(),
  position: z.string().nullable(),
  email: z.email().nullable(),
  mobile: z.string().nullable(),
  fax: z.string().nullable(),
  skype: z.string().nullable(),
  wechat: z.string().nullable(),
  whatsapp: z.string().nullable(),
  telegram: z.string().nullable(),
});

export const createOrUpdateContactSchema = contactSchema.omit({
  id: true,
});

export type CreateOrUpdateContactSchema = z.infer<
  typeof createOrUpdateContactSchema
>;
