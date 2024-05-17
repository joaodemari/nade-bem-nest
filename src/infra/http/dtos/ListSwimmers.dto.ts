import { createZodDto } from 'nestjs-zod';
import { Either } from 'src/core/types/either';
import { swimmerSchema } from './swimmers/swimmer.dto';
import { periodSchema } from './periods/period.dto';
import { z } from 'zod';
import { NoCompleteInformation } from 'src/core/errors/no-complete-information-error';
import { PeriodEntity } from 'src/domain/entities/PeriodEntity';
import { SwimmerEntity } from 'src/domain/entities/swimmer-entity';

export const isString = (value: unknown): value is string =>
  typeof value === 'string';

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
});

export class ListSwimmersQueryDTO extends createZodDto(
  ListSwimmersQuerySchema,
) {}

export const ListSwimmersPropsSchema = z.object({
  page: z.number().positive().default(1),
  perPage: z.number().positive().default(12),
  search: z.string().default(''),
  teacherNumber: z.number(),
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
  period: PeriodEntity;
};

export type ListSwimmersResponse = Either<
  NoCompleteInformation,
  ListSwimmersResponseRight
>;
