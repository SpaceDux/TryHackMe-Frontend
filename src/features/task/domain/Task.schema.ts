import { z } from "zod";
import { TaskStatus } from "../../../libs/enums/TaskStatus.enum";

export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string().optional().default(""),
  status: z.nativeEnum(TaskStatus),
  relatedTo: z.array(z.string()).optional().default([]),
  archived: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().nullable(),
});

export type TaskType = z.infer<typeof TaskSchema>;
