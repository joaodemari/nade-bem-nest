import { Area, Level, Step } from '@prisma/client';
import { NoCompleteInformation } from '../../../../../core/errors/no-complete-information-error';
import { Either } from '../../../../../core/types/either';

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
