import { z } from 'zod';

export const swimmerSchema = z.object({
  id: z.string(),
  memberNumber: z.number(),
  name: z.string(),
  photoUrl: z.string(),
  lastAccess: z.string(),
  actualLevelName: z.string(),
  teacherNumber: z.number().nullable(),
  lastReport: z.string().nullable(),
  lastReportId: z.string().nullable(),
});
