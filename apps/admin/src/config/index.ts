import { z } from "zod";

// ----------------------------------------------------------------------

const envVarsSchema = z.object({
  ADMIN_API: z.string().url(),
  APP_MODE: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const env = envVarsSchema.safeParse(process.env);

if (!env.success) {
  console.error("Environment variable validation failed:", env.error.format());
  throw new Error(
    "Invalid environment variables. Please check your .env file.",
  );
}

export default {
  mode: env.data.APP_MODE,
  admin_api: env.data.ADMIN_API,
  date_format: "dd-MMM-yyyy",
};
