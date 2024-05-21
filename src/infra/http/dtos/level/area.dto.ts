import { z } from 'zod';
export const areaSchema = z.object({
  id: z.string(),
  name: z.string(),
  levelId: z.string(),
});
