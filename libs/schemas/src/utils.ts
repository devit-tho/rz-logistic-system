import { z } from "zod";

interface ObjectIdErrorMessages {
  required?: string;
  min?: string;
  invalid?: string;
}

export function validateDate(message?: string) {
  return z.union([z.date(message), z.iso.datetime(message)]);
}

export function ObjectIdSchema(errors?: ObjectIdErrorMessages) {
  return z
    .string({ error: errors?.required ?? "ObjectId is required" })
    .min(1, { error: errors?.min ?? "ObjectId cannot be empty" })
    .regex(/^[0-9a-fA-F]{24}$/, {
      error: errors?.invalid ?? "Invalid ObjectId",
    });
}
