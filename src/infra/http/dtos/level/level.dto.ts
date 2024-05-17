import { z } from 'zod';

export const levelSchema = z.object({
  observation: z.string(),
  areas: z.string(),
  id: z.string(),
  name: z.string(),
  levelNumber: z.number(),
  branchId: z.string(),
});
