import { z } from "zod";

export const MediaCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  description: z.string().optional().nullable(),
});

export type MediaCategoryType = z.infer<typeof MediaCategorySchema>;
