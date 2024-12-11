import {
  Area,
  Branch,
  Level,
  Period,
  Step,
  Swimmer,
  Teacher,
} from '@prisma/client';

export abstract class ReportsRepository {
  abstract findReportsAreasStepsTeacherSwimmer(reportId: string): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        areas: ({
          lastReportStepId: string;
          steps: Step[];
        } & Area)[];
      } & Level)
    | null
  >;

  abstract findReportAreasSelectedSteps(reportId: string): Promise<{
    level: Level;
    approved: boolean;
    observation: string;
    areas: ({
      lastReportStepId: string;
      steps: Step[];
    } & Area)[];
  } | null>;

  abstract findManyBySwimmers(props: {
    swimmerIds: string[];
    periodId: string;
  }): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        areas: ({
          lastReportStepId: string;
          steps: Step[];
        } & Area)[];
      } & Level)[]
    | null
  >;

  abstract findManyByTeacher(props: {
    teacherId: string;
    periodId: string;
  }): Promise<
    | ({
        observation: string;
        swimmer: Swimmer;
        teacher: Teacher;
        period: Period;
        branch: Branch;
        areas: ({
          lastReportStepId: string;
          steps: Step[];
        } & Area)[];
      } & Level)[]
    | null
  >;

  abstract deleteInvalidReports(): Promise<void>;
}
