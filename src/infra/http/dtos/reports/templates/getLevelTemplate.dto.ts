import { Area, Level, Step } from '@prisma/client';

export type getLevelTemplateResponse =
  | ({
      areas: ({
        lastReportStepId: string;
        steps: Step[];
      } & Area)[];
    } & Level)
  | null;


  export type LevelAreasSteps = {
    areas: ({
      steps: Step[];
    } & Area)[];
  } & Level;
  
  export type ReportLevelAreaStepsSelected = {
    observation: string;
    approved: boolean;
    level: Level & {
      areas: (Area & {
        steps: Step[];
        selectedStepId: string;
      })[];
    };
  };