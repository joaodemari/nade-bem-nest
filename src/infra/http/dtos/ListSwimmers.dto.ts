import { createZodDto } from 'nestjs-zod';
import { Either } from '../../../core/types/either';
import { swimmerSchema } from './swimmers/swimmer.dto';
import { periodSchema } from './periods/period.dto';
import { z } from 'zod';
import { NoCompleteInformation } from '../../../core/errors/no-complete-information-error';
import { PeriodEntity } from '../../../domain/entities/PeriodEntity';
import { SwimmerEntity } from '../../../domain/entities/swimmer-entity';

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
  periodStartDate: z.string().optional().default(Date.now().toString()),
});

export class ListSwimmersQueryDTO extends createZodDto(
  ListSwimmersQuerySchema,
) {}

export const ListSwimmersPropsSchema = z.object({
  page: z.number().positive().default(1),
  perPage: z.number().positive().default(12),
  search: z.string().default(''),
  teacherNumber: z.number(),
  onlyActive: z.boolean().default(false),
  branchId: z.string(),
  periodStartDate: z.string(),
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
  swimmers: SwimmerEntity[];
  numberOfPages: number;
  swimmersWithoutReports: number;
};

export type ListSwimmersResponse = Either<
  NoCompleteInformation,
  ListSwimmersResponseRight
>;
