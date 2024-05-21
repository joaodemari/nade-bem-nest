import { Area, Level, Step } from '@prisma/client';
import { NoCompleteInformation } from 'src/core/errors/no-complete-information-error';
import { Either } from 'src/core/types/either';

export type getLevelTemplateResponse = Either<
  NoCompleteInformation,
  | ({
      areas: ({
        lastReportStepId: string;
        steps: Step[];
      } & Area)[];
    } & Level)
  | null
>;
