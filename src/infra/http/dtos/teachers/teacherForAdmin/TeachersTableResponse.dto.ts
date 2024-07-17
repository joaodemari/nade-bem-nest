import { z } from 'zod';

const TeachersTableRow = z.object({
  id: z.string(),
  teacherNumber: z.number(),
  name: z.string(),
  email: z.string(),
  activeSwimmers: z.number(),
  totalSwimmers: z.number(),
  totalReports: z.number(),
});

const TeachersTableResponseDto = z.object({
  maxPage: z.number(),
  thisPage: z.number(),
  perPage: z.number(),
  content: z.array(TeachersTableRow),
});

export type TeachersTableResponseDto = z.infer<typeof TeachersTableResponseDto>;


