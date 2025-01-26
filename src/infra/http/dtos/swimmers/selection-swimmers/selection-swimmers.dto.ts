import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const isString = (value: unknown): value is string =>
  typeof value === 'string';

export const isBoolean = (value: unknown): value is string =>
  value === 'true' || value === 'false';

export const SelectionSwimmersByTeacherQuerySchema = z.object({
  page: z.preprocess(
    (value) => (isString(value) ? parseInt(value) : value),
    z.number(),
  ),
  perPage: z.preprocess(
    (value) => (isString(value) ? parseInt(value) : value),
    z.number(),
  ),
  search: z.string().default(''),
  periodId: z.string(),
});

export class SelectionSwimmersByTeacherQueryDTO extends createZodDto(
  SelectionSwimmersByTeacherQuerySchema,
) {}

export const SelectionSwimmersQuerySchema = z.object({
  page: z.preprocess(
    (value) => (isString(value) ? parseInt(value) : value),
    z.number(),
  ),
  perPage: z.preprocess(
    (value) => (isString(value) ? parseInt(value) : value),
    z.number(),
  ),
  search: z.string().default(''),
  periodId: z.string(),
  teacherAuthId: z.string(),
});

export class SelectionSwimmersQueryDTO extends createZodDto(
  SelectionSwimmersQuerySchema,
) {}
