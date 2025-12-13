import { z } from "zod";
import { paginationResponse, searchSchema } from "./search.schema";
import { ObjectIdSchema } from "./utils";

export const userSchema = z.object({
  id: ObjectIdSchema(),
  name: z
    .string("Name is required")
    .min(4, { message: "Name must be at least 2 characters" }),
  email: z.email("Email is Required").trim(),
  password: z.string("Password is required"),
  imageUrl: z.url({ message: "Must be a valid url" }).nullable(),
  isSuperAdmin: z.boolean(),
  lastLogin: z.date().nullable(),
  loginAttempts: z.number().catch(0),
  lockedUntil: z.date().nullable(),
  createdAt: z.date(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  imageUrl: true,
  isSuperAdmin: true,
  lastLogin: true,
  lockedUntil: true,
  loginAttempts: true,
  createdAt: true,
});

export const updateUserSchema = userSchema.omit({
  id: true,
  password: true,
  createdAt: true,
  lastLogin: true,
  lockedUntil: true,
  loginAttempts: true,
  isSuperAdmin: true,
});

export const loginSchema = userSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    device: z.string("Device is required"),
  });

export const changePasswordSchema = userSchema
  .pick({
    password: true,
  })
  .extend({
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Confirm password does not match",
  });

export const resetPasswordSchema = userSchema.pick({
  id: true,
  password: true,
});

export const changeUserEmailSchema = userSchema
  .pick({
    id: true,
    email: true,
  })
  .extend({
    newEmail: z.email("Must be a valid email").trim(),
  });

export const userSearchData = userSchema.omit({
  password: true,
});

export const userSearchSchema = searchSchema.extend({});

export const userSearchResultSchema = paginationResponse(userSearchData);

export type CreateUserSchema = z.output<typeof createUserSchema>;

export type UserSearchSchema = z.output<typeof userSearchSchema>;

export type UserSearchResult = z.output<typeof userSearchResultSchema>;

export type UserSchema = z.output<typeof userSchema>;

export type LoginSchema = z.infer<typeof loginSchema>;

export type ChangeUserEmailSchema = z.infer<typeof changeUserEmailSchema>;

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
