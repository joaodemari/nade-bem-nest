import { z } from 'zod';

export const postReportBodySchema = z.object({
  levelId: z.string().optional(),
  steps: z.array(z.string()),
  observation: z.string(),
  selectionId: z.string(),
});

export type postReportBodySchema = z.infer<typeof postReportBodySchema>;
