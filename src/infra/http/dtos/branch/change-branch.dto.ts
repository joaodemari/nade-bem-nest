import { z } from 'zod';

const branchResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type BranchResponseDto = z.infer<typeof branchResponseSchema>;
