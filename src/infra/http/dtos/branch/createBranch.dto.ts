import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z.string(),
  url: z.string(),
  apiKey: z.string(),
  logoUrl: z.string(),
});

export class CreateBranchDto extends createZodDto(createBranchSchema) {}
