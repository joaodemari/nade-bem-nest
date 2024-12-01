import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const safeBranchSchema = z.object({
  name: z.string(),
  url: z.string(),
  id: z.string(),
  logoUrl: z.string(),
});

export class SafeBranchDTO extends createZodDto(safeBranchSchema) {}
