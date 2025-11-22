import { z } from "zod";

export const MediaSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  category_name: z.string().min(1, "Media category is required"),
});

export type MediaType = z.infer<typeof MediaSchema>;
