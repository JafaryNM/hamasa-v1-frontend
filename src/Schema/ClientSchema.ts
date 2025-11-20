import { z } from "zod";

export const UserRoleEnum = z.enum([
  "super_admin",
  "reviewer",
  "data_clerk",
  "org_admin",
  "org_user",
]);

export const ClientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  name_of_organisation: z.string().min(1, "Organisation is required"),
  country: z.string().min(1, "Country is required"),
  role: UserRoleEnum,
});

export type ClientType = z.infer<typeof ClientSchema>;
