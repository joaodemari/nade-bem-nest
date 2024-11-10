import { createZodDto } from 'nestjs-zod';
import { swimmerSchema } from './swimmers/swimmer.dto';
import { periodSchema } from './periods/period.dto';
import { z } from 'zod';
import { swimmerAndReport } from '../../../domain/services/swimmers.service';
import { Swimmer } from '@prisma/client';

export const isString = (value: unknown): value is string =>
  typeof value === 'string';

export const isBoolean = (value: unknown): value is string =>
  value === 'true' || value === 'false';

export const ListSwimmersQuerySchema = z.object({
  page: z.preprocess(
    (value) => (isString(value) ? parseInt(value) : value),
    z.number(),
  ),
  perPage: z.preprocess(
    (value) => (isString(value) ? parseInt(value) : value),
    z.number(),
  ),
  search: z.string().default(''),
  onlyActive: z.enum(['true', 'false']).optional().default('false'),
  periodId: z.string(),
  teacherAuthId: z.string().optional(),
});

export class ListSwimmersQueryDTO extends createZodDto(
  ListSwimmersQuerySchema,
) {}

export const ListSwimmersPropsSchema = z.object({
  page: z.number().positive().default(1),
  perPage: z.number().positive().default(12),
  search: z.string().default(''),
  teacherAuthId: z.string().optional(),
  onlyActive: z.boolean().default(true),
  branchId: z.string(),
  periodId: z.string(),
});

export class ListSwimmersProps extends createZodDto(ListSwimmersPropsSchema) {}

export const ListSwimmersResponseSchema = z.object({
  swimmers: z.array(swimmerSchema),
  numberOfPages: z.number(),
  swimmersWithoutReports: z.number(),
  period: periodSchema,
});

export class ListSwimmersResponseDTO extends createZodDto(
  ListSwimmersResponseSchema,
) {}

export type ListSwimmersResponseRight = {
  swimmers: swimmerAndReport[];
  numberOfPages: number;
  swimmersWithoutReports: number;
};

// ALL SWIMMERS

export const ListAllSwimmersQuerySchema = z.object({
  page: z.preprocess(
    (value) => (isString(value) ? parseInt(value) : value),
    z.number(),
  ),
  perPage: z.preprocess(
    (value) => (isString(value) ? parseInt(value) : value),
    z.number(),
  ),
  search: z.string().default(''),
  onlyActive: z.enum(['true', 'false']).optional().default('false'),
});

export class ListAllSwimmersQueryDTO extends createZodDto(
  ListAllSwimmersQuerySchema,
) {}

export const ListAllSwimmersPropsSchema = z.object({
  page: z.number().positive().default(1),
  perPage: z.number().positive().default(12),
  search: z.string().default(''),
  onlyActive: z.boolean().default(true),
  branchId: z.string(),
  teacherAuthId: z.string().optional(),
});

export class ListAllSwimmersProps extends createZodDto(
  ListAllSwimmersPropsSchema,
) {}

export type ListAllSwimmersResponseRight = {
  swimmers: Swimmer[];
  numberOfPages: number;
};
