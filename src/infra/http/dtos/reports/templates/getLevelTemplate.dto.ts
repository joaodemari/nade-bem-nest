import { Area, Level, Step } from '@prisma/client';

export type getLevelTemplateResponse =
  | ({
      areas: ({
        lastReportStepId: string;
        steps: Step[];
      } & Area)[];
    } & Level)
  | null;
