import { z } from "zod";

export function paginationResponse<T extends z.ZodTypeAny>(schema: T) {
  return z.object({
    datas: z.array(schema),
    meta: z.object({
      page: z.number().int(),
      totalPages: z.number().int(),
      totalResources: z.number().int(),
    }),
  });
}

export const searchSchema = z.object({
  search: z.string().nullable(),
  page: z
    .string()
    .transform((v) => {
      const parsed = parseInt(v, 10);
      return isNaN(parsed) ? 1 : parsed;
    })
    .pipe(z.number().int().min(1))
    .nullable(),
  pageSize: z
    .string()
    .transform((v) => {
      const parsed = parseInt(v, 10);
      return isNaN(parsed) ? 1 : parsed;
    })
    .pipe(z.number().int().min(1))
    .nullable(),
});

export type SearchSchema = z.infer<typeof searchSchema>;
