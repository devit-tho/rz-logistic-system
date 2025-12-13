import { envSchema } from './env.schema';

// This line will throw an error if validation fails
export const env = envSchema.safeParse(process.env);
