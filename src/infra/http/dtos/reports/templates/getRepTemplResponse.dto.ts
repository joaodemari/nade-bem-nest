import { Step, Area, Level } from '@prisma/client';

export type GetRepTemplBySwimmerResponse =
  | ({
      observation: string;
      areas: ({ lastReportStepId: string; steps: Step[] } & Area)[];
    } & Level)
  | null;
