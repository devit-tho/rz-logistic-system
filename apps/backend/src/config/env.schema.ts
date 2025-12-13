import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000), // `coerce: true` converts string to number
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  TIMEZONE: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
