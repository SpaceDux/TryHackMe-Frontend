import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z.string().max(255).min(3),
  body: z.string().optional(),
  status: z.string().optional(),
  relatedTo: z.array(z.string()).optional().default([]),
});

export type CreateTaskType = z.infer<typeof CreateTaskSchema>;
